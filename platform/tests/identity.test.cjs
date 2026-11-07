const test = require("node:test");
const assert = require("node:assert/strict");
const { createCrashoutIdentity } = require("../services/crashout-identity.js");

function makeClient({ session = null, profile = null, link = null, rpcData = null, rpcError = null } = {}) {
  const calls = [];
  const client = {
    auth: {
      getSession: async () => ({ data: { session }, error: null }),
      signInWithOAuth: async (args) => { calls.push(["oauth", args]); return { data: {}, error: null }; },
      signInWithPassword: async (args) => { calls.push(["password", args]); return { data: {}, error: null }; },
      signUp: async (args) => { calls.push(["signup", args]); return { data: {}, error: null }; },
      signOut: async () => ({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } })
    },
    from: (table) => ({
      select: (columns) => ({
        eq: (column, value) => ({
          maybeSingle: async () => {
            calls.push(["select", table, columns, column, value]);
            return { data: table === "profiles" ? profile : link, error: null };
          }
        })
      })
    }),
    rpc: async (name, args) => { calls.push(["rpc", name, args]); return { data: rpcData, error: rpcError }; }
  };
  return { client, calls };
}

test("guest snapshot does not query private player data", async () => {
  const { client, calls } = makeClient();
  const identity = createCrashoutIdentity(client);
  assert.deepEqual(await identity.getSnapshot(), {
    connected: true, authenticated: false, user: null, profile: null, destination: null
  });
  assert.equal(calls.length, 0);
});

test("authenticated snapshot reads only own profile and REALMS link", async () => {
  const { client, calls } = makeClient({
    session: { user: { id: "user-1", email: "player@example.test" } },
    profile: { username: "player", player_id: "ABC123" },
    link: { external_player_id: "realm-1", linked_at: "2026-11-07T00:00:00Z" }
  });
  const snapshot = await createCrashoutIdentity(client).getSnapshot();
  assert.equal(snapshot.authenticated, true);
  assert.equal(snapshot.profile.username, "player");
  assert.equal(snapshot.destination.externalPlayerId, "realm-1");
  assert.deepEqual(calls.map(call => call[1]), ["profiles", "game_links"]);
  assert.equal(calls[1][4], "realms");
});

test("destination-link requests require a Crashout session", async () => {
  const { client, calls } = makeClient();
  await assert.rejects(createCrashoutIdentity(client).requestDestinationLink("create"), /Sign in/);
  assert.equal(calls.length, 0);
});

test("destination-link flow is restricted to existing or create", async () => {
  const { client } = makeClient({ session: { user: { id: "u1" } } });
  await assert.rejects(createCrashoutIdentity(client).requestDestinationLink("admin"), /Unsupported/);
});

test("destination-link response is checked and secure", async () => {
  const { client } = makeClient({
    session: { user: { id: "u1" } },
    rpcData: { token: "a".repeat(64), launch_url: "https://realms.example.test/link", flow: "create", expires_at: "2026-11-07T00:10:00Z" }
  });
  const result = await createCrashoutIdentity(client).requestDestinationLink("create");
  assert.equal(result.flow, "create");
  assert.equal(result.token.length, 64);
  assert.equal(result.launchUrl, "https://realms.example.test/link");
});

test("insecure launch URLs are rejected", async () => {
  const { client } = makeClient({
    session: { user: { id: "u1" } },
    rpcData: { token: "a".repeat(64), launch_url: "http://evil.example.test", expires_at: "2026-11-07T00:10:00Z" }
  });
  await assert.rejects(createCrashoutIdentity(client).requestDestinationLink("create"), /insecure/);
});

test("RPC errors are not converted into successful links", async () => {
  const { client } = makeClient({ session: { user: { id: "u1" } }, rpcError: new Error("Destination disabled") });
  await assert.rejects(createCrashoutIdentity(client).requestDestinationLink("create"), /Destination disabled/);
});

test("missing link payload is rejected", async () => {
  const { client } = makeClient({ session: { user: { id: "u1" } }, rpcData: {} });
  await assert.rejects(createCrashoutIdentity(client).requestDestinationLink("existing"), /incomplete/);
});

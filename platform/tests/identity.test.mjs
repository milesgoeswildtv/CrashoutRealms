import test from "node:test";
import assert from "node:assert/strict";
import { createCrashoutIdentity } from "../services/crashout-identity.mjs";

function makeClient({ session = null, profile = null, link = null, integration = null, rpcData = null, rpcError = null } = {}) {
  const calls = [];
  const client = {
    auth: {
      getSession: async () => ({ data: { session }, error: null }),
      signInWithOAuth: async args => { calls.push(["oauth", args]); return { data: {}, error: null }; },
      signInWithPassword: async args => { calls.push(["password", args]); return { data: {}, error: null }; },
      signUp: async args => { calls.push(["signup", args]); return { data: {}, error: null }; },
      signOut: async () => ({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } })
    },
    from: table => ({ select: columns => ({ eq: (column, value) => ({ maybeSingle: async () => {
      calls.push(["select", table, columns, column, value]);
      return { data: table === "profiles" ? profile : table === "game_links" ? link : integration, error: null };
    } }) }) }),
    rpc: async (name, args) => { calls.push(["rpc", name, args]); return { data: rpcData, error: rpcError }; }
  };
  return { client, calls };
}

test("guest snapshot does not query private player data", async () => {
  const { client, calls } = makeClient();
  assert.deepEqual(await createCrashoutIdentity(client).getSnapshot(), { connected: true, authenticated: false, user: null, profile: null, destination: null, integration: null });
  assert.equal(calls.length, 1);
  assert.equal(calls[0][1], "destination_integrations");
});
test("authenticated snapshot reads own profile and REALMS link", async () => {
  const { client, calls } = makeClient({ session: { user: { id: "user-1", email: "player@example.test" } }, profile: { username: "player", player_id: "ABC123" }, link: { external_player_id: "realm-1", linked_at: "2026-11-07T00:00:00Z" }, integration: { enabled: false, integration_state: "adapter_required" } });
  const snapshot = await createCrashoutIdentity(client).getSnapshot();
  assert.equal(snapshot.authenticated, true);
  assert.equal(snapshot.profile.username, "player");
  assert.equal(snapshot.destination.externalPlayerId, "realm-1");
  assert.equal(snapshot.integration.integration_state, "adapter_required");
  assert.deepEqual(calls.map(call => call[1]).sort(), ["destination_integrations", "game_links", "profiles"]);
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
  const { client } = makeClient({ session: { user: { id: "u1" } }, rpcData: { token: "a".repeat(64), launch_url: "https://realms.example.test/link", flow: "create", expires_at: "2026-11-07T00:10:00Z" } });
  const result = await createCrashoutIdentity(client).requestDestinationLink("create");
  assert.equal(result.flow, "create"); assert.equal(result.token.length, 64);
});
test("insecure launch URLs are rejected", async () => {
  const { client } = makeClient({ session: { user: { id: "u1" } }, rpcData: { token: "a".repeat(64), launch_url: "http://evil.example.test", expires_at: "2026-11-07T00:10:00Z" } });
  await assert.rejects(createCrashoutIdentity(client).requestDestinationLink("create"), /insecure/);
});
test("RPC errors are not converted into successful links", async () => {
  const { client } = makeClient({ session: { user: { id: "u1" } }, rpcError: new Error("Destination disabled") });
  await assert.rejects(createCrashoutIdentity(client).requestDestinationLink("create"), /Destination disabled/);
});
test("malformed or mismatched link proof is rejected", async () => {
  const { client } = makeClient({ session: { user: { id: "u1" } }, rpcData: { token: "not-a-token", launch_url: "https://realms.example.test", flow: "existing", expires_at: "2099-01-01T00:00:00Z" } });
  await assert.rejects(createCrashoutIdentity(client).requestDestinationLink("create"), /incomplete/);
});
test("expired link proof is rejected", async () => {
  const { client } = makeClient({ session: { user: { id: "u1" } }, rpcData: { token: "a".repeat(64), launch_url: "https://realms.example.test", flow: "create", expires_at: "2020-01-01T00:00:00Z" } });
  await assert.rejects(createCrashoutIdentity(client).requestDestinationLink("create"), /incomplete/);
});
test("missing link payload is rejected", async () => {
  const { client } = makeClient({ session: { user: { id: "u1" } }, rpcData: {} });
  await assert.rejects(createCrashoutIdentity(client).requestDestinationLink("existing"), /incomplete/);
});
test("Discord OAuth uses the existing Crashout provider and app redirect", async () => {
  const { client, calls } = makeClient();
  await createCrashoutIdentity(client, { redirectTo: "https://realms.example.test/" }).signInWithDiscord();
  assert.equal(calls[0][1].provider, "discord");
  assert.equal(calls[0][1].options.redirectTo, "https://realms.example.test/");
});
test("email sign-in trims the address and preserves the password", async () => {
  const { client, calls } = makeClient();
  await createCrashoutIdentity(client).signInWithPassword(" player@example.test ", "safe-password");
  assert.deepEqual(calls[0][1], { email: "player@example.test", password: "safe-password" });
});

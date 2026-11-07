const DESTINATION_KEY = "realms";
function requireData(result, fallback) {
  if (result?.error) throw result.error;
  return result?.data ?? fallback;
}
export function createCrashoutIdentity(client, options = {}) {
  if (!client?.auth || !client?.rpc || !client?.from) throw new TypeError("A configured Crashout Supabase client is required.");
  const destinationKey = options.destinationKey ?? DESTINATION_KEY;
  const now = options.now ?? (() => Date.now());
  async function getSnapshot() {
    const sessionResult = await client.auth.getSession();
    const session = requireData(sessionResult, null)?.session ?? null;
    if (!session?.user) return { connected: true, authenticated: false, user: null, profile: null, destination: null };
    const user = session.user;
    const [profileResult, linkResult] = await Promise.all([
      client.from("profiles").select("player_id,username,display_name,avatar_url").eq("id", user.id).maybeSingle(),
      client.from("game_links").select("external_player_id,linked_at").eq("game_key", destinationKey).maybeSingle()
    ]);
    const profile = requireData(profileResult, null), link = requireData(linkResult, null);
    return {
      connected: true, authenticated: true,
      user: { id: user.id, email: user.email ?? null }, profile,
      destination: link ? { linked: true, externalPlayerId: link.external_player_id, linkedAt: link.linked_at } : { linked: false }
    };
  }
  function subscribe(listener) {
    const { data } = client.auth.onAuthStateChange((_event, session) => {
      queueMicrotask(() => getSnapshot().then(listener).catch(() => listener({
        connected: true, authenticated: Boolean(session?.user),
        user: session?.user ? { id: session.user.id, email: session.user.email ?? null } : null,
        profile: null, destination: null, refreshFailed: true
      })));
    });
    return () => data?.subscription?.unsubscribe?.();
  }
  async function signInWithDiscord() {
    const result = await client.auth.signInWithOAuth({ provider: "discord", options: { redirectTo: options.redirectTo ?? window.location.origin + window.location.pathname } });
    if (result.error) throw result.error;
    return result.data;
  }
  async function signInWithPassword(email, password) {
    const result = await client.auth.signInWithPassword({ email: email.trim(), password });
    if (result.error) throw result.error;
    return result.data;
  }
  async function createCrashoutAccount(email, password) {
    const result = await client.auth.signUp({ email: email.trim(), password, options: { emailRedirectTo: options.redirectTo ?? window.location.origin + window.location.pathname } });
    if (result.error) throw result.error;
    return result.data;
  }
  async function signOut() {
    const result = await client.auth.signOut();
    if (result.error) throw result.error;
  }
  async function requestDestinationLink(flow) {
    if (flow !== "existing" && flow !== "create") throw new TypeError("Unsupported account-link flow.");
    const sessionResult = await client.auth.getSession();
    if (!requireData(sessionResult, null)?.session?.user) throw new Error("Sign in to Crashout before linking REALMS.");
    const payload = requireData(await client.rpc("start_destination_link", { p_game_key: destinationKey, p_flow: flow }), null);
    if (!payload || typeof payload.token !== "string" || !/^[a-f0-9]{64}$/i.test(payload.token) || typeof payload.launch_url !== "string" || typeof payload.expires_at !== "string" || payload.flow !== flow || !Number.isFinite(Date.parse(payload.expires_at)) || Date.parse(payload.expires_at) <= now()) {
      throw new Error("Crashout returned an incomplete destination-link response.");
    }
    const launch = new URL(payload.launch_url);
    if (launch.protocol !== "https:" && launch.hostname !== "localhost") throw new Error("Crashout returned an insecure destination launch URL.");
    return { token: payload.token, launchUrl: launch.toString(), flow: payload.flow, expiresAt: payload.expires_at };
  }
  return Object.freeze({ getSnapshot, subscribe, signInWithDiscord, signInWithPassword, createCrashoutAccount, signOut, requestDestinationLink });
}

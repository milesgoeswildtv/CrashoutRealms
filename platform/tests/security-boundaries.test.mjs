import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const config = await readFile(new URL("../config.js", import.meta.url), "utf8");
const app = await readFile(new URL("../app.js", import.meta.url), "utf8");
const identity = await readFile(new URL("../services/crashout-identity.mjs", import.meta.url), "utf8");
const html = await readFile(new URL("../index.html", import.meta.url), "utf8");

test("browser config contains only the shared public Crashout client settings", () => {
  assert.match(config, /sb_publishable_/);
  assert.doesNotMatch(config, /service[_-]?role|secret[_-]?key|adapter[_-]?key/i);
});
test("browser never creates a second auth token store", () => {
  assert.doesNotMatch(app + identity, /localStorage\.(setItem|getItem)\([^)]*(token|session)/i);
  assert.doesNotMatch(app + identity, /CRASHOUT_REALMS_ADAPTER_KEY|SUPABASE_SERVICE_ROLE_KEY/);
  assert.match(app, /passwordInput\.value = ""/);
});
test("destination completion stays server-side", () => {
  assert.match(identity, /start_destination_link/);
  assert.doesNotMatch(identity, /complete_destination_link/);
  assert.match(html, /id="link-status"/);
  assert.match(app, /Crashout currently lists REALMS as unavailable/);
});
test("profile reads are scoped to the authenticated user and destination", () => {
  assert.match(identity, /eq\("id", user\.id\)/);
  assert.match(identity, /eq\("game_key", destinationKey\)/);
});
test("browser configuration is pinned to the shared Crashout project", async () => {
  assert.match(config, /qcmfnkuyinhfdxnuvneb\.supabase\.co/);
  assert.match(config, /destinationKey: "realms"/);
  assert.ok((await readFile(new URL("../app.js", import.meta.url), "utf8")).includes("@supabase/supabase-js@2.119.0"));
});

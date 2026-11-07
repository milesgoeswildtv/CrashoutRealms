// Public browser configuration only. Never place service-role or adapter secrets here.
export const REALMS_CONFIG = Object.freeze({
  crashoutUrl: "https://qcmfnkuyinhfdxnuvneb.supabase.co",
  crashoutPublishableKey: "sb_publishable_ekaBj5AcyhqE__ikLdMjSA_znoyLKqY",
  destinationKey: "realms",
  authRedirectTo: window.location.origin + window.location.pathname
});

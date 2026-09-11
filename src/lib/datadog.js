import { datadogRum } from "@datadog/browser-rum";

export function initDatadog() {
  const env = import.meta.env || {};
  const appId = env.VITE_DD_APPLICATION_ID || env.VITE_DD_APP_ID;
  const clientToken = env.VITE_DD_CLIENT_TOKEN;
  const site = env.VITE_DD_SITE || "us5.datadoghq.com";
  const service = env.VITE_DD_SERVICE || "sans-sekhmet-core";
  const rumEnv = env.VITE_DD_ENV || "production";

  if (!appId || !clientToken) {
    console.log("[SANS Datadog] RUM tokens not configured for this build — skipping init.");
    return { RUM_STATUS: "not configured", isReal: false };
  }

  try {
    datadogRum.init({
      applicationId: appId,
      clientToken: clientToken,
      site: site,
      service: service,
      env: rumEnv,
      version: "1.0.0",
      sessionSampleRate: 100,
      sessionReplaySampleRate: 20,
      trackUserInteractions: true,
      trackResources: true,
      trackLongTasks: true,
      defaultPrivacyLevel: "mask-user-input",
    });
    datadogRum.startSessionReplayRecording();
    console.log(`[SANS Datadog] RUM initiated for service: ${service} on site: ${site}`);
    return { RUM_STATUS: "active (live)", isReal: true };
  } catch (error) {
    console.warn("[SANS Datadog] RUM init failed:", error?.message || error);
    return { RUM_STATUS: "error", isReal: false };
  }
}

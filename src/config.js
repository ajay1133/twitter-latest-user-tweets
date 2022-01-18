
import authConfigJson from "./auth_config.json";

export function getConfig() {
  const audience =
    authConfigJson.audience && authConfigJson.audience !== "YOUR_API_IDENTIFIER"
      ? authConfigJson.audience
      : null;
  return {
    ...authConfigJson,
    ...(audience ? { audience } : null),
  };
}

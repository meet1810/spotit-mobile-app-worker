// Fallback to localhost if not set, but prioritize the env var
// Note: In Expo, you often need 'babel-plugin-transform-inline-environment-variables' or similar for process.env to work fully.
// However, the user explicitly stated they made a .env file.
// We will also export it so it can be easily changed if needed.

// Hardcoded from .env to ensure it works without babel config
export const NATIVE_PUBLIC_URL = 'https://fm0p8b2j-3000.inc1.devtunnels.ms'; 

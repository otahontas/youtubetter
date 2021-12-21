export const isProduction = process.env.NODE_ENV === "production";
export const trackerUrl = isProduction
  ? "wss://youtubetter.toska.cs.helsinki.fi/tracker"
  : "ws://localhost:8080";

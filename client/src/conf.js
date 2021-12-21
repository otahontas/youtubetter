export const isProduction = process.env.NODE_ENV === "production";
export const trackerUrl = isProduction
  ? "ws://youtubetter.toska.cs.helsinki.fi"
  : "ws://localhost:3000";
export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      PORT: "4000";
      APP_URL: string;
      ORIGIN: string;
      JWT_SECRET: string;
    }
  }
}

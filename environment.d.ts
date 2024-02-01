declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      DB_URL: string;
      ACCESS_TOKEN_SECRET: string;
    }
  }
}

export {};

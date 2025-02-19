declare namespace NodeJS {
  interface ProcessEnv {
    TEST_SEED_PHRASE: string;
    TEST_PRIVATE_KEY: string;
    TEST_WALLET_PASSWORD: string;
    TEST_WALLET_ADDRESS: string;
  }
}

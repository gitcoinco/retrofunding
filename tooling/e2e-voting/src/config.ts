import Dotenv from "dotenv";

Dotenv.config({ path: [".env", ".env.test"], override: true });

const SEED_PHRASE = process.env.TEST_SEED_PHRASE!;
const PRIVATE_KEY = process.env.TEST_PRIVATE_KEY!;
const PASSWORD = process.env.TEST_WALLET_PASSWORD!;
const WALLET_ADDRESS = process.env.TEST_WALLET_ADDRESS!;

export { SEED_PHRASE, PRIVATE_KEY, PASSWORD, WALLET_ADDRESS };

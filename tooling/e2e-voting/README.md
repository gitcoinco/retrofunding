# E2E Voting Tests

End-to-end testing suite for the RetroFunding voting application using Playwright and Synpress.

## Setup

```bash
# Install dependencies
pnpm install

# Install Chromium browser for Playwright
pnpm playwright:browser

```

## Environment Setup

Create a `.env` file in the root of this package with your testing configuration. You can copy from `.env.example`:

```bash
cp .env.example .env
```

Required environment variables:

- `TEST_SEED_PHRASE` - MetaMask wallet seed phrase for testing
- `TEST_PRIVATE_KEY` - Private key of the testing wallet
- `TEST_WALLET_PASSWORD` - MetaMask wallet password (default: playwright)
- `TEST_WALLET_ADDRESS` - Public address of the testing wallet

## Scripts

- `pnpm dev` - Runs the voting app locally on port 5177
- `pnpm e2e` - Runs E2E tests in Chromium
- `pnpm e2e:trace` - Runs tests with tracing enabled for debugging
- `pnpm e2e:debug` - Runs tests in debug mode with Playwright Inspector
- `pnpm wallet-cache` - Sets up MetaMask wallet configuration using Synpress
- `pnpm wallet-cache:headless` - Sets up MetaMask wallet in headless mode

## Project Structure

```
.
├── e2e/ # E2E test specifications
├── fixtures/ # Test fixtures
├── mocks/ # Mock data for tests
├── wallet-setup/ # MetaMask wallet configuration
├── playwright.config.ts # Playwright configuration
└── types.d.ts # Global type definitions
```

## Testing

The test suite includes:

- Wallet connection tests
- Voting page functionality
- Error handling and not-found scenarios

### Running Tests

1. First, set up the wallet cache:

```bash
pnpm wallet-cache
```

2. Then, run the tests:

```bash
pnpm e2e
```

### Debugging

To use the Playwright Inspector, run:

```bash
pnpm e2e:debug
```

## Development

- `pnpm check-types` - Type checking
- `pnpm lint` - Lint checks
- `pnpm format` - Format code using Prettier

## Dependencies

- Playwright v1.44.0
- Synpress v4.0.0-alpha.7
- ethers v5.7.2

export const waitUntilIndexerSynced = async ({
  chainId,
  blockNumber,
}: {
  chainId: number;
  blockNumber: bigint;
}) => {
  const endpoint = `${import.meta.env.VITE_INDEXER_V2_API_URL}/graphql`;
  const pollIntervalInMs = 1000;

  async function pollIndexer() {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query getBlockNumberQuery($chainId: Int!) {
            subscriptions(
              filter: { chainId: { equalTo: $chainId }, toBlock: { equalTo: "latest" } }
            ) {
              chainId
              indexedToBlock
            }
          }
        `,
        variables: {
          chainId,
        },
      }),
    });

    if (response.status === 200) {
      const {
        data,
      }: {
        data: {
          subscriptions: { chainId: number; indexedToBlock: string }[];
        };
      } = await response.json();

      const subscriptions = data?.subscriptions || [];

      if (subscriptions.length > 0) {
        const currentBlockNumber = BigInt(
          subscriptions.reduce(
            (minBlock, sub) =>
              BigInt(sub.indexedToBlock) < BigInt(minBlock) ? sub.indexedToBlock : minBlock,
            subscriptions[0].indexedToBlock,
          ),
        );

        if (currentBlockNumber >= blockNumber) {
          return true;
        }
      }
    }

    return false;
  }

  while (!(await pollIndexer())) {
    await new Promise((resolve) => setTimeout(resolve, pollIntervalInMs));
  }
};

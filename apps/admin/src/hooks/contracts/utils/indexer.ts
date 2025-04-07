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
            eventsRegistry(
              where: { chainId: { _eq: $chainId } }
            ) {
              chainId
              blockNumber
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
          eventsRegistry: { chainId: number; blockNumber: bigint }[];
        };
      } = await response.json();

      const eventsRegistry = data?.eventsRegistry || [];

      if (eventsRegistry.length > 0) {
        const currentBlockNumber = BigInt(
          eventsRegistry.reduce(
            (minBlock, event) =>
              BigInt(event.blockNumber) < BigInt(minBlock) ? event.blockNumber : minBlock,
            eventsRegistry[0].blockNumber,
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

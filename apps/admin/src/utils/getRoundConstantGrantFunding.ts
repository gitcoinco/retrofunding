export const getRoundConstantGrantFunding = (roundId: string, chainId: string) => {
  const constantFunding = import.meta.env.VITE_CONSTANT_GRANT_FUNDING_ROUNDS;
  if (!constantFunding) return 0;
  const constantFundingAmount = constantFunding
    .split(",")
    .find((item: string) => item.split(":")[0] === roundId && item.split(":")[1] === chainId);
  if (!constantFundingAmount) return 0;
  return Number(constantFundingAmount.split(":")[2]);
};

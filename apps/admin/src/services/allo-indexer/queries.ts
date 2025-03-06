import { gql } from "graphql-request";

export const getProgramsAndRoundsByUserAndTagQuery = gql`
  query ($userAddress: String!, $chainIds: [Int!]!, $tags: [String!]!) {
    projects(
      # orderBy: PRIMARY_KEY_DESC # FIXME
      first: 100
      where: {
        tags: { _contains: $tags }
        chainId: { _in: $chainIds }
        projectRoles: { address: { _eq: $userAddress } }
      }
    ) {
      id
      name
      chainId
      metadata
      createdAtBlock
      projectRoles {
        address
        role
      }
      retroRounds: rounds(
        where: {
          strategyName: { _eq: "allov2.EasyRetroFundingStrategy" }
          roundRoles: { address: { _eq: $userAddress } }
        }
      ) {
        id
        roundMetadata
        matchTokenAddress
        applicationsEndTime
        applicationsStartTime
        donationsEndTime
        donationsStartTime
        createdAtBlock
        strategyName
        project {
          id
          name
          chainId
        }
        roundRoles {
          address
          role
        }
      }
      qfRounds: rounds(
        filter: {
          strategyName: { _eq: "allov2.DonationVotingMerkleDistributionDirectTransferStrategy" }
          roundRoles: { address: { _eq: $userAddress } }
        }
      ) {
        id
      }
      dgRounds: rounds(
        filter: {
          strategyName: { _eq: "allov2.DirectGrantsLiteStrategy" }
          roundRoles: { address: { _eq: $userAddress } }
        }
      ) {
        id
      }
    }
  }
`;

export const getProgramByIdAndChainIdQuery = gql`
  query ($programId: String!, $chainId: Int!) {
    projects(where: { id: { _eq: $programId }, chainId: { _eq: $chainId } }) {
      name
      metadata
      chainId
      id
      projectRoles {
        address
        role
      }
    }
  }
`;

export const getRoundByChainIdAndPoolIdQuery = gql`
  query ($chainId: Int!, $poolId: String!) {
    round(id: $poolId, chainId: $chainId) {
      id
      chainId
      strategyAddress
      roundMetadata
      applicationMetadata
      matchTokenAddress
      applicationsEndTime
      applicationsStartTime
      donationsEndTime
      donationsStartTime
      createdAtBlock
      strategyName
      project {
        id
        name
        chainId
      }
      roles {
        address
        role
      }
      applications {
        id
        anchorAddress
        metadata
        status
        distributionTransaction
      }
    }
  }
`;

import { gql } from "graphql-request";

export const getProgramsAndRoundsByUserQuery = gql`
  query ($userAddress: String!, $chainIds: [Int!]!) {
    projects(
      orderBy: { timestamp: DESC }
      where: {
        tags: { _contains: ["allo-v2", "program"] }
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
        where: {
          strategyName: { _eq: "allov2.DonationVotingMerkleDistributionDirectTransferStrategy" }
          roundRoles: { address: { _eq: $userAddress } }
        }
      ) {
        id
      }
      dgRounds: rounds(
        where: {
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
    rounds(where: { id: { _eq: $poolId }, chainId: { _eq: $chainId } }) {
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
      roundRoles {
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

export const getRolesByChainIdAndPoolIdQuery = gql`
  query ($chainId: Int!, $poolId: String!) {
    rounds(where: { chainId: { _eq: $chainId }, id: { _eq: $poolId } }) {
      roundRoles {
        address
      }
    }
  }
`;

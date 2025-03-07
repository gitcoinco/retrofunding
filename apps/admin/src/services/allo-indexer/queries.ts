import { gql } from "graphql-request";

export const getProgramsAndRoundsByUserAndTagQuery = gql`
  query ($userAddress: String!, $chainIds: [Int!]!, $tags: [String!]!) {
    projects(
      orderBy: PRIMARY_KEY_DESC
      first: 100
      filter: {
        tags: { contains: $tags }
        chainId: { in: $chainIds }
        roles: { some: { address: { equalTo: $userAddress } } }
      }
    ) {
      id
      name
      chainId
      metadata
      createdAtBlock
      roles {
        address
        role
      }
      retroRounds: rounds(
        filter: {
          strategyName: { equalTo: "allov2.EasyRetroFundingStrategy" }
          roles: { some: { address: { equalTo: $userAddress } } }
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
        roles {
          address
          role
        }
      }
      qfRounds: rounds(
        filter: {
          strategyName: { equalTo: "allov2.DonationVotingMerkleDistributionDirectTransferStrategy" }
          roles: { some: { address: { equalTo: $userAddress } } }
        }
      ) {
        id
      }
      dgRounds: rounds(
        filter: {
          strategyName: { equalTo: "allov2.DirectGrantsLiteStrategy" }
          roles: { some: { address: { equalTo: $userAddress } } }
        }
      ) {
        id
      }
    }
  }
`;

export const getProgramByIdAndChainIdQuery = gql`
  query ($programId: String!, $chainId: Int!) {
    projects(filter: { id: { equalTo: $programId }, chainId: { equalTo: $chainId } }) {
      name
      metadata
      chainId
      id
      roles {
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

export const getRolesByChainIdAndPoolIdQuery = gql`
  query ($chainId: Int!, $poolId: String!) {
    rounds(filter: { chainId: { equalTo: $chainId }, id: { equalTo: $poolId } }) {
      roles {
        address
      }
    }
  }
`;

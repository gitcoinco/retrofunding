import { gql } from "graphql-request";

export const getRoundQuery = gql`
  query getRoundByIdAndChainId($roundId: String!, $chainId: Int!) {
    round(chainId: $chainId, id: $roundId) {
      id
      roundMetadata
      roles {
        address
        role
      }
      applicationsEndTime
      applicationsStartTime
      donationsEndTime
      donationsStartTime
      strategyName
      createdAtBlock
    }
  }
`;

export const getRoundWithApplicationsQuery = gql`
  query getRoundByIdAndChainId($roundId: String!, $chainId: Int!) {
    round(chainId: $chainId, id: $roundId) {
      id
      roundMetadata
      roles {
        address
        role
      }
      applicationsEndTime
      applicationsStartTime
      donationsEndTime
      donationsStartTime
      strategyName
      createdAtBlock
      applications {
        id
        metadata
      }
    }
  }
`;

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
        applicationsEndTime
        applicationsStartTime
        donationsEndTime
        donationsStartTime
        createdAtBlock
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
      metadata
      chainId
      id
    }
  }
`;

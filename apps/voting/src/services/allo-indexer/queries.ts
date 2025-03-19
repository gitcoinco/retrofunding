import { gql } from "graphql-request";

export const getRoundWithApplicationsQuery = gql`
  query getRoundByIdAndChainId($roundId: String!, $chainId: Int!) {
    rounds(where: { id: { _eq: $roundId }, chainId: { _eq: $chainId } }) {
      id
      roundMetadata
      roundRoles {
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

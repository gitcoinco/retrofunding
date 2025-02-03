import { gql } from "graphql-request";

export const getVotersQuery = gql`
  query getVoters($alloPoolId: String!, $chainId: Int!) {
    pools(filter: { alloPoolId: { equalTo: $alloPoolId }, chainId: { equalTo: $chainId } }) {
      eligibilityCriteria {
        data
      }
    }
  }
`;

export const getMetricsQuery = gql`
  query getMetrics {
    metrics(filter: { enabled: { equalTo: true } }) {
      id
      identifier
      title
      description
      orientation
    }
  }
`;

export const getFilteredMetricsQuery = gql`
  query getFilteredMetrics($identifiers: [String!]!) {
    metrics(
      filter: {
        and: [
          { enabled: { equalTo: true } },
          { identifier: { in: $identifiers } }
        ]
      }
    ) {
      id
      identifier
      title
      description
      orientation
    }
  }
`;

export const getPoolQuery = gql`
  query getPoolMetrics($alloPoolId: String!, $chainId: Int!) {
    pools(filter: { alloPoolId: { equalTo: $alloPoolId }, chainId: { equalTo: $chainId } }) {
      alloPoolId
      chainId
      eligibilityCriteria {
        eligibilityType
        data
      }
      metricIdentifiers
      distributionData
    }
  }
`;

export const getPoolDistributionQuery = gql`
  query getPoolDistribution($alloPoolId: String!, $chainId: Int!) {
    pools(filter: { alloPoolId: { equalTo: $alloPoolId }, chainId: { equalTo: $chainId } }) {
      distributionData
    }
  }
`;

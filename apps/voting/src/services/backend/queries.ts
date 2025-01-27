import { gql } from "graphql-request";

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

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

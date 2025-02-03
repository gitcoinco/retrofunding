interface RetroVoteValue {
  metricId: string;
  name: string;
  amount: number;
}

export interface RetroVoteFormData {
  metrics: RetroVoteValue[];
}

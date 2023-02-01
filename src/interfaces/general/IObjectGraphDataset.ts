export interface IObjectGraphDataset {
  labels: string[];
  datasets: IGraphDataset[];
}

export interface IGraphDataset {
  id: number;
  name: string;
  label: string;
  emoji: string;
  backgroundColor: string;
  data: number[];
}

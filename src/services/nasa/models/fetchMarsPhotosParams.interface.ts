export interface IFetchMarsPhotosParams {
  rover: 'curiosity' | 'opportunity' | 'spirit';
  sol?: number;
  earth_date?: string;
  camera?: string;
  page?: number;
}
export interface Table {
  viewMode?: "3D" | "2D";
  zoom?: number;
  center?: [number, number];
  layers?: any[];
  mapStyle?: string;
  [key: string]: any;
}
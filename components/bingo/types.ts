export interface Cell {
  id: string;
  content: string;
  icon?: string ;
  marked: boolean;
}

export interface Position {
  x: number;
  y: number;
}
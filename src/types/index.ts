export interface Note {
  id: string;
  content: string;
  tags: string[];
  createdAt: number;
}

export interface Tag {
  name: string;
  color: string;
}
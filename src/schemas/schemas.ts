export interface BookSchema {
  id: string;
  title: string;
  author: string;
  publicationYear: number;
  availabilityStatus: boolean;
  createdAt: Date;
}

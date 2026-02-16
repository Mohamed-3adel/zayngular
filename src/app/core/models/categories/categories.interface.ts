export interface CategoriesResponse {
  results: number;
  metadata: Metadata;
  data: Categories[];
}

export interface Metadata {
  currentPage: number;
  numberOfPages: number;
  limit: number;
}

export interface Categories {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

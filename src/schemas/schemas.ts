export interface UserCreate {
  name: string; 
  email: string; 
  password: string;
}

export interface AuthContextSchema {
  authLevel: number; 
  token: string; 
  user: {name: string; email: string; role: string}; 
  loginAction: any; 
  logOut: any
}

export interface BookPublic {
  _id: string;
  title: string;
  author: string;
  publicationYear: number;
  availabilityStatus: boolean;
  createdAt: Date;
}


export interface BookCreate { 
  title: string; 
  author: string; 
  isbn: string;
  publicationYear: number;
  availabilityStatus: boolean; 
}
export const initBook: BookCreate = { title: '', author: '', isbn: '', publicationYear: 1970, availabilityStatus: false };

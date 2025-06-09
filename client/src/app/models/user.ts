export interface User {
  _id: string;
  name: string;
  email: string;
  // Do not include password here unless needed only for registration
  createdAt?: string;
  updatedAt?: string;
}

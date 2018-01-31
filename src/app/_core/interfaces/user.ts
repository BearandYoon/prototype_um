export interface IUser {
  id: string;
  email: string;
  name: string;
  admin: boolean;
  photo?: string;
  created_at?: string;
  updated_at?: string;
}

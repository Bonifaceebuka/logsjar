export interface IUser {
  id?: number;
  email: string;
  username: string;
  avatar?: string;
  fullname: string;
  first_name?: string;
  last_name?: string;
  phone: string;
  role?: string;
  status?: string;
  is_verified?: boolean;
  user_status?: string;
  created_at?: string;
  updated_at?: string;
}

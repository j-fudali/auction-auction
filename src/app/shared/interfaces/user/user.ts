export interface User {
  id_user: number;
  username: string;
  first_name?: string;
  last_name?: string;
  email: string;
  phone?: number;
  birth_date: string;
  avatar?: string;
  country?: string;
  province?: string;
  postcode?: string;
  city?: string;
  street?: string;
  created_at: string;
}

export interface Message {
  id_sender: number;
  content: string;
  created_at: string;
  is_read: 0 | 1;
  image: string | null;
}

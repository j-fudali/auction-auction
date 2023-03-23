export interface Message {
  id_sender: number;
  content: string;
  created_at: string;
  is_read: number;
  image: string | null;
}

export interface Message {
  id_sender: number;
  content: string;
  created_at: Date;
  is_read: boolean;
  images: string[];
}

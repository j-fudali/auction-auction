export interface Discussion {
  id_discussion: number;
  id_sender: number;
  content: string;
  created_at: string;
  is_read: 1 | 0; 
  discussion_creator: {
    id_user: number;
    username: string;
  }
  item: {
    id_item: number;
    name: string;
    creator_username: string;
    image: string;
  }
}
export interface Discussion {
  id_discussion: number;
  id_sender: number;
  content: string;
  created_at: string;
  is_read: 1 | 0; 
  discussion_creator: {
    id_user: number;
    username: string;
    avatar: string;
    last_online: string;
  }
  item: {
    id_item: number;
    name: string;
    image: string;
    id_creator: number;
    creator_username: string;
    creator_avatar: string;
    creator_last_online: string;
  }
}
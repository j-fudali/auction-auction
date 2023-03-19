export interface ParticularItem {
  name: string;
  description: string;
  creator: {
    id_user: number;
    username: string;
    avatar: string;
    last_online: string;
  }
  category: string;
  starting_price: number;
  starting_time: string;
  id_winner: number;
  ending_price: number;
  ending_time: string;
  is_closed: number;
  max_bid: number;
  id_bidder: number;
  images: string[];
}

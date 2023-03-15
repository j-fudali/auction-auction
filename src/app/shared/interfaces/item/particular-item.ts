export interface ParticularItem {
  name: string;
  description: string;
  creator: {
    id_user: string;
    username: string;
    avatar: string;
    last_online: string;
  }
  category: string;
  starting_price: string;
  starting_time: string;
  id_winner: string;
  ending_price: string;
  ending_time: string;
  is_closed: string;
  max_bid: string;
  id_bidder: string;
  images: string[];
}

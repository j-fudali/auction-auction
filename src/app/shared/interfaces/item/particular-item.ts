export interface ParticularItem {
  name: string;
  description: string;
  id_creator: number;
  category: string;
  starting_price: number;
  starting_time: Date;
  id_winner: number;
  ending_price: number;
  ending_time: Date;
  is_closed: string;
  max_bid: number;
  id_bidder: number;
  images: string[];
}

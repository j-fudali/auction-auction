export interface Item {
  id_item: number;
  name: string;
  description: string;
  creator: {
    id_user: number;
    username: string;
    avatar: string;
  }
  category: string;
  starting_price: number;
  starting_time: string;
  ending_price: number;
  ending_time: string;
  max_bid: number;
  id_bidder: number;
  id_winner?: number;
  image: string;
}

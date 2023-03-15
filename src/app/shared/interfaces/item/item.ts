export interface Item {
  id_item: number;
  name: string;
  description: string;
  creator: {
    id_user: string;
    username: string;
    avatar: string;
  }
  category: string;
  starting_price: string;
  starting_time: string;
  ending_price: string;
  ending_time: string;
  max_bid: string;
  id_bidder: string;
  image: string;
}

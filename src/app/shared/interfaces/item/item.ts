export interface Item {
  id_item: number;
  name: string;
  description: string;
  id_creator: number;
  category: string;
  starting_price: number;
  starting_time: Date;
  ending_price: number;
  ending_time: Date;
  max_bid: number;
  id_bidder: number;
  image: string;
}

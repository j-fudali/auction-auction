import { Message } from './message';
export interface Chat {
  id_item: number;
  id_creator: number;
  id_user: number;
  pages: number;
  current_page: number;
  result: Message[];
}

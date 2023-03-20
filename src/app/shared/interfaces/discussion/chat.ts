import { PaginatedResponse } from '../paginated-response';
import { Message } from './message';
export interface Chat extends PaginatedResponse<Message>{
  id_item: number;
  id_creator: number;
  id_user: number;
}

import { inject, Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/core/http/user.service';
import { User } from '../interfaces/user/user';

@Pipe({
  name: 'getBidderData',
  standalone: true
})
export class GetBidderDataPipe implements PipeTransform {
  private userSerivce = inject(UserService)
  transform(value: number, ...args: unknown[]): Observable<User> {
    return this.userSerivce.getUserById(value);
  }

}

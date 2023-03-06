import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateDifference',
  standalone: true
})
export class DateDifferencePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}

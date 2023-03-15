import { Pipe, PipeTransform } from "@angular/core";
import { DateTime } from "luxon";
import { Observable, of, timer } from "rxjs";
import { map } from "rxjs/operators";

@Pipe({
  name: "timeLeft",
  standalone: true,
})
export class TimeLeftPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): Observable<string> {
    const endingTime = DateTime.fromFormat(value, 'yyyy-MM-dd hh:mm:ss', {zone: 'utc'}).toLocal();
    return timer(0, 1000).pipe(
      map(() => {
        const difference = endingTime.diff(DateTime.now().toLocal())
        .shiftTo("days", "hours", "minutes", "seconds")
        if (difference.toMillis() >= 0) {
           difference.toObject()
           return`${difference.days} days, ${difference.hours} hours, ${
            difference.minutes
          } min., ${Math.floor(difference.seconds!)} sec.`;
        }
        else{
          return "End";
        }
      })
    );
  }
}

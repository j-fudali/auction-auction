import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { DiscussionsService } from 'src/app/core/http/discussions.service';
import { Discussion } from 'src/app/shared/interfaces/discussion/discussion';

@Injectable({
  providedIn: 'root'
})
export class DiscussionsStore {
  private discussionsService = inject(DiscussionsService)
  private readonly _discussions = new BehaviorSubject<Discussion[]>([])
  readonly discussions$ = this._discussions.asObservable()
  pages: number;
  currentPage: number;
  selectedDiscussion: number;
  set discussions(val: Discussion[]){
    this._discussions.next(val)
  }
  get discussions(){
    return this._discussions.getValue()
  }
  init(){
    this.discussionsService.getAllDiscussions()
    .pipe(
      tap( res => {
        this.discussions = res.result || []
        this.pages = res.pages;
        this.currentPage = res.current_page
      })
    )
    .subscribe()
  }
}

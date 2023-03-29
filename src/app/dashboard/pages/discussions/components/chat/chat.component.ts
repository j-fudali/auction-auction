import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, inject, Input, OnChanges, OnDestroy, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NewMessageInputComponent } from './components/new-message-input/new-message-input.component';
import { MatCardFooter, MatCardModule } from '@angular/material/card';
import { Chat } from 'src/app/shared/interfaces/discussion/chat';
import { User } from 'src/app/shared/interfaces/user/user';
import { MatList, MatListModule } from '@angular/material/list';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ScrollableDirective } from 'src/app/shared/directives/scrollable.directive';
import { OffsetTopDirective } from 'src/app/shared/directives/offset-top.directive';
import { Message } from 'src/app/shared/interfaces/discussion/message';
import { NewMessage } from 'src/app/shared/interfaces/discussion/new-message';
import { MessagesService } from 'src/app/core/http/messages.service';
import { MatIconModule } from '@angular/material/icon';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';
import { Discussion } from 'src/app/shared/interfaces/discussion/discussion';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, ScrollableDirective, OffsetTopDirective, NewMessageInputComponent, MatCardModule, MatListModule, InfiniteScrollModule, MatProgressBarModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnChanges, AfterViewInit, OnDestroy {
  @ViewChildren(OffsetTopDirective) listItems: QueryList<OffsetTopDirective>;
  @ViewChild(ScrollableDirective) list: ScrollableDirective;
  @Input() chat: PaginatedResponse<Message>;
  @Input() discussion: Discussion;
  @Input() userId: number;
  @Output() onScrollUpEvent = new EventEmitter<void>
  @Output() onMessageSend = new EventEmitter<NewMessage>
  loading: boolean = false;
  private lastItem: OffsetTopDirective;
  private breakpoints = inject(BreakpointObserver)
  private sub: Subscription;
  isLtMd$ = this.breakpoints.observe([Breakpoints.XSmall, Breakpoints.Small]).pipe(map( v => v.matches))
  onScrollUp(){
    if(this.chat.current_page != this.chat.pages){
      this.loading = true;
      this.onScrollUpEvent.emit()
    }
  }
  ngAfterViewInit(): void {
    this.scrollTo()
    this.sub = this.listItems.changes.subscribe((c: QueryList<OffsetTopDirective>) => {
      if(c.last != this.lastItem){
        this.scrollTo()
      }
    })
  }
  scrollTo(){
    this.list.scrollTop = this.listItems.last.offsetTop
    this.lastItem = this.listItems.last
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['chat'] && !changes['chat'].isFirstChange()){
      this.loading = false
    }
  }
  onNewMessage(newMessage: NewMessage){
    this.onMessageSend.emit(newMessage)
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }
}

import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewMessageInputComponent } from './components/new-message-input/new-message-input.component';
import { MatCardFooter, MatCardModule } from '@angular/material/card';
import { Chat } from 'src/app/shared/interfaces/discussion/chat';
import { User } from 'src/app/shared/interfaces/user/user';
import { MatList, MatListModule } from '@angular/material/list';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ScrollableDirective } from 'src/app/shared/directives/scrollable.directive';
import { OffsetTopDirective } from 'src/app/shared/directives/offset-top.directive';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, ScrollableDirective, OffsetTopDirective, NewMessageInputComponent, MatCardModule, MatListModule, InfiniteScrollModule, MatProgressBarModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent implements OnChanges, AfterViewInit {
  @ViewChildren(OffsetTopDirective) listItems: QueryList<OffsetTopDirective>;
  @ViewChild(ScrollableDirective) list: ScrollableDirective;
  @Input() chat: Chat;
  @Input() creator: User;
  @Input() user: User;
  @Input() userId: number;
  @Output() onScrollUpEvent = new EventEmitter<void>
  loading: boolean = false;
  onScrollUp(){
    if(this.chat.current_page != this.chat.pages){
      this.loading = true;
      this.onScrollUpEvent.emit()
    }
  }
  ngAfterViewInit(): void {
    this.list.scrollTop = this.listItems.last.offsetTop
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['chat'] && !changes['chat'].isFirstChange()){
      this.loading = false
    }
    if(changes['user'] && changes['creator'] && !(changes['user'].isFirstChange() || changes['creator'].isFirstChange())){
      this.list.scrollTop = this.listItems.last.offsetTop
    }
  }
}

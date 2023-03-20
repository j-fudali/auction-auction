import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewMessageInputComponent } from './components/new-message-input/new-message-input.component';
import { MatCardFooter, MatCardModule } from '@angular/material/card';
import { Chat } from 'src/app/shared/interfaces/discussion/chat';
import { User } from 'src/app/shared/interfaces/user/user';
import { MatListModule } from '@angular/material/list';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, NewMessageInputComponent, MatCardModule, MatListModule, InfiniteScrollModule, MatProgressBarModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent  {
  @Input() chat: Chat;
  @Input() creator: User;
  @Input() user: User;
  @Input() userId: number;
  @Output() onScrollUpEvent = new EventEmitter<void>
  onScrollUp(){
    this.onScrollUpEvent.emit()
  }
}

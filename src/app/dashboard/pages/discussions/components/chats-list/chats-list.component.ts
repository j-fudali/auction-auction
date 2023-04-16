import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { Discussion } from 'src/app/shared/interfaces/discussion/discussion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { DiscussionsStore } from '../../../../services/discussions.store';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-chats-list',
  standalone: true,
  imports: [CommonModule, MatListModule, MatButtonModule, MatIconModule, MatDividerModule, InfiniteScrollModule, MatProgressSpinnerModule],
  templateUrl: './chats-list.component.html',
  styleUrls: ['./chats-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatsListComponent  {
  @Input() discussions: Discussion[] | null;
  @Input() userId: number;
  @Input() loadingDiscussions: boolean;
  @Output() onSelectChat = new EventEmitter<Discussion>()
  @Output() onChatListScrollDown = new EventEmitter<void>()
  activated: Discussion;
  private discussionsStore = inject(DiscussionsStore)
  onDiscussionSelect(discussion: Discussion){
    this.onSelectChat.emit(discussion)
    this.discussions!.forEach( d => {
      if(d.id_discussion === discussion.id_discussion) d.is_read = 1
    })
    this.discussionsStore.discussions = this.discussions!
    this.activated = discussion
  }
  onChatListScroll(){
    this.onChatListScrollDown.emit()
  }
}

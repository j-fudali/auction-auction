import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { Discussion } from 'src/app/shared/interfaces/discussion/discussion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-chats-list',
  standalone: true,
  imports: [CommonModule, MatListModule, MatButtonModule, MatIconModule, MatDividerModule],
  templateUrl: './chats-list.component.html',
  styleUrls: ['./chats-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatsListComponent  {
  @Input() discussions: Discussion[];
  @Output() onSelectChat = new EventEmitter<number>()
  activated: number;
  onDiscussionSelect(idDiscussion: number){
    this.onSelectChat.emit(idDiscussion)
    this.activated = idDiscussion
  }
}

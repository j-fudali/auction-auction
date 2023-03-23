import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { ChatComponent } from './components/chat/chat.component';
import { DiscussionsService } from 'src/app/core/http/discussions.service';
import { forkJoin, Observable, of } from 'rxjs';
import { Discussion } from 'src/app/shared/interfaces/discussion/discussion';
import { ChatsListComponent } from './components/chats-list/chats-list.component';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from 'src/app/core/http/chat.service';
import { finalize, map, switchMap, tap } from 'rxjs/operators';
import { Chat } from 'src/app/shared/interfaces/discussion/chat';
import { UserService } from 'src/app/core/http/user.service';
import { User } from 'src/app/shared/interfaces/user/user';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NewMessage } from 'src/app/shared/interfaces/discussion/new-message';
import { MessagesService } from 'src/app/core/http/messages.service';
import { Message } from 'src/app/shared/interfaces/discussion/message';
import { DateTime } from 'luxon';

@Component({
  standalone: true,
  imports: [CommonModule, MatSidenavModule, ChatComponent, ChatsListComponent, MatProgressSpinnerModule, MatButtonModule, MatIconModule],
  templateUrl: './discussions.component.html',
  styleUrls: ['./discussions.component.scss']
})
export class DiscussionsComponent implements OnInit {
  @ViewChild('drawer') drawer: MatDrawer;
  @ViewChild('chatRef') chatRef: ChatComponent;
  private userService = inject(UserService)
  private chatService = inject(ChatService)
  private route = inject(ActivatedRoute)
  private breakpoints = inject(BreakpointObserver)
  private messagesService = inject(MessagesService)
  isLtMd$ = this.breakpoints.observe([Breakpoints.XSmall, Breakpoints.Small]).pipe(map( v => v.matches))
  discussions: Discussion[]
  chat: Chat;
  currentDiscussion: number;
  creator: User;
  user: User
  userId: number;
  isLoading: boolean = false;
  ngOnInit(): void {
    this.discussions = this.route.snapshot.data.discussions.result;
    this.userId = this.route.snapshot.data.userId
  }
  onScrollUp(){
    this.chatService.getDiscussion(this.currentDiscussion, this.chat.current_page + 1)
    .pipe(
      map( chat => {chat.result = chat.result.reverse(); return chat}),
      tap( chat => {
        chat.result = [...chat.result, ...this.chat.result]
        this.chat = chat
      })
    )
    .subscribe()
  }
  onDiscussionSelect(idDiscussion: number){
    this.isLoading = true;
    this.currentDiscussion = idDiscussion;
    if(this.breakpoints.isMatched([Breakpoints.XSmall, Breakpoints.Small])){
      this.drawer.close()
    }
    this.chatService.getDiscussion(idDiscussion)
    .pipe(
      map( chat => {if(chat)chat.result = chat.result.reverse(); return chat}),
      tap(chat => this.chat = chat),
      switchMap( chat => forkJoin([this.userService.getUserById(chat.id_creator), this.userService.getUserById(chat.id_user)])),
      tap( chatUsers => {
        this.creator = chatUsers[0]
        this.creator.id_user = this.chat.id_creator
        this.user = chatUsers[1]
        this.user.id_user = this.chat.id_user
      }),
      finalize(() => this.isLoading = false)
    )
    .subscribe()
  }
  onNewMessage(newMessage: NewMessage){
    this.messagesService.createNewMessage(this.currentDiscussion, newMessage.content)
    .pipe(
      switchMap( ({message, id_message}) => 
      {if(newMessage.image)return this.messagesService.addImagesToMessage(id_message, newMessage.image); return of(null)})
    )
    .subscribe()
    const message: Message = {
      id_sender: this.userId,
      content: newMessage.content,
      image: newMessage.imageSrc ? newMessage.imageSrc : null,
      is_read: 0,
      created_at: DateTime.now().toUTC().toFormat('yyyy-MM-dd hh:mm:ss')
    }
    this.chat.result = [...this.chat.result, message]
  }
}

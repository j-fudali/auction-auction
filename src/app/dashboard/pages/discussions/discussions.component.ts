import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ChatComponent } from './components/chat/chat.component';
import { DiscussionsService } from 'src/app/core/http/discussions.service';
import { forkJoin, Observable } from 'rxjs';
import { Discussion } from 'src/app/shared/interfaces/discussion/discussion';
import { ChatsListComponent } from './components/chats-list/chats-list.component';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from 'src/app/core/http/chat.service';
import { map, switchMap, tap } from 'rxjs/operators';
import { Chat } from 'src/app/shared/interfaces/discussion/chat';
import { UserService } from 'src/app/core/http/user.service';
import { User } from 'src/app/shared/interfaces/user/user';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  imports: [CommonModule, MatSidenavModule, ChatComponent, ChatsListComponent, MatProgressSpinnerModule, MatButtonModule, MatIconModule],
  templateUrl: './discussions.component.html',
  styleUrls: ['./discussions.component.scss']
})
export class DiscussionsComponent implements OnInit {
  private userService = inject(UserService)
  private chatService = inject(ChatService)
  private route = inject(ActivatedRoute)
  private breakpoints = inject(BreakpointObserver)
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
    this.chatService.getDiscussion(this.currentDiscussion)
    .pipe(
      map( chat => {chat.result = chat.result.reverse(); return chat}),
      tap( chat => this.chat = chat)
    )
    .subscribe()
  }
  onDiscussionSelect(idDiscussion: number){
    this.isLoading = true;
    this.currentDiscussion = idDiscussion;
    this.chatService.getDiscussion(idDiscussion)
    .pipe(
      map( chat => {chat.result = chat.result.reverse(); return chat}),
      tap(chat => this.chat = chat),
      switchMap( chat => forkJoin([this.userService.getUserById(chat.id_creator), this.userService.getUserById(chat.id_user)])),
      tap( chatUsers => {
        this.creator = chatUsers[0]
        this.creator.id_user = this.chat.id_creator
        this.user = chatUsers[1]
        this.user.id_user = this.chat.id_user
      }), 
    )
    .subscribe(() => this.isLoading = false)
  }
}

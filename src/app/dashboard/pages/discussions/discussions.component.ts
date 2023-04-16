import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatDrawer, MatSidenavModule } from "@angular/material/sidenav";
import { ChatComponent } from "./components/chat/chat.component";
import { DiscussionsService } from "src/app/core/http/discussions.service";
import { forkJoin, merge, Observable, of } from "rxjs";
import { Discussion } from "src/app/shared/interfaces/discussion/discussion";
import { ChatsListComponent } from "./components/chats-list/chats-list.component";
import { ActivatedRoute } from "@angular/router";
import { ChatService } from "src/app/core/http/chat.service";
import { finalize, map, mergeMap, switchMap, tap } from "rxjs/operators";
import { Chat } from "src/app/shared/interfaces/discussion/chat";
import { UserService } from "src/app/core/http/user.service";
import { User } from "src/app/shared/interfaces/user/user";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { MatButtonModule, MatIconButton } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { NewMessage } from "src/app/shared/interfaces/discussion/new-message";
import { MessagesService } from "src/app/core/http/messages.service";
import { Message } from "src/app/shared/interfaces/discussion/message";
import { DateTime } from "luxon";
import { PaginatedResponse } from "src/app/shared/interfaces/paginated-response";
import { DiscussionsStore } from "../../services/discussions.store";

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    ChatComponent,
    ChatsListComponent,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: "./discussions.component.html",
  styleUrls: ["./discussions.component.scss"],
})
export class DiscussionsComponent implements OnInit {
  @ViewChild("drawer") drawer: MatDrawer;
  @ViewChild("chatRef") chatRef: ChatComponent;
  private chatService = inject(ChatService);
  private discussionsService = inject(DiscussionsService);
  private discussionsStore = inject(DiscussionsStore);
  private route = inject(ActivatedRoute);
  private breakpoints = inject(BreakpointObserver);
  private messagesService = inject(MessagesService);
  isLtMd$ = this.breakpoints
    .observe([Breakpoints.XSmall, Breakpoints.Small])
    .pipe(map((v) => v.matches));
  discussions$: Observable<Discussion[]>;
  isDiscussionsExists: boolean;
  chat: PaginatedResponse<Message>;
  currentDiscussion: Discussion;
  userId: number;
  isLoading: boolean = false;

  chatListPages: number;
  chatListCurrentPage: number;
  loadingDiscussions: boolean = false;
  ngOnInit(): void {
    this.discussions$ = this.discussionsService.getAllDiscussions().pipe(
      tap((res) => {
        this.chatListCurrentPage = res.current_page;
        this.chatListPages = res.pages;
        this.isDiscussionsExists = res.result && res.result.length > 0;
      }),
      map((res) => res.result),
      tap((res) => {
        if (this.discussionsStore.selectedDiscussion) {
          const selected = res.find(
            (d) => (d.id_discussion = this.discussionsStore.selectedDiscussion)
          );
          if (selected) {
            this.onDiscussionSelect(selected);
          }
        }
      })
    );
    this.userId = this.route.snapshot.data.userId;
  }
  onChatListScroll() {
    if (this.chatListCurrentPage < this.chatListPages) {
      this.loadingDiscussions = true;
      this.discussions$ = this.discussions$.pipe(
        mergeMap((ds) =>
          this.discussionsService
            .getAllDiscussions(this.chatListCurrentPage + 1)
            .pipe(
              tap((res) => {
                this.chatListCurrentPage = res.current_page;
                this.chatListPages = res.pages;
              }),
              map((res) => [...ds, ...res.result]),
              finalize(() => (this.loadingDiscussions = false))
            )
        )
      );
    }
  }
  onScrollUp() {
    this.chatService
      .getDiscussion(
        this.currentDiscussion.id_discussion,
        this.chat.current_page + 1
      )
      .pipe(
        map((chat) => {
          chat.result = chat.result.reverse();
          return chat;
        }),
        tap((chat) => {
          chat.result = [...chat.result, ...this.chat.result];
          this.chat = chat;
        })
      )
      .subscribe();
  }
  onDiscussionSelect(discussion: Discussion) {
    this.isLoading = true;
    this.currentDiscussion = discussion;
    if (this.breakpoints.isMatched([Breakpoints.XSmall, Breakpoints.Small])) {
      if (this.drawer) {
        this.drawer.close();
      }
    }
    this.chatService
      .getDiscussion(discussion.id_discussion)
      .pipe(
        map((chat) => {
          chat.result = chat.result.reverse();
          return chat;
        }),
        tap((chat) => (this.chat = chat)),
        finalize(() => (this.isLoading = false))
      )
      .subscribe();
  }
  onNewMessage(newMessage: NewMessage) {
    this.messagesService
      .createNewMessage(
        this.currentDiscussion.id_discussion,
        newMessage.content
      )
      .pipe(
        switchMap(({ message, id_message }) => {
          if (newMessage.image)
            return this.messagesService.addImagesToMessage(
              id_message,
              newMessage.image
            );
          return of(null);
        })
      )
      .subscribe();
    const message: Message = {
      id_sender: this.userId,
      content: newMessage.content,
      image: newMessage.imageSrc ? newMessage.imageSrc : null,
      is_read: 0,
      created_at: DateTime.now().toUTC().toFormat("yyyy-MM-dd hh:mm:ss"),
    };
    this.chat.result = [...this.chat.result, message];
    this.discussionsStore.discussions = this.discussionsStore.discussions.map(
      (d) => {
        if (d.id_discussion == this.currentDiscussion.id_discussion) {
          (d.id_sender = message.id_sender),
            (d.content = message.content),
            (d.created_at = message.created_at),
            (d.is_read = message.is_read);
        }
        return d;
      }
    );
  }
}

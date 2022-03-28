import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { AppRoutingModule } from './app-routing.module';
import { FeedComponent } from './feed/feed.component';

import { MatStepperModule } from '@angular/material/stepper';
import { MatListModule } from '@angular/material/list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';

import { PostsComponent } from './feed/posts/posts.component';
import { ListsComponent } from './feed/lists/lists.component';
import { HeaderComponent } from './feed/header/header.component';
import { CreateComponent } from './feed/posts/create/create.component';
import { DisplayComponent } from './feed/posts/display/display.component';
import { PopupComponent } from './feed/posts/create/popup/popup.component';
import { FriendsListComponent } from './feed/lists/components/friends-list/friends-list.component';
import { GroupListComponent } from './feed/lists/components/group-list/group-list.component';
import { MyFriendsComponent } from './feed/lists/components/friends-list/components/my-friends/my-friends.component';
import { AddFriendPopupComponent } from './feed/lists/components/add-friend-popup/add-friend-popup.component';
import { FriendRequestsComponent } from './feed/lists/components/friends-list/components/friend-requests/friend-requests.component';
import { JoinGroupPopupComponent } from './feed/lists/components/join-group-popup/join-group-popup.component';
import { CreateGroupPopupComponent } from './feed/lists/components/create-group-popup/create-group-popup.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    FeedComponent,
    PostsComponent,
    ListsComponent,
    HeaderComponent,
    CreateComponent,
    DisplayComponent,
    PopupComponent,
    FriendsListComponent,
    GroupListComponent,
    MyFriendsComponent,
    AddFriendPopupComponent,
    FriendRequestsComponent,
    JoinGroupPopupComponent,
    CreateGroupPopupComponent
  ],
  imports: [
    MatStepperModule,
    MatListModule,
    MatCardModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatTabsModule,
    MatIconModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

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

import { PostsComponent } from './feed/posts/posts.component';
import { ListsComponent } from './feed/lists/lists.component';
import { HeaderComponent } from './feed/header/header.component';
import { CreateComponent } from './feed/posts/create/create.component';
import { DisplayComponent } from './feed/posts/display/display.component';
import { PopupComponent } from './feed/posts/create/popup/popup.component';

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
    PopupComponent
  ],
  imports: [
    MatStepperModule,
    MatListModule,
    MatCardModule,
    MatInputModule,
    MatDialogModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

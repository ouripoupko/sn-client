import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AddFriendPopupComponent } from './components/add-friend-popup/add-friend-popup.component';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit, OnDestroy {

  subs: Subscription[] = [];
  
  constructor(public dialog: MatDialog) { }
  
  ngOnInit(): void {
  }
  
  openDialog() {
    const dialogRef = this.dialog.open(AddFriendPopupComponent, {
      width: '50vw'
    });
    
    this.subs.push(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
        }
        else {
        }
      })
    );
  }
  
  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }
}

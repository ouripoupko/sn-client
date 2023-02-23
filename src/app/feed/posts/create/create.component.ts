import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { PopupComponent } from './popup/popup.component'

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, OnDestroy {

  postText: string;
  subs: Subscription[] = [];

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(PopupComponent, {
      width: '50vw',
      data: { initialText: this.postText }
    });

    this.subs.push(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.postText = result;
        }
        else {
          this.postText = undefined;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }
}

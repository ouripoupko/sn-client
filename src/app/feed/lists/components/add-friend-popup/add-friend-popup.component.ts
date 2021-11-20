import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { PersonService } from 'src/app/person.service';

@Component({
  selector: 'app-add-friend-popup',
  templateUrl: './add-friend-popup.component.html',
  styleUrls: ['./add-friend-popup.component.scss']
})
export class AddFriendPopupComponent implements OnInit, OnDestroy {

  postForm: FormGroup;
  get text() {
    return this.postForm.controls.text.value;
  }
  subs: Subscription[] = [];

  constructor(private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddFriendPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private personService: PersonService) {
    }

  ngOnInit(): void {
    this.postForm = this.fb.group({
      text: [this.data?.initialText || '', Validators.required]
    });
    this.dialogRef.disableClose = true;//disable default close operation
    this.subs.push(
      this.dialogRef.backdropClick().subscribe(result => {
        this.dialogRef.close(this.text);
      })
    );
  }

  submitForm() {
    if (this.postForm.valid) {
      this.post();
      this.dialogRef.close();
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  post() {
    this.personService.createPost(this.text);
  }
}

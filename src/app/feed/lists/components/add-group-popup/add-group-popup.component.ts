import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { PersonService } from 'src/app/person.service';

@Component({
  selector: 'app-add-group-popup',
  templateUrl: './add-group-popup.component.html',
  styleUrls: ['./add-group-popup.component.scss']
})
export class AddGroupPopupComponent implements OnInit, OnDestroy {

  postForm: FormGroup;
  get text() {
    return this.postForm.controls.text.value;
  }
  get text1() {
    return this.postForm.controls.text1.value;
  }
  get text2() {
    return this.postForm.controls.text2.value;
  }
  subs: Subscription[] = [];

  constructor(private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddGroupPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private personService: PersonService) {
    }

  ngOnInit(): void {
    this.postForm = this.fb.group({
      text: [this.data?.initialText || '', Validators.required],
      text1: [this.data?.initialText || '', Validators.required],
      text2: [this.data?.initialText || '', Validators.required]
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
    this.personService.createPost(this.text + this.text1 + this.text2);
  }
}


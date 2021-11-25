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

  groupForm: FormGroup;
  get text() {
    return this.groupForm.controls.text.value;
  }
  get text1() {
    return this.groupForm.controls.text1.value;
  }
  get text2() {
    return this.groupForm.controls.text2.value;
  }
  subs: Subscription[] = [];

  constructor(private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddGroupPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private personService: PersonService) {
    }

  ngOnInit(): void {
    this.groupForm = this.fb.group({
      text: [this.data?.initialText || '', Validators.required],//todo: DAD, Here you can defaul value!
      text1: [this.data?.initialText || '', Validators.required],//todo: DAD, Here you can defaul value!
      text2: [this.data?.initialText || '', Validators.required]//todo: DAD, Here you can defaul value!
    });
    this.dialogRef.disableClose = true;//disable default close operation
    this.subs.push(
      this.dialogRef.backdropClick().subscribe(result => {
        this.dialogRef.close(this.text);
      })
    );
  }

  submitForm() {
    if (this.groupForm.valid) {
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


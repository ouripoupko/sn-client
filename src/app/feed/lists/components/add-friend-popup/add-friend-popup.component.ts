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
  get serverAdd() {
    return this.postForm.controls.serverAdd.value;
  }
  get name() {
    return this.postForm.controls.name.value;
  }
  get contract() {
    return this.postForm.controls.contract.value;
  }
  subs: Subscription[] = [];

  constructor(private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddFriendPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private personService: PersonService) {
    }

  ngOnInit(): void {
    this.postForm = this.fb.group({
      serverAdd: [this.data?.initialText || 'http://localhost:5001/', Validators.required],
      name: [this.data?.initialText || '', Validators.required],//todo: DAD, Here you can defaul value!
      contract: [this.data?.initialText || '', Validators.required]//todo: DAD, Here you can defaul value!
    });
    this.dialogRef.disableClose = true;//disable default close operation
    this.subs.push(
      this.dialogRef.backdropClick().subscribe(result => {
        this.dialogRef.close(this.serverAdd);
      })
    );
  }

  submitForm(isAdd: boolean) {
    if (this.postForm.valid) {
      this.post(isAdd);
      this.dialogRef.close();
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  post(isAdd: boolean) {
    isAdd ?
      this.personService.addFriendship(this.serverAdd, this.name, this.contract) :
      this.personService.addFriendship(this.serverAdd, this.name, this.contract);
  }
}

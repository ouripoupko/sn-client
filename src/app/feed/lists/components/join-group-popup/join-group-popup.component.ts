import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { PersonService } from 'src/app/person.service';

@Component({
  selector: 'app-join-group-popup',
  templateUrl: './join-group-popup.component.html',
  styleUrls: ['./join-group-popup.component.scss']
})
export class JoinGroupPopupComponent implements OnInit, OnDestroy {

  groupForm: FormGroup;
  get serverAdd() {
    return this.groupForm.controls.serverAdd.value;
  }
  get name() {
    return this.groupForm.controls.name.value;
  }
  get contract() {
    return this.groupForm.controls.contract.value;
  }
  subs: Subscription[] = [];

  constructor(private fb: FormBuilder,
    private dialogRef: MatDialogRef<JoinGroupPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private personService: PersonService) {
    }

  ngOnInit(): void {
    this.groupForm = this.fb.group({
      serverAdd: [this.data?.initialText || 'http://localhost:5001/', Validators.required],
      name: [this.data?.initialText || '', Validators.required],//todo: DAD, Here you can defaul value!
      contract: [this.data?.initialText || '', Validators.required]//todo: DAD, Here you can defaul value!
    });
    this.dialogRef.disableClose = true;//disable default close operation
    this.subs.push(
      this.dialogRef.backdropClick().subscribe(result => {
        this.dialogRef.close();
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
    this.personService.joinGroup(this.serverAdd, this.name, this.contract);
  }
}


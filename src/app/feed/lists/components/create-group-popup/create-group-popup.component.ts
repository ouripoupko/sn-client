import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { PersonService } from 'src/app/person.service';

@Component({
  selector: 'app-create-group-popup',
  templateUrl: './create-group-popup.component.html',
  styleUrls: ['./create-group-popup.component.scss']
})
export class CreateGroupPopupComponent implements OnInit, OnDestroy {

  groupForm: FormGroup;
  get name() {
    return this.groupForm.controls.name.value;
  }
  subs: Subscription[] = [];

  constructor(private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateGroupPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private personService: PersonService) {
    }

  ngOnInit(): void {
    this.groupForm = this.fb.group({
      name: [this.data?.initialText || '', Validators.required]//todo: DAD, Here you can defaul value!
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
    this.personService.createGroup(this.name);
  }
}

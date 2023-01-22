import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { PersonService } from 'src/app/person.service';

@Component({
  selector: 'app-set-profile-popup',
  templateUrl: './set-profile-popup.component.html',
  styleUrls: ['./set-profile-popup.component.css']
})
export class SetProfilePopupComponent implements OnInit, OnDestroy {

  groupForm: FormGroup;
  subs: Subscription[] = [];
  selectedProfile: any;
  existingProfiles: any[];

  constructor(private fb: FormBuilder,
    private dialogRef: MatDialogRef<SetProfilePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private personService: PersonService) {
  }

  ngOnInit(): void {
    this.personService.getProfiles()
      .subscribe(contracts => {this.existingProfiles = contracts;});

    this.groupForm = this.fb.group({});
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
    this.personService.setProfile(this.selectedProfile);
  }
}


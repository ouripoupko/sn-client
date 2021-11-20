import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit, OnDestroy {

  postForm: FormGroup;
  get text() {
    return this.postForm.controls.text.value;
  }
  subs: Subscription[] = [];
  
  constructor(private fb: FormBuilder, 
    private dialogRef: MatDialogRef<PopupComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    private postsSvc: PostsService) { }
  
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
      this.postsSvc.createPost(this.text);
      this.dialogRef.close();
    }
  }
  
  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }
}
  
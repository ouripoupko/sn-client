import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { PostsService } from '../../services/posts.service';
import { PersonService } from '../../../../person.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit, OnDestroy {

  counter: number;
  postForm: FormGroup;
  get text() {
    return this.postForm.controls.text.value;
  }
  subs: Subscription[] = [];
  
  constructor(private fb: FormBuilder, 
    private dialogRef: MatDialogRef<PopupComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    private postsSvc: PostsService,
    private personService: PersonService) {
      this.counter = 0;
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
    let text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ultrices tincidunt arcu non sodales neque sodales ut. Elementum tempus egestas sed sed risus pretium quam vulputate. Dui nunc mattis enim ut tellus elementum sagittis vitae et. Vitae ultricies leo integer malesuada nunc vel. Dictumst quisque sagittis purus sit amet. Nunc faucibus a pellentesque sit amet porttitor eget dolor. Arcu cursus vitae congue mauris. Mauris rhoncus aenean vel elit. Gravida rutrum quisque non tellus. Lectus sit amet est placerat in egestas erat imperdiet. Ante in nibh mauris cursus mattis molestie a iaculis at. Quis hendrerit dolor magna eget. At urna condimentum mattis pellentesque id nibh tortor. Pharetra diam sit amet nisl suscipit.';
    this.personService.createPost(text + ' ' + this.counter);
    this.counter++;
  }
}
  
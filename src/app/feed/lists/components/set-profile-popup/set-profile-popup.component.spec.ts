import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetProfilePopupComponent } from './set-profile-popup.component';

describe('SetProfilePopupComponent', () => {
  let component: SetProfilePopupComponent;
  let fixture: ComponentFixture<SetProfilePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetProfilePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetProfilePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

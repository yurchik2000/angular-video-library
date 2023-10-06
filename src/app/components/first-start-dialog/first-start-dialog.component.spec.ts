import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstStartDialogComponent } from './first-start-dialog.component';

describe('FirstStartDialogComponent', () => {
  let component: FirstStartDialogComponent;
  let fixture: ComponentFixture<FirstStartDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirstStartDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstStartDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

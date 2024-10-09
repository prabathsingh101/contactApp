import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactModalPopupComponent } from './contact-modal-popup.component';

describe('ContactModalPopupComponent', () => {
  let component: ContactModalPopupComponent;
  let fixture: ComponentFixture<ContactModalPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactModalPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactModalPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

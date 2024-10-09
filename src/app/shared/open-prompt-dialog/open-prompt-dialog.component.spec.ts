import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenPromptDialogComponent } from './open-prompt-dialog.component';

describe('OpenPromptDialogComponent', () => {
  let component: OpenPromptDialogComponent;
  let fixture: ComponentFixture<OpenPromptDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenPromptDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenPromptDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

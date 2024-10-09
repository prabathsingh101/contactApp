import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from '../../services/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-open-prompt-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './open-prompt-dialog.component.html',
  styleUrl: './open-prompt-dialog.component.scss'
})
export class OpenPromptDialogComponent {

}

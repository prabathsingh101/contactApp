import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OpenPromptDialogComponent } from '../shared/open-prompt-dialog/open-prompt-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class PromptService {

  constructor(public dialog: MatDialog) {}

  openPromptDialog(id: number) {
    const dialogRef = this.dialog.open(OpenPromptDialogComponent, {
      width: '250px',
      data: id
    });
   return dialogRef.afterClosed();
  }
}

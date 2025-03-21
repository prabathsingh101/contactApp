import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContactsService } from './services/contacts.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './services/material/material.module';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Contacts } from './models/contact.model';
import { ContactModalPopupComponent } from './contact-modal-popup/contact-modal-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { PromptService } from './services/prompt.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, MaterialModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  svc = inject(ContactsService);
  Promptsvc = inject(PromptService);
  dialog = inject(MatDialog);
  toast = inject(ToastrService);
  title = 'contactApp';
  displayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'email',
    'action',
  ];
  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource: any;
  contacts: Contacts[] = [];

  ngOnInit(): void {
    this.getAll();
  }

  filterchange(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }

  getAll() {
    this.loading = true;
    this.svc
      .GetAllContact(this.contacts)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res: any) => {
        this.contacts = res;
        if (this.contacts.length > 0) {
          this.dataSource = new MatTableDataSource<Contacts>(this.contacts);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } else {
          this.dataSource = new MatTableDataSource<Contacts>(this.contacts);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.toast.info('Record not found.', 'Data empty.', {
            timeOut: 3000,
          });
        }
      });
  }

  deletePromptPopup(id: number) {
    this.loading = true;
    this.Promptsvc.openPromptDialog(id)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res: any) => {
        if (res === true) {
          this.svc.DELETE(id).subscribe((res: any) => {
            this.toast.info('Deleted successfully.', 'Deleted.', {
              timeOut: 3000,
            });
            this.getAll();
          });
        }
      });
  }
  editContact(id: any) {
    this.svc.GetContactsById(id).subscribe((res) => {
      const contacts = res;
    });
    this.openpoup(id, 'Edit Department');
  }
  openpoup(id: number, title: any) {
    var _popup = this.dialog.open(ContactModalPopupComponent, {
      width: '400px',
      enterAnimationDuration: '1000ms',
      exitAnimationDuration: '1000ms',
      data: {
        title: title,
        id: id,
      },
    });
    _popup.afterClosed().subscribe({
      next: (res) => {
        console.log(res);
        this.getAll();
      },
    });
  }
  AddContacts() {
    this.openpoup(0, 'Add New Contact');
  }
}

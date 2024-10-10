import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContactsService } from './services/contacts.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './services/material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Contacts } from './models/contact.model';
import { ContactModalPopupComponent } from './contact-modal-popup/contact-modal-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { PromptService } from './services/prompt.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { catchError, finalize, throwError } from 'rxjs';

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

  // getAll() {
  //   this.loading = true;
  //   this.svc.GetAllContact(this.contacts).subscribe((res: any) => {
  //     if (res.length > 0) {
  //       this.contacts = res;
  //       this.dataSource = new MatTableDataSource(this.contacts);
  //       this.dataSource.paginator = this.paginator;
  //       this.dataSource.sort = this.sort;
  //       this.loading = false;
  //     } else {
  //       this.contacts = res;
  //       this.dataSource = new MatTableDataSource(this.contacts);
  //       this.dataSource.paginator = this.paginator;
  //       this.dataSource.sort = this.sort;
  //       this.loading = false;
  //     }
  //   });
  // }

  getAll() {
    this.loading = true;
    this.svc
      .GetAllContact(this.contacts)
      .pipe(
        catchError((err) => {
          console.log('Error loading users', err);
          this.toast.error(err.message, err.name, {
            timeOut: 3000,
          });
          return throwError(err);
        }),
        finalize(() => (this.loading = false))
      )
      .subscribe((res: any) => {
        this.contacts = res;
        console.log('res', this.contacts);
        if (this.contacts.length > 0) {
          this.dataSource = new MatTableDataSource<Contacts>(this.contacts);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } else {
          this.dataSource = new MatTableDataSource<Contacts>(this.contacts);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      });
  }
  deletePromptPopup(id: number) {
    this.Promptsvc.openPromptDialog(id).subscribe((res: any) => {
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

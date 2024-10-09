import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Contacts } from '../models/contact.model';
import { ContactsService } from '../services/contacts.service';
import { MaterialModule } from '../services/material/material.module';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact-modal-popup',
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule, CommonModule],
  templateUrl: './contact-modal-popup.component.html',
  styleUrl: './contact-modal-popup.component.scss',
})
export class ContactModalPopupComponent implements OnInit {
  data: any = inject(MAT_DIALOG_DATA);

  fb: any = inject(FormBuilder);

  svc = inject(ContactsService);
  toast = inject(ToastrService);
  modalPopupForm: any = FormGroup;

  contacts!: Contacts;

  constructor(private ref: MatDialogRef<ContactModalPopupComponent>) {}

  inputdata: any;

  editdata: any;

  closemessage: any = 'close message using directive';

  closepopup() {
    this.ref.close('closed using function');
  }

  ngOnInit(): void {
    this.createForm();
    this.inputdata = this.data;
    if (this.inputdata.id > 0) {
      this.setPopupData(this.inputdata.id);
    }
  }
  createForm() {
    this.modalPopupForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.maxLength(15)]],

      lastname: ['', [Validators.required, Validators.maxLength(15)]],

      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$'),
          Validators.maxLength(100),
        ],
      ],
    });
  }
  get getfirstName() {
    return this.modalPopupForm.controls['firstname'];
  }

  get getlastName() {
    return this.modalPopupForm.controls['lastname'];
  }

  get getemail() {
    return this.modalPopupForm.controls['email'];
  }
  setPopupData(id: number) {
    this.svc.GetDeptById(id).subscribe((res: any) => {
      this.editdata = res;
      console.log('editdata', this.editdata);
      this.modalPopupForm.setValue({
        firstname: this.editdata.firstName,
        lastname: this.editdata.lastName,
        email: this.editdata.email,
      });
    });
  }
  onSubmit() {
    if (this.modalPopupForm.valid) {
      this.contacts = {
        firstname: this.modalPopupForm.value.firstname,
        lastname: this.modalPopupForm.value.lastname,
        email: this.modalPopupForm.value.email,
        id: this.inputdata.id ? this.inputdata.id : 0,
      };
      if (this.inputdata.id > 0) {
        //alert('edit');
        this.svc.PUT(this.inputdata.id, this.contacts).subscribe((res: any) => {
          this.closepopup();
          this.toast.success('Updated successfully.', 'Updated.', {
            timeOut: 3000,
          });
        });
      } else {
        //alert('save');
        this.svc.Post(this.contacts).subscribe((res) => {
          this.closepopup();
          this.toast.success('Saved successfully.', 'Saved.', {
            timeOut: 3000,
          });
        });
      }
    }
  }
}

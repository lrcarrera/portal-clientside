import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  mode: string;
  submitted: boolean;
  success: boolean;
  messageForm: any;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.messageForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      secondName: ['', Validators.required],
      emailAddress: ['', Validators.required],
      dni: ['', Validators.required],
      phone: ['', Validators.required]
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.messageForm.invalid) { return;}
    this.success = true;
}

  public color: string;

  public availableColors = [
    { name: 'none', color: '' },
    { name: 'Primary', color: 'primary' },
    { name: 'Accent', color: 'accent' },
    { name: 'Warn', color: 'warn' }
  ];
}

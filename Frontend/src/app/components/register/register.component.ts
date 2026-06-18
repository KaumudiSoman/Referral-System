import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RegisterService } from 'src/app/_services/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  constructor(
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private registerService: RegisterService
  ) { }

  surveyId: string = '';
  referredBy: string = '';
  userRegisterForm: FormGroup = new FormGroup({});

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.surveyId = params['survey'];
      this.referredBy = params['ref'];
    });
    this.initializeForm();
  }

  initializeForm() {
    this.userRegisterForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      city: ['', Validators.required],
    });
  }

  register() {
    let formValue = this.userRegisterForm.value;
    console.log(formValue);

    this.registerService.register({
      ...formValue,
      surveyId: this.surveyId,
      referredBy: this.referredBy
    }).subscribe({
      next: () => {
        this.userRegisterForm.reset();
        this.toastrService.success('User registered and referral created successfully');
      },
      error: (err) => {this.toastrService.error(err.message)}
    })
  }
}

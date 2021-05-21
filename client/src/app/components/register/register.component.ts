import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  registerForm!: FormGroup;
  emailRegx = /^(([^<>+()\[\]\\.,;:\s@"-#$%&=]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;

  constructor(
    private fromBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.registerForm = this.fromBuilder.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.pattern(this.emailRegx)]],
      password: [null, [Validators.required]],
      isVerified: ['false']
    });
  }

  submitForm() {

    if (this.registerForm.value.name != null &&
      this.registerForm.value.email != null &&
      this.registerForm.value.password) {

      this.authService.registerUser(this.registerForm.value)
        .subscribe((response: any) => {
          this.toastr.success('Successfully registered')
          this.router.navigate(['']);
        }, (err: any) => {
          this.toastr.error(err.error.message);
        });
    }

  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  emailRegx = /^(([^<>+()\[\]\\.,;:\s@"-#$%&=]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;

  token: string;
  id: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(this.emailRegx)]],
      password: [null, [Validators.required]]
    });

    this.token = this.activatedRoute.snapshot.params.token;
    this.id = this.activatedRoute.snapshot.params.id;
  }

  ngOnInit(): void {

    if (this.token && this.id) {
      this.authService.verifyAccount({
        token: this.token,
        id: this.id
      }).subscribe(result => {
        console.log(result);
        this.toastr.success(result.message);
      }, (err: any) => {
        this.toastr.error(err.error.message);
      });
    }

  }

  submit(): void {

    if (this.loginForm.value.email != null && this.loginForm.value.password != null) {
      this.authService.loginUser(this.loginForm.value)
        .subscribe((response: any) => {
          this.toastr.success('Successfully loged In');
          localStorage.setItem('id', response[0]._id);
          this.router.navigate([`/user/${response[0]._id}/dashboard`]);
        }, (err: any) => {
          this.toastr.error(err.error.message);
        });
    }
  }
}

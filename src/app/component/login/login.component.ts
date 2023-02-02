import { Component } from '@angular/core';
import { DatabaseService } from 'src/app/service/database.service';
import { MenuService } from 'src/app/service/menu.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm = this.formbuilder.group({
    email: [null, Validators.compose(
      [
        Validators.required,
        Validators.email
      ]
    )],
    password: [null, Validators.compose(
      [
        Validators.required,
        Validators.minLength(5)
      ]
    )]
  })

  constructor(
    public menuService: MenuService,
    private formbuilder: FormBuilder,
    public authService: DatabaseService
  ) {}

  formSubmit(form: {email: string, password: string}) {
    if (this.loginForm.valid) {
      this.authService.SignIn(form.email, form.password);
    }
  }
  
}
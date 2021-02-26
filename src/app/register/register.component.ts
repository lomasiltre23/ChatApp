import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Response } from '../interfaces/response';
import { HttpService } from '../services/http.service';
import { Status } from '../utils/response-status';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  isSubmitted: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  constructor(
    private formBuilder: FormBuilder, 
    private http: HttpService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      age: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      password2: ['', Validators.required]
    });
    this.equalPassword();
  }

  get formControls() { return this.registerForm.controls }

  equalPassword(){
    this.formControls.password2.valueChanges.subscribe(pass => {
      if(pass != this.formControls.password.value) this.formControls.password2.setErrors({equal: true});
      else this.formControls.password2.setErrors({equal: false})
    })
  }

  register(){
    this.errorMessage = '';
    this.isSubmitted = true;
    if(this.registerForm.invalid) return;
    if(this.registerForm.value.password === this.registerForm.value.password) 
    this.http.post('users/register', this.registerForm.value).subscribe((res: Response) => {
      this.isSubmitted = false;
      if(res.status == Status.SUCCESS){
        this.successMessage = res.message;
        setTimeout(() => this.router.navigateByUrl("login"), 2000);
      }
      else{
        this.errorMessage = res.message;
      }
    })

  }

}

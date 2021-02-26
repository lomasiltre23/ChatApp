import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Response } from '../interfaces/response';
import { AuthService } from '../services/auth.service';
import { HttpService } from '../services/http.service';
import { Status } from '../utils/response-status';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit, OnDestroy {

  authForm: FormGroup;
  isSubmitted = false;
  destroy$: Subject<boolean> = new Subject<boolean>();
  errorMessage: string = '';
  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private http: HttpService) { }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit(): void {
    this.authForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  get formControls() { return this.authForm.controls; }

  logIn() {
    this.errorMessage = '';
    this.isSubmitted = true;
  
    if(this.authForm.invalid) return;
    this.http.post('users/login', this.authForm.value).pipe(takeUntil(this.destroy$)).subscribe((res: Response) => {
      if(res.status == Status.SUCCESS){
        this.authService.logIn(res.data.token);
        this.router.navigateByUrl('/chat');
      }else{
        this.errorMessage = res.message;
      }
    });
    
  }

}

import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../../Services/auth/auth.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, filter, switchMap, tap } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { user } from '../../models/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  /**
   * take userdata as a formgroup
   */
  userData: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  /**
   * A signal that indicate whether the form submitted or not
   */
  submitted = signal<boolean>(false);

  /**
   * take behaviour subjec with initial value false
   */
  private _login$ = new BehaviorSubject<boolean>(false);

  /**
   * take subject as observable
   */
  login$ = this._login$.asObservable();

  /**
   * convert observable to signal for call api if the behaviour subject emit true
   */
  loginAuthUser$ = toSignal(
    this._login$.pipe(
      filter((add) => !!add),
      switchMap(() =>
        this.authService.getUserByEmail(this.userData.value.email)
      ),
      tap((data: user[]) => {
        if (data.find((u) => u.password === this.userData.value.password)) {
          this.authService.setUser(true);
          this.router.navigate(['/tasklist']);
        } else {
          alert('invalid email or password');
          this.router.navigate(['/login']);
        }
      })
    )
  );

  /**
   * Mehtod use for call api to authenticate user and check form validation
   */
  onSubmit(): void {
    if (this.userData.valid) {
      this._login$.next(true);
    } else {
      this.userData.markAllAsTouched();
      this.submitted.set(true);
      console.log('Form is not valid');
    }
  }
}

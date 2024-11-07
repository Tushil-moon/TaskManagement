import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../../../Services/auth/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, filter, switchMap, tap } from 'rxjs';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  /**
   * take userdata as a formgroup
   */
  userData: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmpassword: ['', Validators.required],
    username: ['', [Validators.required, Validators.minLength(3)]],
  });

  // Convenient access to form controls in the template
  get f() {
    return this.userData.controls;
  }
  /**
   * take behaviour subject with intial value false
   */
  private _adduser$ = new BehaviorSubject<boolean>(false);

  /**
   * take subject as observable
   */
  adduser$ = this._adduser$.asObservable();

  /**
   * convert observable to signal for call api if the behaviour subject emit true
   */
  addAuthUser$ = toSignal(
    this._adduser$.pipe(
      filter((add) => add == true),
      switchMap(() => this.authService.addUser(this.userData.value)),
      tap(() => {
        this.router.navigate(['/login']);
      })
    )
  );

  /**
   * Mehtod use for call api to add user and check form validation
   */
  onSubmit(): void {
    if (this.userData.valid) {
      if (this.userData.value.confirmpassword == this.userData.value.password) {
        this._adduser$.next(true);
      } else {
        alert('password not matched');
      }
    } else {
      alert('Form is not valid');
    }
  }
}

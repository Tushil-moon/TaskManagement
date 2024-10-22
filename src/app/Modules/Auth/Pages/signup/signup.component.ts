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
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule,RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  constructor() {
    this.userData = this.fb.group({
      email: this.fb.control('', Validators.required),
      password: this.fb.control('', Validators.required),
      confirmpassword: this.fb.control('', Validators.required),
      username: this.fb.control('', Validators.required),
    });
  }

  /**
   * take userdata as a formgroup
   */
  userData: FormGroup;

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

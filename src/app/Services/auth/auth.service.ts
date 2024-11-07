import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { user } from '../../Modules/Auth/models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  /**
   * Actual api to performing every request
   */
  private apiURL = 'http://localhost:3000/users';

  /**
   * Get Perticular user by sending GET request using Id as query param..
   *
   * @param id - the unique identifier of user to be get, can be number or string
   * @returns - Observable that emits the user of perticular task
   */
  getUserByEmail(email: string): Observable<user[]> {
    return this.http.get<user[]>(`${this.apiURL}?email=${email}`);
  }

  /**
   * Add an user by sending a Post request to the api
   *
   * @param user - User containing new task details
   * @returns an observable that emits the added User
   */
  addUser(user: user): Observable<user> {
    const { confirmpassword, ...userdata } = user;
    return this.http
      .post<user>(this.apiURL, userdata)
      .pipe(catchError(this.handleError));
  }

  /**
   * use for get islogin from localstorage
   *
   * @returns islogin from localstorage
   */
  isAuthenticate() {
    return localStorage.getItem('isLogin');
  }

  /**
   * use for set islogin in localstorage
   *
   * @param value boolean
   */
  setUser(value: boolean) {
    localStorage.setItem('isLogin', JSON.stringify(value));
  }

  /**
   * Get user
   */
  getUser() {
    return JSON.parse(localStorage.getItem('isLogin') || 'null');
  }
  
  /**
   * Handles HTTP errors by formatting them into user-friendly messages.
   *
   * @param error The HTTP error response.
   * @returns An observable that emits an error message.
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code
      errorMessage = `Error ${error.status}: ${error.message}`;
    }
    // Log the error to the console (you might want to send it to a logging server instead)
    console.error(errorMessage);
    // Return an observable with a user-facing error message
    return throwError(() => new Error(errorMessage));
  }
}

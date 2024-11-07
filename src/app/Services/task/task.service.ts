import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { Task } from '../../Modules/Task/Models/task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  /**
   * Actual api to performing every request
   */
  private apiURL = 'https://task-6bw61451s-tushils-projects.vercel.app/tasks';

  /**
   * Behaviour subject that handle the triggerd of method
   */
  tasksSubject = new BehaviorSubject<boolean>(true);

  private http = inject(HttpClient);

  /**
   * Get All task by sending a GET request to the api
   *
   * @returns  This return a observable to get All task from server on any components
   */
  getAllTask(): Observable<Task[]> {
    return this.http
      .get<Task[]>(this.apiURL)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get Perticular task by sending GET request using Id as query param..
   *
   * @param id - the unique identifier of task to be get, can be number or string
   * @returns - Observable that emits the task of perticular task
   */
  getTaskById(id: string): Observable<Task> {
    console.log(id)
    return this.http
      .get<Task>(`${this.apiURL}/${id}`)
      .pipe( 
        catchError(this.handleError)
      );
  }

  /**
   * Add an task by sending a Post request to the api
   *
   * @param task - Task containing new task details
   * @returns an observable that emits the added task
   */
  addTask(task: Task): Observable<Task> {
    return this.http
      .post<Task>(this.apiURL, task)
      .pipe(catchError(this.handleError));
  }

  /**
   * Edits an existing task by sending a PUT request to the API.
   *
   * @param task The task object containing updated details.
   * @param id The unique identifier of the task to be updated. Can be a number or string.
   * @returns An observable that emits the updated task.
   */
  editTask(task: Task, id: number | string): Observable<Task> {
    return this.http
      .put<Task>(`${this.apiURL}/${id}`, task)
      .pipe(catchError(this.handleError));
  }

  /**
   * Deletes a task by sending a DELETE request to the API.
   *
   * @param id The unique identifier of the task to be deleted. Can be a number or string.
   * @returns An observable that emits the result of the delete operation.
   */
  deleteTask(id: number | string): Observable<any> {
    return this.http
      .delete(`${this.apiURL}/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   *
   * @returns observable of boolean value
   */
  refreshList(): Observable<boolean> {
    return this.tasksSubject.asObservable();
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

import { Component, inject, Input, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TaskService } from '../../../../Services/task/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, filter, switchMap, tap, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-addtask',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './addtask.component.html',
  styleUrl: './addtask.component.css',
})
export class AddtaskComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private taskService = inject(TaskService);
  private activeModal = inject(NgbActiveModal);
  /**
   * take behaviour subject with initial value false
   */
   _taskId$ = new BehaviorSubject<string>('');

  /**
   * take subject as observable
   */
  taskId$ = this._taskId$.asObservable();

  /**
   *
   */
  set taskId(value: string) {
    this._taskId$.next(value);
  }

  /**
   * A form group instance used to manage the form's state and validation.
   */
  taskForm: FormGroup = this.fb.group({
    title: this.fb.control('', Validators.required),
    description: this.fb.control('', Validators.required),
    dueDate: this.fb.control('', Validators.required),
    priority: this.fb.control('', Validators.required),
    status: this.fb.control('', Validators.required),
  });

  /**
   * A signal that indicate whether the form submitted or not
   */
  submitted = signal<boolean>(false);

  /**
   * getId from active route and find taskbyid and patch it to form
   */
  getTaskById = toSignal(
    this._taskId$.pipe(
      filter((id) => !!id),
      switchMap((id) => this.taskService.getTaskById(id)),
      tap((task) => {
        this.taskForm.patchValue(task);
      })
    )
  );

  /**
   * this method change the submit value for form submission if form valid
   * else it make submitted true and mark all field as touched
   */
  onSubmit(): void {
    if (this.taskForm.valid) {
      if (this._taskId$.value) {
        this.taskService
          .editTask(this.taskForm.value, this._taskId$.value)
          .subscribe(() => {
            this.closeModal(true);
          });
      } else {
        this.taskService.addTask(this.taskForm.value).subscribe(() => {
          this.closeModal(true);
        });
      }
    } else {
      this.taskForm.markAllAsTouched();
      this.submitted.update(() => true);
    }
  }

  /**
   * Handle the route navigation on tasklist
   */
  navigateToTaskList(): void {
    this.router.navigate(['/tasklist']);
  }

  /**
   * Handle the close functionality of modal
   */
  closeModal(success: boolean = false): void {
    this.activeModal.close(success);
  }
}

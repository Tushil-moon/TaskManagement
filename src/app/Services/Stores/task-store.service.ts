import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Task } from '../../Modules/Task/Models/task';
import { TaskService } from '../task/task.service';
import { Observable, tap, switchMap } from 'rxjs';
import { signalStore, withState } from '@ngrx/signals';

interface TaskState {
  tasks: Task[];
  loading: boolean;
}
const initialState: TaskState = {
  tasks: [],
  loading: false,
};

export const taskStore = signalStore(withState(initialState));

@Injectable({
  providedIn: 'root',
})
export class TaskStoreService extends ComponentStore<TaskState> {
  private taskService = inject(TaskService);
  constructor() {
    super(initialState);
  }
  /**
   * Selectors to observe tasks and loading state
   */
  readonly tasks$ = this.select((state) => state.tasks);
  readonly loading$ = this.select((state) => state.loading);

  /**
   * Updater to set tasks and divide them by status
   */
  readonly setTasks = this.updater((state, tasks: Task[]) => ({
    ...state,
    tasks: this.sortTasksByOrder(tasks),
  }));

  /**
   * Effect to load tasks from the service
   */
  readonly loadTasks = this.effect((trigger$: Observable<void>) =>
    trigger$.pipe(
      tap(() => this.patchState({ loading: true })),
      switchMap(() => this.taskService.getAllTask()),
      tap((tasks) => {
        console.log(tasks);
        setTimeout(() => {
          this.setTasks(tasks);
          this.patchState({ loading: false });
        });
      })
    )
  );

  /**
   * Sort tasks by order
   *
   * @param tasks tasks
   * @returns ordered tasks
   */
  private sortTasksByOrder(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) => a.order - b.order);
  }

  /**
   * Update task order after drag-and-drop
   */
  readonly updateTaskOrder = this.updater((state, tasksToUpdate: Task[]) => {
    const updatedTasks = state.tasks.map((task) => {
      const updatedTask = tasksToUpdate.find((t) => t.id === task.id);
      return updatedTask ? updatedTask : task;
    });
    tasksToUpdate.forEach((task, index) => {
      task.order = index;
      this.taskService.editTask(task, task.id).subscribe();
    });
    return { ...state, tasks: this.sortTasksByOrder(updatedTasks) };
  });
}

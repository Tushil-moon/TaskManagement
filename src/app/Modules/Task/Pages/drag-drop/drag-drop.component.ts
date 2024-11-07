import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { TaskService } from '../../../../Services/task/task.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, tap } from 'rxjs';
import { Task } from '../../Models/task';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SearchComponent } from '../../Components/search/search.component';
import { AuthService } from '../../../../Services/auth/auth.service';
import { Router } from '@angular/router';
import { TaskStoreService } from '../../../../Services/Stores/task-store.service';
import { DomSanitizer } from '@angular/platform-browser';

declare var $: any;
@Component({
  selector: 'app-drag-drop',
  standalone: true,
  imports: [
    NgbModule,
    CommonModule,
    CarouselModule,
    DragDropModule,
    SearchComponent,
    
  ],
  providers: [TaskStoreService],
  templateUrl: './drag-drop.component.html',
  styleUrl: './drag-drop.component.css',
})
export class DragDropComponent {
  private taskService = inject(TaskService);
  auth = inject(AuthService);
  private router = inject(Router);
   taskStore = inject(TaskStoreService);
   sanitizer =  inject(DomSanitizer);

   constructor(){
    this.taskStore.loadTasks()
   }
  /** observe task and loading state from taskstore */
  tasks$ = this.taskStore.tasks$;
  loading$ = this.taskStore.loading$;

  /**
   * Reactive signal containing the list of tasks.
   *
   * This signal updates the view whenever the list of tasks changes.
   */
  tasks = signal<Task[]>([]);

  /**
   * hold the value of task filter by status
   */
  inprogress = signal<Task[]>([]);

  /**
   * hold the value of task filter by status
   */
  complete = signal<Task[]>([]);

  /**
   * hold the value of task filter by status
   */
  pending = signal<Task[]>([]);

  /**
   * Hold onhold task
   */
  onHold = signal<Task[]>([]);

  /**
   * Hold todo task
   */
  todo = signal<Task[]>([]);

  /**
   * convert observable to signal for call api if the behaviour subject emit true
   */
  getTask$ = toSignal(
    this.tasks$.pipe(
      tap((task) => {
        this.tasks.set(this.sortTasksByOrder(task));
        this.divideTasksByStatus(this.sortTasksByOrder(task));
      })
    )
  );

  /**
   * Handle drag and drop event
   *
   * @param event drag event
   */
  drop(event: CdkDragDrop<Task[]>): void {
    const taskToMove = event.previousContainer.data[event.previousIndex];
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      switch (event.container.id) {
        case 'onholdList':
          taskToMove.status = 'onhold';
          break;
        case 'tasksList':
          taskToMove.status = 'new';
          break;
        case 'inProgressList':
          taskToMove.status = 'in-progress';
          break;
        case 'completeList':
          taskToMove.status = 'completed';
          break;
        case 'pendingList':
          taskToMove.status = 'pending';
          break;
      }
    }
    this.taskStore.updateTaskOrder(event.container.data);
  }

  /**
   * Handle task division based on their status
   *
   * @param tasks tasks
   */
  divideTasksByStatus(tasks: Task[]): void {
    this.onHold.set(tasks.filter((task) => task.status === 'onhold'));
    this.inprogress.set(tasks.filter((task) => task.status === 'in-progress'));
    this.pending.set(tasks.filter((task) => task.status === 'pending'));
    this.complete.set(tasks.filter((task) => task.status === 'completed'));
    this.todo.set(tasks.filter((task) => task.status === 'new'));
  }

  /**
   * This method is event bind with search component and use for search in task list
   *
   * @param event - search string come from search component
   *
   */
  filterBySearch(searchString: string): void {
    const lowerSearchString = searchString.toLowerCase();
    const filteredTasks = this.tasks().filter((task) =>
      task.title.toLowerCase().includes(lowerSearchString)
    );
    console.log(filteredTasks);
    this.divideTasksByStatus(filteredTasks);
  }

  /**
   * update order of task
   *
   * @param tasks all task
   */
  private updateTaskOrder(tasks: Task[]): void {
    tasks.forEach((task, index) => {
      task.order = index;
      this.taskService.editTask(task, task.id).subscribe(() => {});
    });
  }

  /**
   * Sort tasks by their order property.
   */
  private sortTasksByOrder(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) => a.order - b.order);
  }

  /**
   * handle logout
   */
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}

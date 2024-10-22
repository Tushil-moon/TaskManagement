import { Component, inject, signal } from '@angular/core';
import { TaskService } from '../../../../Services/task/task.service';
import { HeaderComponent } from '../../Components/header/header.component';
import { Task } from '../../Models/task';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  FilterComponent,
  FilterData,
} from '../../Components/filter/filter.component';
import { SearchComponent } from '../../Components/search/search.component';
import { FormsModule } from '@angular/forms';
import { TruncatePipe } from '../../../../Pipe/truncate.pipe';
import { AddtaskComponent } from '../../Modal/addtask/addtask.component';
import { BehaviorSubject, filter, switchMap, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { DeleteComponent } from '../../Modal/delete/delete.component';
import { LoaderService } from '../../../../Services/task/loader.service';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-tasklist',
  standalone: true,
  templateUrl: './tasklist.component.html',
  styleUrl: './tasklist.component.css',
  imports: [
    HeaderComponent,
    CommonModule,
    FilterComponent,
    SearchComponent,
    FormsModule,
    TruncatePipe,
    DragDropModule,
  ],
})
export class TasklistComponent {
  private router = inject(Router);
  private taskService = inject(TaskService);
  private modalService = inject(NgbModal);
  loader = inject(LoaderService);

  /**
   * hold the filtered task and perform the every filter action this signal
   */
  filteredTasks = signal<Task[]>([]);

  /**
   * hold the task list which is filter by priority
   */
  priorityFilterdTask = signal<Task[]>([]);

  /**
   * hold the value of selected status from sort which is to be use for sorting
   */
  selectedSort = signal<string>('');

  /**
   * hold the value of selected priority from sort which is to be use for sorting
   */
  selectedSortPrio = signal<string>('');

  /**
   * hold the value of task filter by status
   */
  statusFilterTask = signal<Task[]>([]);

  /**
   * Reactive signal containing the list of tasks.
   *
   * This signal updates the view whenever the list of tasks changes.
   */
  tasks = signal<Task[]>([]);

  /**
   * hold the true value for decription truncate
   */
  isTruncated: boolean = true;

  /**
   * hold the max length for description
   */
  maxLength = signal<number>(80);

  /**
   * set taskid that hold task id for get task for edit modal
   */
  taskId = signal<string>('');

  /**
   * take behaviour subjec with initial value false
   */
  private _getAllTask$ = new BehaviorSubject<boolean>(true);

  /**
   * take subject as observable
   */
  getAllTask$ = this._getAllTask$.asObservable();

  /**
   * convert observable to signal for call api if the behaviour subject emit true
   */
  getTask$ = toSignal(
    this._getAllTask$.pipe(
      filter((add) => !!add),
      switchMap(() => this.taskService.getAllTask()),
      tap((task: Task[]) => {
        this.tasks.set(task);
        this.filteredTasks.set(task);
      })
    )
  );

  /**
   * Delete a task by its ID and refreshes the task list.
   *
   * @param id - The ID of the task to be deleted. Can be a number or string.
   */
  onDelete(id: string): void {
    const modalRef = this.modalService.open(DeleteComponent);

    if (id) {
      modalRef.componentInstance.taskId = id;
    }
    modalRef.result.then((result) => {
      if (!!result) {
        this._getAllTask$.next(true);
      }
    });
  }

  /**
   * Navigates to the edit page for the specified task.
   *
   * @param id - The ID of the task to be edited. Can be a number or string.
   */
  onEdit(id: string): void {
    this.taskId.set(id);
    this.openModal();
  }

  /**
   * Handle the modal open
   */
  openModal(): void {
    const modalRef = this.modalService.open(AddtaskComponent);
    if (this.taskId()) {
      modalRef.componentInstance.taskId = this.taskId();
    }
    modalRef.result.then((result) => {
      if (!!result) {
        this._getAllTask$.next(true);
      }
    });
  }

  /**
   * Navigates to the view page for the specified task.
   *
   * @param id - The ID of the task to be viewed. Can be a number or string.
   */
  onView(id: string): void {
    this.router.navigate(['/view', id]);
  }

  /**
   * Returns the CSS class for the task status.
   *
   * @param status - The status of the task. Can be 'completed', 'in-progress', or 'not-started'.
   * @returns The CSS class corresponding to the task status.
   */
  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'completed';
      case 'in-progress':
        return 'in-progress';
      case 'pending':
        return 'pending';
      case 'new':
        return 'new';
      case 'onhold':
        return 'onhold';
      default:
        return '';
    }
  }

  /**
   * This method is event bind with search component and use for search in task list
   *
   * @param event - search string come from search component
   *
   */
  filterBySearch(string: string): void {
    const searchString = string.toLowerCase();
    const filterTask = this.tasks().filter((task) =>
      task.title.toLowerCase().includes(searchString)
    );
    this.filteredTasks.set(filterTask);
    this.loader.hideLoader();
  }

  /**
   * This method is event bind with filter component it work as per filter components actions
   *
   * @param e - the param e is incoming data from filter component
   */
  filter(filterData: FilterData): void {
    const { status, priority } = filterData;

    let filtered = this.tasks();

    if (status && priority) {
      if (status == 'all' && priority !== 'all') {
        this.priorityFilterdTask.set(
          filtered.filter(
            (task) => task.priority.toLowerCase() === priority.toLowerCase()
          )
        );
        this.filteredTasks.set(this.priorityFilterdTask());
      } else if (status !== 'all' && priority == 'all') {
        this.statusFilterTask.set(
          filtered.filter((task) => {
            return task.status.toLowerCase() === status.toLowerCase();
          })
        );
        this.filteredTasks.set(this.statusFilterTask());
      } else if (status !== 'all' && priority !== 'all') {
        this.statusFilterTask.set(
          filtered.filter((task) => {
            return task.status.toLowerCase() === status.toLowerCase();
          })
        );
        this.filteredTasks.set(this.statusFilterTask());
        if (priority && priority !== 'all') {
          this.priorityFilterdTask.set(
            this.statusFilterTask().filter(
              (task) => task.priority.toLowerCase() === priority.toLowerCase()
            )
          );
          this.filteredTasks.set(this.priorityFilterdTask());
        }
      } else {
        this.filteredTasks.set(filtered);
      }
    }
  }

  /**
   * Method use for sort the task list as per due date in asc and dec form
   */
  onSortDueDate(): void {
    if (this.selectedSort() === 'Ascending') {
      const ascending = this.filteredTasks().sort((a, b) => {
        const dateA = new Date(a.dueDate);
        const dateB = new Date(b.dueDate);

        return dateA.getTime() - dateB.getTime();
      });
      this.filteredTasks.set(ascending);
    } else {
      const descending = this.filteredTasks().sort((a, b) => {
        const dateA = new Date(a.dueDate);
        const dateB = new Date(b.dueDate);

        return dateB.getTime() - dateA.getTime();
      });
      this.filteredTasks.set(descending);
    }
  }

  /**
   * Sort method use for sort the task as per priority
   */
  onSortPriority(): void {
    if (this.selectedSortPrio() === 'Ascending') {
      const sortedTasks = this.filteredTasks().sort((a, b) => {
        return this.comparePriority(a.priority, b.priority);
      });
      console.log(sortedTasks);

      this.filteredTasks.set(sortedTasks);
    } else {
      const sortedTasks = this.filteredTasks().sort((a, b) => {
        return this.comparePriority(b.priority, a.priority);
      });

      this.filteredTasks.set(sortedTasks);
    }
  }

  /**
   * This method use to compare the priority by it's index and set as per priority order
   *
   * @param priorityA - initial priority
   * @param priorityB - immediate after initial priority
   * @returns - this method return a order as number
   */
  comparePriority(priorityA: string, priorityB: string): number {
    const priorityOrder = ['low', 'medium', 'high'];
    console.log(priorityOrder.indexOf(priorityA));
    return priorityOrder.indexOf(priorityA) - priorityOrder.indexOf(priorityB);
  }

  /**
   * use for toggle descripton full or half
   */
  toggleDescription() {
    this.isTruncated = !this.isTruncated;
  }
}

import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, filter, switchMap, map } from 'rxjs';
import { LoaderService } from '../../../../Services/task/loader.service';
import { TaskService } from '../../../../Services/task/task.service';
import { AddtaskComponent } from '../../Modal/addtask/addtask.component';
import { DeleteComponent } from '../../Modal/delete/delete.component';
import { Task } from '../../Models/task';
import { FilterComponent, FilterData } from '../filter/filter.component';
import { CommonModule } from '@angular/common';
import { TruncatePipe } from '../../../../Pipe/truncate.pipe';
import { SearchComponent } from '../search/search.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-task-list-ob',
  standalone: true,
  imports: [
    CommonModule,
    TruncatePipe,
    SearchComponent,
    FormsModule,
    FilterComponent,
    HeaderComponent,
    FooterComponent,
    ReactiveFormsModule
  ],
  templateUrl: './task-list-ob.component.html',
  styleUrl: './task-list-ob.component.css',
})
export class TaskListObComponent {
  private router = inject(Router);
  private taskService = inject(TaskService);
  private modalService = inject(NgbModal);
  private fb = inject(FormBuilder);
  loader = inject(LoaderService);

  /**
   * Holds the selected sorting criterion for the task list, used to determine the order of tasks.
   * @defaultValue - empty string
   */
  selectedSortStatus: FormGroup = this.fb.group({
    status:this.fb.control('')
  })

  /**
   * Holds the selected priority sorting criterion, used to filter tasks by priority.
   * @defaultValue - empty string
   */
  selectedSortPriority: FormGroup = this.fb.group({
    priority:this.fb.control('')
  })


  /**
   * Indicates whether the task descriptions should be truncated to a maximum length.
   *
   * @defaultValue true
   */
  isTruncated: boolean = true;

  /**
   * take behaviour subject with initial value false
   */
  private _getAllTask$ = new BehaviorSubject<boolean>(true);

  /**
   * take subject as observable
   */
  getAllTask$ = this._getAllTask$.asObservable();

  /**
   * take behaviour subject with initial value false
   */
  private _taskList$ = new BehaviorSubject<Task[]>([]);

  /**
   * take subject as observable
   */
  taskList$ = this._getAllTask$.asObservable();

  /**
   * take behaviour subject with initial value false
   */
  _filterdTaskList$ = new BehaviorSubject<Task[]>([]);

  /**
   * take subject as observable
   */
  filterdTaskList$ = this._getAllTask$.asObservable();

  /**
   * convert observable to signal for call api if the behaviour subject emit true
   */
  getTask$ = this._getAllTask$.pipe(
    filter((value) => !!value),
    switchMap(() => this.taskService.getAllTask()),
    map((task) => {
      this._taskList$.next(task);
      this._filterdTaskList$.next(task);
      console.log(this._taskList$.value);
      return task;
    })
  );

  /**
   * Delete a task by its ID and refreshes the task list.
   *
   * @param id - The ID of the task to be deleted. Can be a number or string.
   */
  onDelete(id?: string): void {
    this.openModal(id, 'delete');
  }

  /**
   * Navigates to the edit page for the specified task.
   *
   * @param id - The ID of the task to be edited. Can be a number or string.
   */
  onEdit(id: string): void {
    this.openModal(id, 'edit');
  }

  /**
   * Handle the modal open
   */
  openModal(id?: string, name?: string): void {
    if (name === 'edit') {
      var modalRef = this.modalService.open(AddtaskComponent);
    } else {
      var modalRef = this.modalService.open(DeleteComponent);
    }
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
      case 'not-started':
        return 'not-started';
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
    const filterTask = this._taskList$.value.filter((task) =>
      task.title.toLowerCase().includes(searchString)
    );
    this._filterdTaskList$.next(filterTask);
    this.loader.hideLoader();
  }

  /**
   * This method is event bind with filter component it work as per filter components actions
   *
   * @param e - the param e is incoming data from filter component
   */
  filter(filterData: FilterData): void {
    const { status, priority } = filterData;

    let filtered = this._taskList$.value;

    if (status && priority) {
      if (status == 'all' && priority !== 'all') {
        this._filterdTaskList$.next(filtered.filter(
          (task) => task.priority.toLowerCase() === priority.toLowerCase()
        ));
      } else if (status !== 'all' && priority == 'all') {
        this._filterdTaskList$.next(filtered.filter((task) => {
          return task.status.toLowerCase() === status.toLowerCase();
        }));
      } else if (status !== 'all' && priority !== 'all') {
        this._filterdTaskList$.next(filtered.filter((task) => {
          return task.status.toLowerCase() === status.toLowerCase();
        }));
        if (priority && priority !== 'all') {
          this._filterdTaskList$.next(this._filterdTaskList$.value.filter(
            (task) => task.priority.toLowerCase() === priority.toLowerCase()
          ));
        }
      } else {
        this._filterdTaskList$.next(filtered);
      }
    }
  }

  /**
   * Method use for sort the task list as per due date in asc and dec form
   */

  sorting = this.selectedSortStatus.valueChanges.pipe(
    map((sortOrder) => {
       this._filterdTaskList$.next(
        this._filterdTaskList$.value.sort((a, b) => {
          const dateA = new Date(a.dueDate);
          const dateB = new Date(b.dueDate);
  
          switch (sortOrder) {
            case 'Ascending':
              return dateA.getTime() - dateB.getTime();
            case 'Descending':
              return dateB.getTime() - dateA.getTime();
            default:
              return 0;
          }
        })
      );
    })
  );

  /**
   * Sort method use for sort the task as per priority
   */
  onSortPriority(): void {
    // if () {
    //   const sortedTasks = this._filterdTaskList$.value.sort((a, b) => {
    //     return this.comparePriority(a.priority, b.priority);
    //   });
    //   console.log(sortedTasks);

    //   this._filterdTaskList$.next(sortedTasks);
    // } else {
    //   const sortedTasks = this._filterdTaskList$.value.sort((a, b) => {
    //     return this.comparePriority(b.priority, a.priority);
    //   });

    //   this._filterdTaskList$.next(sortedTasks);
    // }
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

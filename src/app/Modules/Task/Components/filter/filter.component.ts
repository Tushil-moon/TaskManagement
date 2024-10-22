import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoaderService } from '../../../../Services/task/loader.service';

export type FilterData = {
  status: string ;
  priority: string;
};

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css',
})
export class FilterComponent {
  /**
   * singal use for hold selectedStatus value
   */
  selectedStatus = signal<string>('all');

  /**
   * this signal use for hold selected priority data
   */
  selectedPriority = signal<string>('all');

  /**
   * this signal use for hold status list
   */
  status = signal<string[]>(['New', 'In-Progress', 'Completed','Pending','Onhold']);

  /**
   * this signal use for hold the values of priority
   */
  priority = signal<string[]>(['High', 'Medium', 'Low']);

  /**
   * decorator use for emit the filter data to tasklist component
   */
  @Output() filters = new EventEmitter<FilterData>();

  /**
   * This method create for change the value in output decorator
   */
  onApply() {
    const status = this.selectedStatus();
    const priority = this.selectedPriority();
    const data: FilterData = {
      status: status,
      priority: priority,
    };
    this.filters.emit(data);
  }
}

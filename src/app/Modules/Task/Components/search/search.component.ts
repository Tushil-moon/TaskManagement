import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { LoaderService } from '../../../../Services/task/loader.service';
import { isEqual } from 'radash';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  private fb = inject(FormBuilder);
  ls = inject(LoaderService);

  /**
   * Initialization of form
   */
  search: FormGroup = this.fb.group({
    search: ['', Validators.required],
  });

  /**
   * convert observable to signal which emit the search string to tasklist on 500ms delay
   */

  searchStr = toSignal(
    this.search.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged((prev, curr) => {
        return isEqual(prev, curr);
      }),
      tap((searchValue) => {
        this.searchString.emit(searchValue.search);
      })
    )
  );

  /**
   * output decorator use to emit the search string to tasklist component
   */
  @Output() searchString = new EventEmitter<string>();
}

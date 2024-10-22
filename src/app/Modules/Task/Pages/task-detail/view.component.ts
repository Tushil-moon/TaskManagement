import { CommonModule } from '@angular/common';
import { Component, inject} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../../../Services/task/task.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view.component.html',
  styleUrl: './view.component.css',
})
export class ViewComponent {

  private router = inject(ActivatedRoute);
  private route = inject(Router);
  private taskService = inject(TaskService);

  /**
   * Use signal to subscribe observable whenever required
   */
  getTaskDetails = toSignal(
    this.router.paramMap.pipe(
      map(param => param.get('id') || ''),
      switchMap(id => this.taskService.getTaskById(id))
    )
   )
  
  /**
   * This method handle the navigation on tasklist
   */
  exit() {
    this.route.navigate(['/tasklist']);
  }
}

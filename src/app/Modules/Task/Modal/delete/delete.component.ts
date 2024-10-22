import { Component, inject, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TaskService } from '../../../../Services/task/task.service';

@Component({
  selector: 'app-delete',
  standalone: true,
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.css',
})
export class DeleteComponent {
  private taskService = inject(TaskService);
  private activeModal = inject(NgbActiveModal);
  @Input() taskId: string | null = null;

  /**
   * Handle the close functionality of modal
   */
  onYes(yes: boolean): void {
    console.log(this.taskId);
    if (yes && this.taskId) {
      console.log('======', this.taskId);
      this.taskService.deleteTask(this.taskId).subscribe(() => {
        this.activeModal.close(true);
      });
    } else {
      this.activeModal.close();
    }
  }
  closeModal(success: boolean = false): void {
    this.activeModal.close(success);
  }
}

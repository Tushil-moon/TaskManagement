import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../Services/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private router = inject(Router);
  authService = inject(AuthService);

  /**
   * Handle route navigation to navigate on addtask route
   */
  navigateToAddTask(): void {
    this.router.navigate(['/addtask']);
  }

  /**
   * handle logout
   */
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}

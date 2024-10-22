import { Routes } from '@angular/router';
import { TasklistComponent } from './Modules/Task/Pages/tasklist/tasklist.component';
import { ViewComponent } from './Modules/Task/Pages/task-detail/view.component';
import { LoginComponent } from './Modules/Auth/Pages/login/login.component';
import { SignupComponent } from './Modules/Auth/Pages/signup/signup.component';
import { authGuard } from './Guards/Auth/auth.guard';
import { TaskListObComponent } from './Modules/Task/Components/task-list-ob/task-list-ob.component';
import { protectedGuard } from './Guards/Auth/protected.guard';
import { AddtaskComponent } from './Modules/Task/Modal/addtask/addtask.component';
import { RadashComponent } from './Modules/radash/radash.component';
import { DragDropComponent } from './Modules/Task/Pages/drag-drop/drag-drop.component';

export const routes: Routes = [
  { path: 'tasklist', component: TasklistComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'view/:id', component: ViewComponent },
  { path: 'login', component: LoginComponent, canActivate: [protectedGuard] },
  { path: 'sign-up', component: SignupComponent },
  { path: 'drag', component: DragDropComponent },
  { path: 'task', component: TaskListObComponent },
  { path: 'edit/:id', component: AddtaskComponent },
  { path: 'radash', component: RadashComponent },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];

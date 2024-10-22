import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TasklistComponent } from "./Modules/Task/Pages/tasklist/tasklist.component";
import { HeaderComponent } from "./Modules/Task/Components/header/header.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TasklistComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TaskManagement';
}
 
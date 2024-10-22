import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListObComponent } from './task-list-ob.component';

describe('TaskListObComponent', () => {
  let component: TaskListObComponent;
  let fixture: ComponentFixture<TaskListObComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskListObComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskListObComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

function beforeEach(arg0: () => Promise<void>) {
  throw new Error('Function not implemented.');
}

function expect(component: TaskListObComponent) {
  throw new Error('Function not implemented.');
}

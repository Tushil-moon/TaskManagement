import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadashComponent } from './radash.component';

describe('RadashComponent', () => {
  let component: RadashComponent;
  let fixture: ComponentFixture<RadashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadashComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

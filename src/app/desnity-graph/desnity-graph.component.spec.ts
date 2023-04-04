import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesnityGraphComponent } from './desnity-graph.component';

describe('DesnityGraphComponent', () => {
  let component: DesnityGraphComponent;
  let fixture: ComponentFixture<DesnityGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesnityGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesnityGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

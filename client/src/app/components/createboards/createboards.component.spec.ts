import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateboardsComponent } from './createboards.component';

describe('CreateboardsComponent', () => {
  let component: CreateboardsComponent;
  let fixture: ComponentFixture<CreateboardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateboardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateboardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

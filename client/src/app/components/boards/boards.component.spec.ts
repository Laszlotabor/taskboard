import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardListComponent } from './boards.component';



describe('BoardsComponent', () => {
  let component: BoardListComponent;
  let fixture: ComponentFixture<BoardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';
import { By } from '@angular/platform-browser';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit prevPage event', () => {
    spyOn(component.prevPage, 'emit');
    component.prevPage.emit();
    expect(component.prevPage.emit).toHaveBeenCalled();
  });

  it('should emit nextPage event', () => {
    spyOn(component.nextPage, 'emit');
    component.nextPage.emit();
    expect(component.nextPage.emit).toHaveBeenCalled();
  });

  it('should have default values', () => {
    expect(component.page).toBe(1);
    expect(component.pageCount).toBe(1);
    expect(component.pageSize).toBe(20);
    expect(component.totalStories).toBe(0);
  });
});

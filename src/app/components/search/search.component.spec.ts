import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SearchComponent } from './search.component';
import { HackernewsService } from '../../services/hackernews.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let hnServiceSpy: jasmine.SpyObj<HackernewsService>;

  beforeEach(waitForAsync(() => {
    hnServiceSpy = jasmine.createSpyObj('HackernewsService', ['getStories']);
    TestBed.configureTestingModule({
      imports: [SearchComponent],
      providers: [{ provide: HackernewsService, useValue: hnServiceSpy }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should clear results if query is empty', () => {
    component.query = '';
    component.onSearch();
    expect(component.results).toEqual([]);
    expect(component.totalStories).toBe(0);
  });

  it('should call service and set results on search', () => {
    hnServiceSpy.getStories.and.returnValue(of({ totalStories: 1, newsStories: [{ title: 'Test' }] }));
    component.query = 'Test';
    component.onSearch();
    expect(component.results.length).toBe(1);
    expect(component.totalStories).toBe(1);
    expect(component.loading).toBeFalse();
  });

  it('should handle error on search', () => {
    hnServiceSpy.getStories.and.returnValue(throwError(() => new Error('fail')));
    component.query = 'Test';
    component.onSearch();
    expect(component.error).toBe('Search failed.');
    expect(component.loading).toBeFalse();
  });

  it('should update page and pageSize on paginator event', () => {
    hnServiceSpy.getStories.and.returnValue(of({ totalStories: 1, newsStories: [{ title: 'Test' }] }));
    component.query = 'Test';
    component.onPageChange({ pageIndex: 2, pageSize: 10, length: 0 } as any);
    expect(component.page).toBe(3);
    expect(component.pageSize).toBe(10);
  });
});

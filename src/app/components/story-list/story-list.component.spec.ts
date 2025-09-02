import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { StoryListComponent } from './story-list.component';
import { HackernewsService } from '../../services/hackernews.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const mockStories = [
  { title: 'Story 1', url: 'http://story1.com' },
  { title: 'Story 2', url: 'http://story2.com' }
];

describe('StoryListComponent', () => {
  let component: StoryListComponent;
  let fixture: ComponentFixture<StoryListComponent>;
  let hnServiceSpy: jasmine.SpyObj<HackernewsService>;

  beforeEach(waitForAsync(() => {
    hnServiceSpy = jasmine.createSpyObj('HackernewsService', ['getStories']);
    TestBed.configureTestingModule({
      imports: [StoryListComponent, BrowserAnimationsModule],
      providers: [{ provide: HackernewsService, useValue: hnServiceSpy }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoryListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load stories on init', () => {
    hnServiceSpy.getStories.and.returnValue(of({ totalStories: 2, newsStories: mockStories }));
    fixture.detectChanges();
    expect(component.stories.length).toBe(2);
    expect(component.totalStories).toBe(2);
    expect(component.loading).toBeFalse();
  });

  it('should handle error on fetchStories', () => {
    hnServiceSpy.getStories.and.returnValue(throwError(() => new Error('fail')));
    component.fetchStories();
    expect(component.error).toBe('loading stories...');
    expect(component.loading).toBeFalse();
  });

  it('should go to next and previous page', () => {
    hnServiceSpy.getStories.and.returnValue(of({ totalStories: 2, newsStories: mockStories }));
    component.page = 1;
    component.nextPage();
    expect(component.page).toBe(2);
    component.prevPage();
    expect(component.page).toBe(1);
  });

  it('should clear searchResults on page change', () => {
    component.searchResults = mockStories;
    hnServiceSpy.getStories.and.returnValue(of({ totalStories: 2, newsStories: mockStories }));
    component.nextPage();
    expect(component.searchResults).toBeNull();
  });

  it('should set searchResults from onSearchResults', () => {
    component.onSearchResults(mockStories);
    expect(component.searchResults).toEqual(mockStories);
    component.onSearchResults([]);
    expect(component.searchResults).toBeNull();
  });

  it('should calculate pageCount correctly', () => {
    component.totalStories = 45;
    component.pageSize = 20;
    expect(component.pageCount).toBe(3);
  });
});

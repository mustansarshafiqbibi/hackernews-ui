import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HackernewsService } from './hackernews.service';
import { environment } from '../../environments/environment';

describe('HackernewsService', () => {
  let service: HackernewsService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/api/webnews`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HackernewsService]
    });
    service = TestBed.inject(HackernewsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call API with correct params (no search)', () => {
    const mockResponse = { totalStories: 2, newsStories: [{ title: 'A' }, { title: 'B' }] };
    service.getStories(2, 10).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = httpMock.expectOne(r => {
      return r.urlWithParams === 'https://localhost:7222/api/webnews?page=2&pageSize=10';
    });
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should call API with search param', () => {
    const mockResponse = { totalStories: 1, newsStories: [{ title: 'Search' }] };
    service.getStories(1, 20, 'foo').subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = httpMock.expectOne(r => {
      return r.urlWithParams === 'https://localhost:7222/api/webnews?page=1&pageSize=20&search=foo';
    });
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should trim search param', () => {
    const mockResponse = { totalStories: 1, newsStories: [{ title: 'Search' }] };
    service.getStories(1, 20, '  bar  ').subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = httpMock.expectOne(r => {
      return r.urlWithParams === 'https://localhost:7222/api/webnews?page=1&pageSize=20&search=bar';
    });
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should default to page 1, pageSize 20', () => {
    const mockResponse = { totalStories: 0, newsStories: [] };
    service.getStories().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = httpMock.expectOne(r => {
      return r.urlWithParams === 'https://localhost:7222/api/webnews?page=1&pageSize=20';
    });
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});

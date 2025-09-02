
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HackernewsService {
  private apiUrl = `${environment.apiUrl}/api/WebNews`; // Update to your .NET API base URL

  constructor(private http: HttpClient) { }

  getStories(page: number = 1, pageSize: number = 20, search: string | null = null): Observable<{ totalStories: number, newsStories: any[] }> {
    let params: any = { page, pageSize };
    if (search && search.trim()) {
      params.search = search.trim();
    }
    return this.http.get<{ totalStories: number, newsStories: any[] }>(this.apiUrl, { params });
  }
}

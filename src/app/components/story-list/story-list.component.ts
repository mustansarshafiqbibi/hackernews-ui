import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { HackernewsService } from '../../services/hackernews.service';
import { SearchComponent } from '../search/search.component';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'app-story-list',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDividerModule,
    SearchComponent,
    PaginationComponent
  ],
  templateUrl: './story-list.component.html',
  styleUrl: './story-list.component.css'
})
export class StoryListComponent implements OnInit {
  stories: any[] = [];
  loading = false;
  error = '';
  page = 1;
  pageSize = 20;
  totalStories = 0;
  searchResults: any[] | null = null;

  constructor(private hn: HackernewsService) {}

  ngOnInit() {
    this.fetchStories();
  }

  fetchStories() {
    this.loading = true;
    this.hn.getStories(this.page, this.pageSize).subscribe({
      next: (result: { totalStories: number, newsStories: any[] }) => {
        this.stories = result.newsStories;
        this.totalStories = result.totalStories;
        this.loading = false;
      },
      error: (_err: any) => {
        this.error = 'loading stories...';
        this.loading = false;
      }
    });
  }

  onSearchResults(results: any[]) {
    this.searchResults = results && results.length ? results : null;
  }

  nextPage() {
    this.page++;
    this.fetchStories();
    this.searchResults = null;
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.fetchStories();
      this.searchResults = null;
    }
  }

  get pageCount(): number {
    return Math.max(1, Math.ceil(this.totalStories / this.pageSize));
  }
}

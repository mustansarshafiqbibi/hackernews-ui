import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { HackernewsService } from '../../services/hackernews.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatIconModule,
  MatCardModule,
  MatPaginatorModule
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  query = '';
  loading = false;
  error = '';
  results: any[] = [];
  page = 1;
  pageSize = 20;
  totalStories = 0;

  @Output() searchResults = new EventEmitter<any[]>();

  constructor(private hn: HackernewsService) {}

  onSearch() {
    if (!this.query.trim()) {
      this.results = [];
      this.totalStories = 0;
      this.searchResults.emit([]);
      return;
    }
    this.loading = true;
    this.error = '';
    this.hn.getStories(this.page, this.pageSize, this.query).subscribe({
      next: (result: { totalStories: number, newsStories: any[] }) => {
        this.results = result.newsStories;
        this.totalStories = result.totalStories;
        this.loading = false;
        this.searchResults.emit(result.newsStories);
      },
      error: () => {
        this.error = 'Search failed.';
        this.loading = false;
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.onSearch();
  }
}

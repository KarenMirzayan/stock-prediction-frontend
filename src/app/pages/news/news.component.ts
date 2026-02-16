import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { NewsCardComponent } from '../../components/news-card/news-card.component';
import { MockDataService } from '../../services/mock-data.service';
import { NewsApiService } from '../../services/news-api.service';
import { NewsItem } from '../../models';
import { LucideAngularModule, Search, Filter, X, ChevronLeft, ChevronRight } from 'lucide-angular';

@Component({
  selector: 'app-news',
  imports: [FormsModule, HeaderComponent, NewsCardComponent, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-background">
      <app-header />

      <main class="container mx-auto px-4 py-8">
        <div class="mb-6 space-y-4">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex rounded-lg border border-border bg-card p-1">
              <button (click)="feedMode.set('all')"
                      class="rounded-md px-4 py-1.5 text-sm font-medium transition-colors hover:bg-secondary"
                      [class.bg-secondary]="feedMode() === 'all'">
                All News
              </button>
              <button (click)="feedMode.set('subscriptions')"
                      class="rounded-md px-4 py-1.5 text-sm font-medium transition-colors hover:bg-secondary"
                      [class.bg-secondary]="feedMode() === 'subscriptions'">
                My Subscriptions
              </button>
            </div>

            <div class="relative max-w-sm flex-1">
              <lucide-icon [img]="Search" [size]="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"></lucide-icon>
              <input type="text" placeholder="Search news..."
                     [ngModel]="searchQuery()"
                     (ngModelChange)="searchQuery.set($event)"
                     class="w-full rounded-lg border border-input bg-card py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <div class="flex items-center gap-2 text-sm text-muted-foreground">
              <lucide-icon [img]="Filter" [size]="16"></lucide-icon>
              <span>Filters:</span>
            </div>

            <select [ngModel]="selectedCompany()" (ngModelChange)="onCompanyChange($event)"
                    class="rounded-lg border border-input bg-card px-3 py-1.5 text-sm outline-none">
              <option value="">Company</option>
              @for (company of mockData.filterCompanies; track company) {
                <option [value]="company">{{ company }}</option>
              }
            </select>

            <select [ngModel]="selectedSector()" (ngModelChange)="onSectorChange($event)"
                    class="rounded-lg border border-input bg-card px-3 py-1.5 text-sm outline-none">
              <option value="">Sector</option>
              @for (sector of mockData.filterSectors; track sector) {
                <option [value]="sector">{{ sector }}</option>
              }
            </select>

            <select [ngModel]="selectedSentiment()" (ngModelChange)="onSentimentChange($event)"
                    class="rounded-lg border border-input bg-card px-3 py-1.5 text-sm outline-none">
              <option value="">Sentiment</option>
              <option value="positive">Positive</option>
              <option value="negative">Negative</option>
              <option value="neutral">Neutral</option>
            </select>
          </div>

          @if (activeFilters().length > 0) {
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-sm text-muted-foreground">Active:</span>
              @for (filter of activeFilters(); track filter) {
                <span class="inline-flex cursor-pointer items-center gap-1 rounded-md bg-secondary px-2 py-1 pr-1 text-xs font-medium"
                      (click)="removeFilter(filter)">
                  {{ filter }}
                  <lucide-icon [img]="X" [size]="12"></lucide-icon>
                </span>
              }
              <button (click)="clearAllFilters()"
                      class="text-xs text-muted-foreground hover:text-foreground">
                Clear all
              </button>
            </div>
          }
        </div>

        @if (loading()) {
          <div class="grid gap-4 md:grid-cols-2">
            @for (i of [1, 2, 3, 4, 5, 6]; track i) {
              <div class="animate-pulse rounded-xl border border-border bg-card p-5">
                <div class="h-4 w-24 rounded bg-secondary"></div>
                <div class="mt-3 h-6 w-3/4 rounded bg-secondary"></div>
                <div class="mt-3 h-4 w-full rounded bg-secondary"></div>
                <div class="mt-3 flex gap-2">
                  <div class="h-5 w-14 rounded bg-secondary"></div>
                  <div class="h-5 w-14 rounded bg-secondary"></div>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="grid gap-4 md:grid-cols-2">
            @for (news of newsList(); track news.id) {
              <app-news-card [news]="news" />
            }
            @empty {
              <p class="col-span-2 py-12 text-center text-muted-foreground">No news articles found.</p>
            }
          </div>

          @if (totalPages() > 1) {
            <div class="mt-8 flex items-center justify-center gap-2">
              <button (click)="goToPage(currentPage() - 1)"
                      [disabled]="currentPage() === 0"
                      class="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-secondary disabled:opacity-40 disabled:pointer-events-none">
                <lucide-icon [img]="ChevronLeft" [size]="16"></lucide-icon>
                Previous
              </button>
              <span class="px-3 text-sm text-muted-foreground">
                Page {{ currentPage() + 1 }} of {{ totalPages() }}
              </span>
              <button (click)="goToPage(currentPage() + 1)"
                      [disabled]="currentPage() >= totalPages() - 1"
                      class="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-secondary disabled:opacity-40 disabled:pointer-events-none">
                Next
                <lucide-icon [img]="ChevronRight" [size]="16"></lucide-icon>
              </button>
            </div>
          }
        }
      </main>
    </div>
  `,
})
export class NewsComponent implements OnInit {
  private readonly newsApi = inject(NewsApiService);
  readonly mockData = inject(MockDataService);

  readonly feedMode = signal<'all' | 'subscriptions'>('all');
  readonly searchQuery = signal('');
  readonly selectedCompany = signal('');
  readonly selectedSector = signal('');
  readonly selectedSentiment = signal('');
  readonly activeFilters = signal<string[]>([]);

  readonly newsList = signal<NewsItem[]>([]);
  readonly loading = signal(true);
  readonly currentPage = signal(0);
  readonly totalPages = signal(0);

  readonly Search = Search;
  readonly Filter = Filter;
  readonly X = X;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews(): void {
    this.loading.set(true);

    const company = this.selectedCompany();
    const sector = this.selectedSector();
    const sentiment = this.selectedSentiment();
    const page = this.currentPage();

    let request$;
    if (company) {
      request$ = this.newsApi.getNewsByCompany(company, page);
    } else if (sector) {
      request$ = this.newsApi.getNewsBySector(sector, page);
    } else if (sentiment) {
      request$ = this.newsApi.getNewsBySentiment(sentiment, page);
    } else {
      request$ = this.newsApi.getLatestNews(page);
    }

    request$.subscribe({
      next: (result) => {
        this.newsList.set(result.content);
        this.totalPages.set(result.totalPages);
        this.loading.set(false);
      },
      error: () => {
        this.newsList.set(this.mockData.allNews);
        this.totalPages.set(1);
        this.loading.set(false);
      },
    });
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    this.loadNews();
  }

  onCompanyChange(value: string): void {
    this.selectedCompany.set(value);
    this.selectedSector.set('');
    this.selectedSentiment.set('');
    this.currentPage.set(0);
    this.updateFilters();
    if (value) this.loadNews();
  }

  onSectorChange(value: string): void {
    this.selectedSector.set(value);
    this.selectedCompany.set('');
    this.selectedSentiment.set('');
    this.currentPage.set(0);
    this.updateFilters();
    if (value) this.loadNews();
  }

  onSentimentChange(value: string): void {
    this.selectedSentiment.set(value);
    this.selectedCompany.set('');
    this.selectedSector.set('');
    this.currentPage.set(0);
    this.updateFilters();
    if (value) this.loadNews();
  }

  removeFilter(filter: string): void {
    if (this.selectedCompany() === filter) this.selectedCompany.set('');
    if (this.selectedSector() === filter) this.selectedSector.set('');
    if (this.selectedSentiment() === filter) this.selectedSentiment.set('');
    this.updateFilters();
    this.currentPage.set(0);
    this.loadNews();
  }

  clearAllFilters(): void {
    this.selectedCompany.set('');
    this.selectedSector.set('');
    this.selectedSentiment.set('');
    this.searchQuery.set('');
    this.activeFilters.set([]);
    this.currentPage.set(0);
    this.loadNews();
  }

  private updateFilters(): void {
    const filters: string[] = [];
    if (this.selectedCompany()) filters.push(this.selectedCompany());
    if (this.selectedSector()) filters.push(this.selectedSector());
    if (this.selectedSentiment()) filters.push(this.selectedSentiment());
    this.activeFilters.set(filters);
  }
}

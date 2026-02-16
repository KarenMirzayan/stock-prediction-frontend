import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { MarketIndicatorComponent } from '../../components/market-indicator/market-indicator.component';
import { SentimentGaugeComponent } from '../../components/sentiment-gauge/sentiment-gauge.component';
import { SectorSentimentComponent } from '../../components/sector-sentiment/sector-sentiment.component';
import { EventsPreviewComponent } from '../../components/events-preview/events-preview.component';
import { NewsCardComponent } from '../../components/news-card/news-card.component';
import { MockDataService } from '../../services/mock-data.service';
import { NewsApiService } from '../../services/news-api.service';
import { NewsItem } from '../../models';

@Component({
  selector: 'app-home',
  imports: [HeaderComponent, MarketIndicatorComponent, SentimentGaugeComponent, SectorSentimentComponent, EventsPreviewComponent, NewsCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-background">
      <app-header />

      <main class="container mx-auto px-4 py-8">
        <div class="grid gap-6 lg:grid-cols-3">
          <div class="lg:col-span-2">
            <app-market-indicator
              state="bullish"
              description="Markets showing moderate growth with positive momentum"
              [factors]="['Strong corporate earnings reports', 'Declining inflation pressures', 'Positive employment data', 'Central bank policy signals']" />
          </div>
          <div>
            <app-sentiment-gauge [value]="35" />
          </div>
        </div>

        <div class="mt-6">
          <app-sector-sentiment [sectors]="mockData.homeSectors" />
        </div>

        <div class="mt-8 grid gap-6 lg:grid-cols-3">
          <div class="lg:col-span-2">
            <div class="mb-4 flex items-center justify-between">
              <h2 class="text-xl font-semibold">Key News</h2>
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
            </div>

            @if (loading()) {
              <div class="space-y-4">
                @for (i of [1, 2, 3, 4]; track i) {
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
              <div class="space-y-4">
                @for (news of newsList(); track news.id) {
                  <app-news-card [news]="news" />
                }
                @empty {
                  <p class="py-8 text-center text-muted-foreground">No news articles available yet.</p>
                }
              </div>
            }
          </div>

          <div>
            <app-events-preview [events]="mockData.homeEvents" />
          </div>
        </div>
      </main>
    </div>
  `,
})
export class HomeComponent implements OnInit {
  private readonly newsApi = inject(NewsApiService);
  readonly mockData = inject(MockDataService);

  readonly feedMode = signal<'all' | 'subscriptions'>('all');
  readonly newsList = signal<NewsItem[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.newsApi.getLatestNews(0, 4).subscribe({
      next: (page) => {
        this.newsList.set(page.content);
        this.loading.set(false);
      },
      error: () => {
        this.newsList.set(this.mockData.homeNews);
        this.loading.set(false);
      },
    });
  }
}

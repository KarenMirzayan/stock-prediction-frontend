import { Component, ChangeDetectionStrategy, signal, inject, OnInit, effect } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { MarketIndicatorComponent } from '../../components/market-indicator/market-indicator.component';
import { SentimentGaugeComponent } from '../../components/sentiment-gauge/sentiment-gauge.component';
import { SectorSentimentComponent } from '../../components/sector-sentiment/sector-sentiment.component';
import { EventsPreviewComponent } from '../../components/events-preview/events-preview.component';
import { NewsCardComponent } from '../../components/news-card/news-card.component';
import { MockDataService } from '../../services/mock-data.service';
import { NewsApiService } from '../../services/news-api.service';
import { CalendarApiService } from '../../services/calendar-api.service';
import { SectorApiService } from '../../services/sector-api.service';
import { MarketSentimentService } from '../../services/market-sentiment.service';
import { AuthService } from '../../services/auth.service';
import { NewsItem, EventItem, SectorData, MarketSentiment } from '../../models';

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
              [state]="sentiment().state"
              [description]="sentiment().description"
              [factors]="sentiment().factors" />
          </div>
          <div>
            <app-sentiment-gauge [value]="sentiment().score" />
          </div>
        </div>

        <div class="mt-6">
          <app-sector-sentiment [sectors]="sectors()" />
        </div>

        <div class="mt-8 grid gap-6 lg:grid-cols-3">
          <div class="lg:col-span-2">
            <div class="mb-4 flex items-center justify-between">
              <h2 class="text-xl font-semibold">Key News</h2>
              <div class="flex rounded-lg border border-border bg-card p-1">
                <button (click)="onFeedModeChange('all')"
                        class="cursor-pointer rounded-md px-4 py-1.5 text-sm font-medium transition-colors hover:bg-secondary"
                        [class.bg-secondary]="feedMode() === 'all'">
                  All News
                </button>
                <button (click)="onFeedModeChange('subscriptions')"
                        class="cursor-pointer rounded-md px-4 py-1.5 text-sm font-medium transition-colors hover:bg-secondary"
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
                  <p class="py-8 text-center text-muted-foreground">
                    {{ feedMode() === 'subscriptions' ? 'No news for your subscribed companies.' : 'No news articles available yet.' }}
                  </p>
                }
              </div>
            }
          </div>

          <div>
            <app-events-preview [events]="homeEvents()" />
          </div>
        </div>
      </main>
    </div>
  `,
})
export class HomeComponent implements OnInit {
  private readonly newsApi = inject(NewsApiService);
  private readonly calendarApi = inject(CalendarApiService);
  private readonly sectorApi = inject(SectorApiService);
  private readonly sentimentApi = inject(MarketSentimentService);
  private readonly router = inject(Router);
  readonly mockData = inject(MockDataService);
  readonly auth = inject(AuthService);

  readonly feedMode = signal<'all' | 'subscriptions'>('all');
  readonly newsList = signal<NewsItem[]>([]);
  private allNews = signal<NewsItem[]>([]);
  readonly homeEvents = signal<EventItem[]>([]);
  readonly sectors = signal<SectorData[]>([]);
  readonly loading = signal(true);
  readonly sentiment = signal<MarketSentiment>({
    score: 0, state: 'stagnation', description: 'Loading market data...',
    factors: [], totalPredictions: 0, bullishCount: 0, bearishCount: 0, neutralCount: 0,
  });

  constructor() {
    effect(() => {
      const mode = this.feedMode();
      const all = this.allNews();
      if (mode === 'subscriptions') {
        const tickers = this.auth.subscribedTickers();
        this.newsList.set(all.filter(n =>
          n.companies.some(c => tickers.has(c.ticker))
        ));
      } else {
        this.newsList.set(all);
      }
    });
  }

  ngOnInit(): void {
    this.newsApi.getLatestNews(0, 20).subscribe({
      next: (page) => {
        this.allNews.set(page.content);
        this.loading.set(false);
      },
      error: () => {
        this.allNews.set(this.mockData.homeNews);
        this.loading.set(false);
      },
    });

    this.calendarApi.getUpcoming(6).subscribe({
      next: (events) => this.homeEvents.set(events.length ? events : this.mockData.homeEvents),
      error: () => this.homeEvents.set(this.mockData.homeEvents),
    });

    this.sectorApi.getHeatmap().subscribe({
      next: (sectors) => this.sectors.set(sectors.length ? sectors : this.mockData.homeSectors),
      error: () => this.sectors.set(this.mockData.homeSectors),
    });

    this.sentimentApi.getSentiment().subscribe({
      next: (data) => this.sentiment.set(data),
      error: () => {},
    });
  }

  onFeedModeChange(mode: 'all' | 'subscriptions'): void {
    if (mode === 'subscriptions' && !this.auth.isLoggedIn()) {
      this.router.navigate(['/register']);
      return;
    }
    this.feedMode.set(mode);
  }
}

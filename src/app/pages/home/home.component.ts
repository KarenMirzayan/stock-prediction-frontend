import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { MarketIndicatorComponent } from '../../components/market-indicator/market-indicator.component';
import { SentimentGaugeComponent } from '../../components/sentiment-gauge/sentiment-gauge.component';
import { SectorSentimentComponent } from '../../components/sector-sentiment/sector-sentiment.component';
import { EventsPreviewComponent } from '../../components/events-preview/events-preview.component';
import { NewsCardComponent } from '../../components/news-card/news-card.component';
import { MockDataService } from '../../services/mock-data.service';

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
          <app-sector-sentiment [sectors]="data.homeSectors" />
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

            <div class="space-y-4">
              @for (news of data.homeNews; track news.id) {
                <app-news-card [news]="news" />
              }
            </div>
          </div>

          <div>
            <app-events-preview [events]="data.homeEvents" />
          </div>
        </div>
      </main>
    </div>
  `,
})
export class HomeComponent {
  readonly data = inject(MockDataService);
  readonly feedMode = signal<'all' | 'subscriptions'>('all');
}

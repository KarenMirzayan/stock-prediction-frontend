import { Component, ChangeDetectionStrategy, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { NewsCardComponent } from '../../components/news-card/news-card.component';
import { MockDataService } from '../../services/mock-data.service';
import { LucideAngularModule, ArrowLeft, Bell, TrendingUp, TrendingDown, Share2 } from 'lucide-angular';
import { Forecast } from '../../models';

@Component({
  selector: 'app-news-detail',
  imports: [RouterLink, HeaderComponent, NewsCardComponent, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-background">
      <app-header />

      <main class="container mx-auto px-4 py-8">
        <div class="mb-6">
          <a routerLink="/news"
             class="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-secondary">
            <lucide-icon [img]="ArrowLeft" [size]="16"></lucide-icon>
            Back to News
          </a>
        </div>

        <article class="mx-auto max-w-4xl">
          <header class="mb-8">
            <time class="mb-4 block text-sm text-muted-foreground">{{ news.publishedAt }}</time>

            <h1 class="mb-4 text-3xl font-bold leading-tight md:text-4xl">{{ news.headline }}</h1>

            <div class="mb-4 flex flex-wrap gap-2">
              @for (company of news.companies; track company.ticker) {
                <span class="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs font-medium"
                      [class]="getForecastClass(company.forecast)">
                  {{ company.ticker }}
                  <lucide-icon [img]="getForecastIcon(company.forecast)" [size]="12"
                               [class]="getForecastIconRotation(company.forecast)"></lucide-icon>
                  <span class="text-[10px]">{{ company.change > 0 ? '+' : '' }}{{ company.change }}%</span>
                </span>
              }
            </div>

            <div class="mb-6 flex flex-wrap gap-1.5">
              @for (tag of news.tags; track tag) {
                <span class="rounded-md border border-border bg-transparent px-2 py-0.5 text-xs font-medium">{{ tag }}</span>
              }
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <div class="rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-accent">
                <span class="text-sm font-medium">
                  {{ news.sentimentScore > 0 ? '+' : '' }}{{ news.sentimentScore }}% Sentiment
                </span>
              </div>
              <div class="flex gap-2">
                <button class="inline-flex items-center gap-1.5 rounded-md border border-border bg-transparent px-3 py-1.5 text-sm transition-colors hover:bg-secondary">
                  <lucide-icon [img]="Bell" [size]="14"></lucide-icon>
                  Subscribe
                </button>
                <button class="inline-flex items-center gap-1.5 rounded-md border border-border bg-transparent px-3 py-1.5 text-sm transition-colors hover:bg-secondary">
                  <lucide-icon [img]="Share2" [size]="14"></lucide-icon>
                  Share
                </button>
              </div>
            </div>
          </header>

          <div class="mb-8 rounded-xl border border-border bg-card p-6">
            <h2 class="mb-3 font-semibold text-accent">AI Analysis Summary</h2>
            <p class="text-muted-foreground">{{ news.analyticalExplanation }}</p>
          </div>

          <div class="max-w-none">
            @for (paragraph of paragraphs; track $index) {
              <p class="mb-4 leading-relaxed text-foreground/90">{{ paragraph }}</p>
            }
          </div>

          <div class="mt-8 flex items-center gap-3 border-t border-border pt-6">
            <button class="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90">
              <lucide-icon [img]="Bell" [size]="16"></lucide-icon>
              Subscribe to Finance News
            </button>
          </div>
        </article>

        <section class="mx-auto mt-12 max-w-4xl">
          <h2 class="mb-6 text-xl font-semibold">Related News</h2>
          <div class="grid gap-4 md:grid-cols-2">
            @for (item of data.relatedNews; track item.id) {
              <app-news-card [news]="item" [compact]="true" />
            }
          </div>
        </section>
      </main>
    </div>
  `,
})
export class NewsDetailComponent {
  readonly data = inject(MockDataService);
  readonly ArrowLeft = ArrowLeft;
  readonly Bell = Bell;
  readonly Share2 = Share2;

  readonly news = this.data.newsDetail;
  readonly paragraphs = this.news.fullText.split('\n\n');

  getForecastClass(forecast: Forecast): string {
    const map: Record<Forecast, string> = { growth: 'text-accent', decline: 'text-destructive', stagnation: 'text-warning' };
    return map[forecast];
  }

  getForecastIcon(forecast: Forecast) {
    return forecast === 'decline' ? TrendingDown : TrendingUp;
  }

  getForecastIconRotation(forecast: Forecast): string {
    return forecast === 'stagnation' ? 'rotate-[30deg]' : '';
  }
}

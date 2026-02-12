import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, TrendingUp, TrendingDown, Bell, ExternalLink } from 'lucide-angular';
import { NewsItem, Forecast } from '../../models';

@Component({
  selector: 'app-news-card',
  imports: [RouterLink, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="group rounded-xl border border-border bg-card p-5 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5">
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1 space-y-3">
          <time class="text-xs text-muted-foreground">{{ news().publishedAt }}</time>

          <a [routerLink]="['/news', news().id]" class="block">
            <h3 class="line-clamp-2 text-lg font-semibold leading-tight transition-colors group-hover:text-accent">
              {{ news().headline }}
            </h3>
          </a>

          @if (!compact()) {
            <p class="line-clamp-2 text-sm text-muted-foreground">{{ news().summary }}</p>
          }

          <div class="flex flex-wrap gap-1.5">
            @for (company of news().companies; track company.ticker) {
              <span class="inline-flex cursor-pointer items-center gap-1 rounded-md border border-border bg-secondary px-2 py-0.5 text-xs font-medium"
                    [class]="getForecastClass(company.forecast)"
                    (click)="subscribe.emit({type: 'company', value: company.ticker})">
                {{ company.ticker }}
                <lucide-icon [img]="getForecastIcon(company.forecast)" [size]="12"
                             [class]="getForecastIconRotation(company.forecast)"></lucide-icon>
                <span class="text-[10px]">{{ company.change > 0 ? '+' : '' }}{{ company.change }}%</span>
              </span>
            }
          </div>

          <div class="flex flex-wrap gap-1.5">
            @for (tag of news().tags; track tag) {
              <span class="cursor-pointer rounded-md border border-border bg-transparent px-2 py-0.5 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                    (click)="subscribe.emit({type: 'sector', value: tag})">
                {{ tag }}
              </span>
            }
          </div>
        </div>

        <div class="flex shrink-0 flex-col items-end gap-2">
          <div class="flex items-center gap-1.5 rounded-full border px-2.5 py-1"
               [class]="getSentimentClass()">
            <span class="text-xs font-medium">
              {{ news().sentimentScore > 0 ? '+' : '' }}{{ news().sentimentScore }}%
            </span>
          </div>
        </div>
      </div>

      <div class="mt-4 flex items-center gap-2 border-t border-border pt-4">
        <a [routerLink]="['/news', news().id]"
           class="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-secondary">
          Read more
          <lucide-icon [img]="ExternalLink" [size]="14"></lucide-icon>
        </a>
        <button class="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-accent"
                (click)="subscribeFirstCompany()">
          <lucide-icon [img]="Bell" [size]="14"></lucide-icon>
          Subscribe
        </button>
      </div>
    </article>
  `,
})
export class NewsCardComponent {
  readonly news = input.required<NewsItem>();
  readonly compact = input(false);
  readonly subscribe = output<{ type: 'company' | 'sector'; value: string }>();

  readonly TrendingUp = TrendingUp;
  readonly TrendingDown = TrendingDown;
  readonly Bell = Bell;
  readonly ExternalLink = ExternalLink;

  getForecastClass(forecast: Forecast): string {
    const map: Record<Forecast, string> = {
      growth: 'text-accent',
      decline: 'text-destructive',
      stagnation: 'text-warning',
    };
    return map[forecast];
  }

  getForecastIcon(forecast: Forecast) {
    return forecast === 'decline' ? TrendingDown : TrendingUp;
  }

  getForecastIconRotation(forecast: Forecast): string {
    return forecast === 'stagnation' ? 'rotate-[30deg]' : '';
  }

  subscribeFirstCompany(): void {
    const first = this.news().companies[0];
    if (first) {
      this.subscribe.emit({ type: 'company', value: first.ticker });
    }
  }

  getSentimentClass(): string {
    const map = {
      positive: 'bg-accent/20 text-accent border-accent/30',
      negative: 'bg-destructive/20 text-destructive border-destructive/30',
      neutral: 'bg-muted text-muted-foreground border-border',
    };
    return map[this.news().sentiment];
  }
}

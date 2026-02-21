import { Component, ChangeDetectionStrategy, input, signal, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, TrendingUp, TrendingDown, Minus, Shuffle, Zap, ExternalLink, Globe } from 'lucide-angular';
import { NewsItem, Direction } from '../../models';

@Component({
  selector: 'app-news-card',
  imports: [RouterLink, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <article class="group rounded-xl border border-border bg-card p-5 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5">
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1 space-y-3">
          <div class="relative inline-block"
               (mouseenter)="onTimeEnter()"
               (mouseleave)="onTimeLeave()">
            <time class="cursor-default text-xs text-muted-foreground">{{ news().publishedAt }}</time>
            <div class="pointer-events-none absolute bottom-full left-0 z-10 mb-2 whitespace-nowrap rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-lg transition-all duration-200
                        after:absolute after:left-4 after:top-full after:border-4 after:border-transparent after:border-t-border
                        before:absolute before:left-4 before:top-full before:-mt-[1px] before:border-4 before:border-transparent before:border-t-card before:z-10"
                 [class.opacity-0]="!tooltipVisible()"
                 [class.translate-y-1]="!tooltipVisible()"
                 [class.opacity-100]="tooltipVisible()"
                 [class.translate-y-0]="tooltipVisible()">
              {{ news().publishedAtExact }}
            </div>
          </div>

          <a [routerLink]="['/news', news().id]" class="block">
            <h3 class="line-clamp-2 min-h-[2lh] text-lg font-semibold leading-tight transition-colors group-hover:text-accent">
              {{ news().headline }}
            </h3>
          </a>

          @if (!compact()) {
            <p class="line-clamp-2 text-sm text-muted-foreground">{{ news().summary }}</p>
          }

          <div class="flex flex-wrap gap-1.5">
            @for (company of news().companies; track company.ticker) {
              <div class="relative"
                   (mouseenter)="hoveredTicker.set(company.ticker)"
                   (mouseleave)="hoveredTicker.set(null)">
                <span class="inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium transition-all duration-150 hover:brightness-125 hover:shadow-sm"
                      [class]="getDirectionClass(company.direction)"
                      [class.border-dashed]="isSectorPrediction(company.ticker)"
                      [routerLink]="isSectorPrediction(company.ticker) ? null : ['/companies', company.ticker]">
                  @if (isSectorPrediction(company.ticker)) {
                    <lucide-icon [img]="Globe" [size]="12"></lucide-icon>
                  }
                  {{ company.ticker }}
                  <lucide-icon [img]="getDirectionIcon(company.direction)" [size]="12"></lucide-icon>
                </span>
                @if (hoveredTicker() === company.ticker && company.rationale) {
                  <div class="pointer-events-none absolute bottom-full left-0 z-20 mb-2 w-64 rounded-xl border border-border bg-card p-3 shadow-xl">
                    <div class="mb-2 flex items-center gap-2">
                      <span class="inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-xs font-medium capitalize"
                            [class]="getDirectionClass(company.direction)">
                        {{ company.direction }}
                        <lucide-icon [img]="getDirectionIcon(company.direction)" [size]="10"></lucide-icon>
                      </span>
                      @if (company.confidence != null) {
                        <span class="text-xs text-muted-foreground">{{ company.confidence }}% confidence</span>
                      }
                    </div>
                    @if (company.timeHorizon) {
                      <p class="mb-1.5 text-xs font-medium text-muted-foreground">{{ formatTimeHorizon(company.timeHorizon) }}</p>
                    }
                    <p class="text-xs leading-relaxed text-foreground">{{ company.rationale }}</p>
                    @if (company.evidence?.length) {
                      <ul class="mt-2 space-y-1 border-t border-border pt-2">
                        @for (item of company.evidence; track $index) {
                          <li class="text-xs text-muted-foreground before:mr-1 before:content-['·']">{{ item }}</li>
                        }
                      </ul>
                    }
                  </div>
                }
              </div>
            }
          </div>

          <div class="flex flex-wrap gap-1.5">
            @for (tag of news().tags; track tag) {
              <span class="cursor-pointer rounded-md border border-border bg-transparent px-2 py-0.5 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                {{ tag }}
              </span>
            }
          </div>
        </div>

        <div class="flex shrink-0 flex-col items-end gap-2">
          <div class="flex items-center gap-1.5 rounded-full border px-2.5 py-1"
               [class]="getSentimentClass()">
            <span class="text-xs font-medium capitalize">
              {{ news().sentiment }}
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
      </div>
    </article>
  `,
})
export class NewsCardComponent implements OnDestroy {
  readonly news = input.required<NewsItem>();
  readonly compact = input(false);
  readonly tooltipVisible = signal(false);
  readonly hoveredTicker = signal<string | null>(null);

  readonly ExternalLink = ExternalLink;
  readonly Globe = Globe;

  private tooltipTimer: ReturnType<typeof setTimeout> | null = null;

  private readonly directionConfig: Record<Direction, { icon: any; class: string }> = {
    bullish:  { icon: TrendingUp,   class: 'border-accent/40 bg-accent/10 text-accent' },
    bearish:  { icon: TrendingDown,  class: 'border-destructive/40 bg-destructive/10 text-destructive' },
    neutral:  { icon: Minus,         class: 'border-border bg-muted text-muted-foreground' },
    mixed:    { icon: Shuffle,       class: 'border-warning/40 bg-warning/10 text-warning' },
    volatile: { icon: Zap,           class: 'border-purple-500/40 bg-purple-500/10 text-purple-500' },
  };

  onTimeEnter(): void {
    this.tooltipTimer = setTimeout(() => this.tooltipVisible.set(true), 1000);
  }

  onTimeLeave(): void {
    if (this.tooltipTimer) {
      clearTimeout(this.tooltipTimer);
      this.tooltipTimer = null;
    }
    this.tooltipVisible.set(false);
  }

  ngOnDestroy(): void {
    if (this.tooltipTimer) {
      clearTimeout(this.tooltipTimer);
    }
  }

  getDirectionClass(direction: Direction): string {
    return this.directionConfig[direction].class;
  }

  getDirectionIcon(direction: Direction) {
    return this.directionConfig[direction].icon;
  }

  isSectorPrediction(ticker: string): boolean {
    return ticker.includes(':');
  }

  formatTimeHorizon(th: string): string {
    return th.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
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

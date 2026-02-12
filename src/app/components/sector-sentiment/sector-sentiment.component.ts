import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { LucideAngularModule, TrendingUp, TrendingDown } from 'lucide-angular';
import { SectorData, MarketState } from '../../models';

@Component({
  selector: 'app-sector-sentiment',
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rounded-xl border border-border bg-card p-5">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="font-semibold">Sector Sentiment</h3>
        <div class="flex items-center gap-3 text-xs text-muted-foreground">
          <span class="flex items-center gap-1.5">
            <span class="h-2.5 w-2.5 rounded-sm bg-accent"></span>
            Bullish
          </span>
          <span class="flex items-center gap-1.5">
            <span class="h-2.5 w-2.5 rounded-sm bg-warning"></span>
            Stagnation
          </span>
          <span class="flex items-center gap-1.5">
            <span class="h-2.5 w-2.5 rounded-sm bg-destructive"></span>
            Bearish
          </span>
        </div>
      </div>

      <div class="flex flex-col gap-1.5" style="height: 300px">
        <div class="flex gap-1.5" [style.height.%]="topHeightPercent()">
          @for (sector of topRow(); track sector.name) {
            <div class="relative flex flex-col items-center justify-center overflow-hidden rounded-lg border p-4 transition-all hover:brightness-110"
                 [class]="getSquareClass(sector.sentiment)"
                 [style.width.%]="getTopWidth(sector)">
              <span class="text-center text-sm font-semibold leading-tight">{{ sector.name }}</span>
              <span class="mt-1 text-2xl font-bold" [class]="getValueClass(sector.sentiment)">
                {{ sector.change > 0 ? '+' : '' }}{{ sector.change }}%
              </span>
              <div class="mt-1 flex items-center gap-1 text-xs opacity-80">
                <lucide-icon [img]="getIcon(sector.sentiment)" [size]="14"
                             [class]="getIconRotation(sector.sentiment)"></lucide-icon>
                {{ getLabel(sector.sentiment) }}
              </div>
            </div>
          }
        </div>

        <div class="flex gap-1.5" [style.height.%]="bottomHeightPercent()">
          @for (sector of bottomRow(); track sector.name) {
            <div class="relative flex flex-col items-center justify-center overflow-hidden rounded-lg border p-4 transition-all hover:brightness-110"
                 [class]="getSquareClass(sector.sentiment)"
                 [style.width.%]="getBottomWidth(sector)">
              <span class="text-center text-sm font-semibold leading-tight">{{ sector.name }}</span>
              <span class="mt-1 text-2xl font-bold" [class]="getValueClass(sector.sentiment)">
                {{ sector.change > 0 ? '+' : '' }}{{ sector.change }}%
              </span>
              <div class="mt-1 flex items-center gap-1 text-xs opacity-80">
                <lucide-icon [img]="getIcon(sector.sentiment)" [size]="14"
                             [class]="getIconRotation(sector.sentiment)"></lucide-icon>
                {{ getLabel(sector.sentiment) }}
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class SectorSentimentComponent {
  readonly sectors = input.required<SectorData[]>();

  readonly sorted = computed(() => [...this.sectors()].sort((a, b) => b.marketCap - a.marketCap));
  readonly topRow = computed(() => this.sorted().slice(0, 3));
  readonly bottomRow = computed(() => this.sorted().slice(3));

  readonly totalCap = computed(() => this.sectors().reduce((sum, s) => sum + s.marketCap, 0));
  readonly topTotal = computed(() => this.topRow().reduce((sum, s) => sum + s.marketCap, 0));
  readonly bottomTotal = computed(() => this.bottomRow().reduce((sum, s) => sum + s.marketCap, 0));

  readonly topHeightPercent = computed(() => (this.topTotal() / this.totalCap()) * 100);
  readonly bottomHeightPercent = computed(() => (this.bottomTotal() / this.totalCap()) * 100);

  getTopWidth(sector: SectorData): number {
    return (sector.marketCap / this.topTotal()) * 100;
  }

  getBottomWidth(sector: SectorData): number {
    return (sector.marketCap / this.bottomTotal()) * 100;
  }

  getSquareClass(sentiment: MarketState): string {
    const map: Record<MarketState, string> = {
      bullish: 'border-accent/30 bg-accent/10 text-accent',
      bearish: 'border-destructive/30 bg-destructive/10 text-destructive',
      stagnation: 'border-warning/30 bg-warning/10 text-warning',
    };
    return map[sentiment];
  }

  getValueClass(sentiment: MarketState): string {
    const map: Record<MarketState, string> = {
      bullish: 'text-accent',
      bearish: 'text-destructive',
      stagnation: 'text-warning',
    };
    return map[sentiment];
  }

  getIcon(sentiment: MarketState) {
    return sentiment === 'bearish' ? TrendingDown : TrendingUp;
  }

  getIconRotation(sentiment: MarketState): string {
    return sentiment === 'stagnation' ? 'rotate-[30deg]' : '';
  }

  getLabel(sentiment: MarketState): string {
    const map: Record<MarketState, string> = {
      bullish: 'Bullish',
      bearish: 'Bearish',
      stagnation: 'Stagnation',
    };
    return map[sentiment];
  }
}

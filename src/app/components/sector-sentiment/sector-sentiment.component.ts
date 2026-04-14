import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { LucideAngularModule, TrendingUp, TrendingDown } from 'lucide-angular';
import { SectorData, MarketState } from '../../models';

interface Tile {
  x: number;
  y: number;
  w: number;
  h: number;
  sector: SectorData;
}

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface TreeItem {
  sector: SectorData;
  area: number;
}

@Component({
  selector: 'app-sector-sentiment',
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rounded-xl border border-border bg-card p-5">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="font-semibold">Sector Breakdown</h3>
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

      <div class="relative" style="height: 300px">
        @for (tile of tiles(); track tile.sector.name) {
          <div class="absolute p-[3px]"
               [style.left.%]="tile.x"
               [style.top.%]="tile.y"
               [style.width.%]="tile.w"
               [style.height.%]="tile.h">
            <div class="flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg border transition-all hover:brightness-110"
                 [class]="getSquareClass(tile.sector.sentiment)">
              <span class="text-center text-sm font-semibold leading-tight">{{ tile.sector.name }}</span>
              <span class="mt-1 text-2xl font-bold" [class]="getValueClass(tile.sector.sentiment)">
                {{ tile.sector.change > 0 ? '+' : '' }}{{ tile.sector.change }}%
              </span>
              <span class="mt-0.5 text-xs opacity-60">{{ formatMarketCap(tile.sector.marketCap) }}</span>
              <div class="mt-0.5 flex items-center gap-1 text-xs opacity-80">
                <lucide-icon [img]="getIcon(tile.sector.sentiment)" [size]="14"
                             [class]="getIconRotation(tile.sector.sentiment)"></lucide-icon>
                {{ getLabel(tile.sector.sentiment) }}
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class SectorSentimentComponent {
  readonly sectors = input.required<SectorData[]>();

  readonly tiles = computed(() => this.computeTreemap());

  private computeTreemap(): Tile[] {
    const sectors = [...this.sectors()].sort((a, b) => b.marketCap - a.marketCap);
    if (!sectors.length) return [];

    const totalCap = sectors.reduce((sum, s) => sum + s.marketCap, 0);
    if (totalCap === 0) return [];

    const containerArea = 100 * 100;

    // Square root scale: dampens extreme size differences while keeping meaningful proportions
    const sqrtAreas = sectors.map(s => Math.sqrt(s.marketCap));
    const sqrtTotal = sqrtAreas.reduce((sum, v) => sum + v, 0);

    let items: TreeItem[] = sectors.map((s, i) => ({
      sector: s,
      area: (sqrtAreas[i] / sqrtTotal) * containerArea,
    }));

    const tiles: Tile[] = [];
    this.squarify(items, [], { x: 0, y: 0, w: 100, h: 100 }, tiles);
    return tiles;
  }

  private squarify(children: TreeItem[], row: TreeItem[], rect: Rect, tiles: Tile[]): void {
    if (children.length === 0) {
      if (row.length > 0) this.layoutRow(row, rect, tiles);
      return;
    }

    if (rect.w <= 0 || rect.h <= 0) return;

    if (children.length === 1) {
      this.layoutRow([...row, children[0]], rect, tiles);
      return;
    }

    const c = children[0];
    const shortSide = Math.min(rect.w, rect.h);
    const newRow = [...row, c];

    if (row.length === 0 || this.worst(newRow, shortSide) <= this.worst(row, shortSide)) {
      this.squarify(children.slice(1), newRow, rect, tiles);
    } else {
      const remaining = this.layoutRow(row, rect, tiles);
      this.squarify(children, [], remaining, tiles);
    }
  }

  private worst(row: TreeItem[], shortSide: number): number {
    if (row.length === 0 || shortSide === 0) return Infinity;

    const s = row.reduce((sum, r) => sum + r.area, 0);
    const s2 = s * s;
    const w2 = shortSide * shortSide;

    let worstRatio = 0;
    for (const r of row) {
      const ratio = Math.max((w2 * r.area) / s2, s2 / (w2 * r.area));
      worstRatio = Math.max(worstRatio, ratio);
    }
    return worstRatio;
  }

  private layoutRow(row: TreeItem[], rect: Rect, tiles: Tile[]): Rect {
    if (row.length === 0) return rect;

    const totalArea = row.reduce((sum, r) => sum + r.area, 0);

    if (rect.w >= rect.h) {
      // Vertical strip on the left
      const colWidth = totalArea / rect.h;
      let y = rect.y;
      for (const r of row) {
        const h = r.area / colWidth;
        tiles.push({ x: rect.x, y, w: colWidth, h, sector: r.sector });
        y += h;
      }
      return { x: rect.x + colWidth, y: rect.y, w: rect.w - colWidth, h: rect.h };
    } else {
      // Horizontal strip on top
      const rowHeight = totalArea / rect.w;
      let x = rect.x;
      for (const r of row) {
        const w = r.area / rowHeight;
        tiles.push({ x, y: rect.y, w, h: rowHeight, sector: r.sector });
        x += w;
      }
      return { x: rect.x, y: rect.y + rowHeight, w: rect.w, h: rect.h - rowHeight };
    }
  }

  formatMarketCap(cap: number): string {
    if (cap >= 1_000_000) return `$${(cap / 1_000_000).toFixed(1)}T`;
    if (cap >= 1_000) return `$${(cap / 1_000).toFixed(0)}B`;
    return `$${cap.toFixed(0)}M`;
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

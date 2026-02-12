import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { MockDataService } from '../../services/mock-data.service';
import { LucideAngularModule, TrendingUp, TrendingDown, MessageSquare, Building2, X } from 'lucide-angular';
import { HeatmapSector } from '../../models';

@Component({
  selector: 'app-heatmap',
  imports: [HeaderComponent, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-background">
      <app-header />

      <main class="container mx-auto px-4 py-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold">Sector Heatmap</h1>
          <p class="mt-1 text-muted-foreground">Visual comparison of sector-level market activity and sentiment</p>
        </div>

        <!-- Legend -->
        <div class="mb-6 flex flex-wrap items-center gap-4 text-sm">
          <span class="text-muted-foreground">Sentiment:</span>
          <div class="flex items-center gap-2"><div class="h-3 w-3 rounded-sm bg-accent"></div><span>Bullish (60+)</span></div>
          <div class="flex items-center gap-2"><div class="h-3 w-3 rounded-sm bg-warning"></div><span>Stagnation (45-60)</span></div>
          <div class="flex items-center gap-2"><div class="h-3 w-3 rounded-sm bg-destructive"></div><span>Bearish (&lt;45)</span></div>
          <span class="ml-4 text-muted-foreground">Size = Discussion Volume</span>
        </div>

        <div class="grid gap-6 lg:grid-cols-3">
          <div class="lg:col-span-2">
            <!-- Sector Bubbles -->
            <div class="rounded-xl border border-border bg-card">
              <div class="border-b border-border p-6">
                <h3 class="text-lg font-semibold">Market Sectors</h3>
              </div>
              <div class="flex flex-wrap gap-3 p-6">
                @for (sector of data.heatmapSectors; track sector.id) {
                  <button (click)="selectedSector.set(sector)"
                          class="flex flex-col items-center justify-center rounded-lg border p-4 transition-all"
                          [class]="getSentimentBgColor(sector.sentiment) + (selectedSector()?.id === sector.id ? ' ring-2 ring-foreground' : '')"
                          [style.width.px]="getSectorSize(sector)"
                          [style.height.px]="getSectorSize(sector) * 0.75">
                    <span class="text-sm font-semibold">{{ sector.name }}</span>
                    <span class="mt-1 text-2xl font-bold" [class]="getSentimentTextColor(sector.sentiment)">
                      {{ sector.sentiment }}
                    </span>
                    <div class="mt-1 flex items-center gap-1 text-xs" [class]="getSentimentTextColor(sector.sentiment)">
                      <lucide-icon [img]="getSentimentIcon(sector.sentiment)" [size]="14"
                                   [class]="getSentimentIconRotation(sector.sentiment)"></lucide-icon>
                      <span class="opacity-80">{{ getSentimentLabel(sector.sentiment) }}</span>
                    </div>
                    <div class="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <lucide-icon [img]="MessageSquare" [size]="12"></lucide-icon>
                      {{ (sector.discussionVolume / 1000).toFixed(0) }}K
                    </div>
                  </button>
                }
              </div>
            </div>

            <!-- All Companies -->
            <div class="mt-6 rounded-xl border border-border bg-card">
              <div class="border-b border-border p-6">
                <h3 class="text-lg font-semibold">All Companies by Sentiment</h3>
              </div>
              <div class="grid gap-2 p-6 sm:grid-cols-2 lg:grid-cols-3">
                @for (company of allCompaniesSorted; track company.symbol) {
                  <div class="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-secondary/50">
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="font-medium">{{ company.symbol }}</span>
                        <span class="rounded-md border border-border px-2 py-0.5 text-xs">{{ company.sector }}</span>
                      </div>
                      <p class="mt-0.5 text-xs text-muted-foreground">{{ company.name }}</p>
                    </div>
                    <div class="text-right">
                      <div class="text-lg font-bold" [class]="getSentimentTextColor(company.sentiment)">
                        {{ company.sentiment }}
                      </div>
                      <div class="flex items-center justify-end gap-0.5 text-xs" [class]="getSentimentTextColor(company.sentiment)">
                        <lucide-icon [img]="getSentimentIcon(company.sentiment)" [size]="12"
                                     [class]="getSentimentIconRotation(company.sentiment)"></lucide-icon>
                        {{ company.change > 0 ? '+' : '' }}{{ company.change }}%
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- Sector Detail Panel -->
          <div>
            @if (selectedSector(); as sector) {
              <div class="rounded-xl border border-border bg-card">
                <div class="flex items-center justify-between border-b border-border p-6">
                  <h3 class="text-lg font-semibold">{{ sector.name }}</h3>
                  <button (click)="selectedSector.set(null)" class="rounded-md p-2 transition-colors hover:bg-secondary" aria-label="Close">
                    <lucide-icon [img]="X" [size]="16"></lucide-icon>
                  </button>
                </div>
                <div class="space-y-6 p-6">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm text-muted-foreground">Sentiment Score</p>
                      <p class="text-3xl font-bold" [class]="getSentimentTextColor(sector.sentiment)">{{ sector.sentiment }}</p>
                      <span class="text-xs" [class]="getSentimentTextColor(sector.sentiment)">{{ getSentimentLabel(sector.sentiment) }}</span>
                    </div>
                    <div class="text-right">
                      <p class="text-sm text-muted-foreground">Discussion Volume</p>
                      <p class="text-2xl font-bold">{{ (sector.discussionVolume / 1000).toFixed(0) }}K</p>
                    </div>
                  </div>

                  <div>
                    <h4 class="mb-3 flex items-center gap-2 font-medium">
                      <lucide-icon [img]="Building2" [size]="16" class="text-accent"></lucide-icon>
                      Companies
                    </h4>
                    <div class="space-y-2">
                      @for (company of sector.companies; track company.symbol) {
                        <div class="flex items-center justify-between rounded-lg border border-border p-3">
                          <div>
                            <span class="font-medium">{{ company.symbol }}</span>
                            <p class="text-xs text-muted-foreground">{{ company.name }}</p>
                          </div>
                          <div class="text-right">
                            <span class="font-bold" [class]="getSentimentTextColor(company.sentiment)">{{ company.sentiment }}</span>
                            <p class="text-xs" [class]="getSentimentTextColor(company.sentiment)">
                              {{ company.change > 0 ? '+' : '' }}{{ company.change }}%
                            </p>
                          </div>
                        </div>
                      }
                    </div>
                  </div>

                  <div>
                    <h4 class="mb-3 flex items-center gap-2 font-medium">
                      <lucide-icon [img]="MessageSquare" [size]="16" class="text-accent"></lucide-icon>
                      Trending Topics
                    </h4>
                    <div class="flex flex-wrap gap-2">
                      @for (topic of sector.topics; track topic) {
                        <span class="rounded-md bg-secondary px-2 py-1 text-xs font-medium">{{ topic }}</span>
                      }
                    </div>
                  </div>

                  <button class="w-full rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90">
                    View Sector News
                  </button>
                </div>
              </div>
            } @else {
              <div class="rounded-xl border border-border bg-card">
                <div class="flex flex-col items-center justify-center px-6 py-12 text-center">
                  <div class="mb-4 rounded-full bg-secondary p-4">
                    <lucide-icon [img]="Building2" [size]="32" class="text-muted-foreground"></lucide-icon>
                  </div>
                  <h3 class="font-medium">Select a Sector</h3>
                  <p class="mt-1 text-sm text-muted-foreground">Click on any sector in the heatmap to view detailed information</p>
                </div>
              </div>
            }
          </div>
        </div>
      </main>
    </div>
  `,
})
export class HeatmapComponent {
  readonly data = inject(MockDataService);
  readonly selectedSector = signal<HeatmapSector | null>(null);

  readonly MessageSquare = MessageSquare;
  readonly Building2 = Building2;
  readonly X = X;

  readonly maxVolume = Math.max(...this.data.heatmapSectors.map(s => s.discussionVolume));

  readonly allCompaniesSorted = this.data.heatmapSectors
    .flatMap(s => s.companies.map(c => ({ ...c, sector: s.name })))
    .sort((a, b) => b.sentiment - a.sentiment);

  getSectorSize(sector: HeatmapSector): number {
    const ratio = sector.discussionVolume / this.maxVolume;
    return 130 + ratio * 80;
  }

  getSentimentLabel(sentiment: number): string {
    if (sentiment >= 60) return 'Bullish';
    if (sentiment >= 45) return 'Stagnation';
    return 'Bearish';
  }

  getSentimentIcon(sentiment: number) {
    return sentiment < 45 ? TrendingDown : TrendingUp;
  }

  getSentimentIconRotation(sentiment: number): string {
    if (sentiment >= 60) return '';
    if (sentiment >= 45) return 'rotate-[30deg]';
    return '';
  }

  getSentimentBgColor(sentiment: number): string {
    if (sentiment >= 60) return 'bg-accent/10 border-accent/30 hover:bg-accent/20';
    if (sentiment >= 45) return 'bg-warning/10 border-warning/30 hover:bg-warning/20';
    return 'bg-destructive/10 border-destructive/30 hover:bg-destructive/20';
  }

  getSentimentTextColor(sentiment: number): string {
    if (sentiment >= 60) return 'text-accent';
    if (sentiment >= 45) return 'text-warning';
    return 'text-destructive';
  }
}

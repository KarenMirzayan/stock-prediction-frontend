import { Component, ChangeDetectionStrategy, inject, computed, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { ForecastApiService } from '../../services/forecast-api.service';
import { LucideAngularModule, TrendingUp, TrendingDown, CheckCircle2, XCircle, Target, BarChart3, PieChart, Loader2 } from 'lucide-angular';
import { Forecast, ForecastStats } from '../../models';
import { tap } from 'rxjs';

const DEFAULT_STATS: ForecastStats = {
  accuracy: 0,
  totalForecasts: 0,
  growthForecasts: 0,
  declineForecasts: 0,
  stagnationForecasts: 0,
};

@Component({
  selector: 'app-forecast',
  imports: [HeaderComponent, LucideAngularModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-background">
      <app-header />

      <main class="container mx-auto px-4 py-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold">Forecast Analytics</h1>
          <p class="mt-1 text-muted-foreground">Transparency and analytical reliability of the system</p>
        </div>

        @if (loading()) {
          <!-- Skeleton: Stats Cards -->
          <div class="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            @for (i of [1, 2, 3, 4]; track i) {
              <div class="animate-pulse rounded-xl border border-border bg-card p-6">
                <div class="flex items-center justify-between pb-2">
                  <div class="h-4 w-24 rounded bg-secondary"></div>
                  <div class="h-4 w-4 rounded bg-secondary"></div>
                </div>
                <div class="mt-2 h-8 w-16 rounded bg-secondary"></div>
                <div class="mt-2 h-3 w-32 rounded bg-secondary"></div>
              </div>
            }
          </div>

          <!-- Skeleton: Table -->
          <div class="grid gap-6 lg:grid-cols-3">
            <div class="lg:col-span-2">
              <div class="animate-pulse rounded-xl border border-border bg-card">
                <div class="flex items-center gap-2 border-b border-border p-6">
                  <div class="h-5 w-5 rounded bg-secondary"></div>
                  <div class="h-5 w-40 rounded bg-secondary"></div>
                </div>
                <div class="space-y-4 p-6">
                  @for (i of [1, 2, 3, 4, 5]; track i) {
                    <div class="flex items-center gap-4 border-b border-border pb-4 last:border-0">
                      <div class="h-4 w-20 rounded bg-secondary"></div>
                      <div class="flex-1 space-y-2">
                        <div class="h-4 w-3/4 rounded bg-secondary"></div>
                        <div class="flex gap-1">
                          <div class="h-5 w-14 rounded-md bg-secondary"></div>
                          <div class="h-5 w-14 rounded-md bg-secondary"></div>
                        </div>
                      </div>
                      <div class="h-5 w-16 rounded-full bg-secondary"></div>
                      <div class="h-4 w-12 rounded bg-secondary"></div>
                      <div class="h-5 w-5 rounded-full bg-secondary"></div>
                    </div>
                  }
                </div>
              </div>
            </div>

            <div>
              <div class="animate-pulse rounded-xl border border-border bg-card">
                <div class="flex items-center gap-2 border-b border-border p-6">
                  <div class="h-5 w-5 rounded bg-secondary"></div>
                  <div class="h-5 w-28 rounded bg-secondary"></div>
                </div>
                <div class="space-y-4 p-6">
                  @for (i of [1, 2, 3]; track i) {
                    <div>
                      <div class="mb-2 flex items-center justify-between">
                        <div class="h-4 w-20 rounded bg-secondary"></div>
                        <div class="h-4 w-10 rounded bg-secondary"></div>
                      </div>
                      <div class="h-2 rounded-full bg-secondary"></div>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        } @else if (stats().totalForecasts === 0) {
          <div class="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-12 text-center">
            <lucide-icon [img]="BarChart3" [size]="48" class="mb-4 text-muted-foreground/50"></lucide-icon>
            <h3 class="text-lg font-semibold">No verified predictions yet</h3>
            <p class="mt-2 max-w-md text-sm text-muted-foreground">
              Predictions are verified automatically once their time horizon elapses.
              Check back soon as more predictions mature and get verified against actual market data.
            </p>
          </div>
        } @else {
          <!-- Stats Cards -->
          <div class="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div class="rounded-xl border border-border bg-card p-6">
              <div class="flex items-center justify-between pb-2">
                <span class="text-sm font-medium text-muted-foreground">Forecast Accuracy</span>
                <lucide-icon [img]="Target" [size]="16" class="text-accent"></lucide-icon>
              </div>
              <div class="text-3xl font-bold text-accent">{{ stats().accuracy }}%</div>
              <p class="mt-1 text-xs text-muted-foreground">Based on {{ stats().totalForecasts }} predictions</p>
            </div>

            <div class="rounded-xl border border-border bg-card p-6">
              <div class="flex items-center justify-between pb-2">
                <span class="text-sm font-medium text-muted-foreground">Growth Forecasts</span>
                <lucide-icon [img]="TrendingUp" [size]="16" class="text-accent"></lucide-icon>
              </div>
              <div class="text-3xl font-bold">{{ stats().growthForecasts }}</div>
              <p class="mt-1 text-xs text-muted-foreground">{{ growthPct() }}% of total</p>
            </div>

            <div class="rounded-xl border border-border bg-card p-6">
              <div class="flex items-center justify-between pb-2">
                <span class="text-sm font-medium text-muted-foreground">Decline Forecasts</span>
                <lucide-icon [img]="TrendingDown" [size]="16" class="text-destructive"></lucide-icon>
              </div>
              <div class="text-3xl font-bold">{{ stats().declineForecasts }}</div>
              <p class="mt-1 text-xs text-muted-foreground">{{ declinePct() }}% of total</p>
            </div>

            <div class="rounded-xl border border-border bg-card p-6">
              <div class="flex items-center justify-between pb-2">
                <span class="text-sm font-medium text-muted-foreground">Stagnation Forecasts</span>
                <lucide-icon [img]="TrendingUp" [size]="16" class="rotate-[30deg] text-warning"></lucide-icon>
              </div>
              <div class="text-3xl font-bold">{{ stats().stagnationForecasts }}</div>
              <p class="mt-1 text-xs text-muted-foreground">{{ stagnationPct() }}% of total</p>
            </div>
          </div>

          <!-- History & Distribution -->
          <div class="grid gap-6 lg:grid-cols-3">
            <div class="lg:col-span-2">
              <div class="rounded-xl border border-border bg-card">
                <div class="flex items-center gap-2 border-b border-border p-6">
                  <lucide-icon [img]="BarChart3" [size]="20" class="text-accent"></lucide-icon>
                  <h3 class="text-lg font-semibold">Forecast History</h3>
                </div>
                <div class="overflow-x-auto p-6">
                  <table class="w-full table-fixed">
                    <colgroup>
                      <col class="w-[10%]" />
                      <col class="w-[52%]" />
                      <col class="w-[14%]" />
                      <col class="w-[14%]" />
                      <col class="w-[10%]" />
                    </colgroup>
                    <thead>
                      <tr class="border-b border-border text-left text-sm text-muted-foreground">
                        <th class="pb-3 font-medium">Date</th>
                        <th class="pb-3 font-medium">News</th>
                        <th class="pb-3 font-medium">Forecast</th>
                        <th class="pb-3 font-medium">Actual</th>
                        <th class="pb-3 font-medium">Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      @if (historyLoading()) {
                        @for (i of [1, 2, 3, 4, 5]; track i) {
                          <tr class="border-b border-border last:border-0">
                            <td class="py-3"><div class="h-4 w-16 animate-pulse rounded bg-secondary"></div></td>
                            <td class="py-3">
                              <div class="h-4 w-3/4 animate-pulse rounded bg-secondary"></div>
                              <div class="mt-2 flex gap-1">
                                <div class="h-5 w-14 animate-pulse rounded-md bg-secondary"></div>
                                <div class="h-5 w-14 animate-pulse rounded-md bg-secondary"></div>
                              </div>
                            </td>
                            <td class="py-3"><div class="h-5 w-16 animate-pulse rounded-full bg-secondary"></div></td>
                            <td class="py-3"><div class="h-4 w-12 animate-pulse rounded bg-secondary"></div></td>
                            <td class="py-3"><div class="h-5 w-5 animate-pulse rounded-full bg-secondary"></div></td>
                          </tr>
                        }
                      } @else {
                      @for (item of history(); track item.id) {
                        <tr class="border-b border-border transition-colors hover:bg-secondary/50 last:border-0">
                          <td class="py-3 text-sm text-muted-foreground">{{ item.date }}</td>
                          <td class="py-3">
                            @if (item.articleId) {
                              <a [routerLink]="['/news', item.articleId]"
                                 class="block truncate text-sm font-medium transition-colors hover:text-accent">
                                {{ item.headline }}
                              </a>
                            } @else {
                              <p class="truncate text-sm font-medium">{{ item.headline }}</p>
                            }
                            <div class="mt-1 flex flex-wrap gap-1">
                              @for (c of item.companies; track c) {
                                <span class="inline-flex cursor-default items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium transition-all hover:brightness-125"
                                      [class]="getTickerClass(item.forecast)">
                                  {{ c }}
                                  <lucide-icon [img]="getForecastIcon(item.forecast)" [size]="12"
                                               [class]="getForecastIconRotation(item.forecast)"></lucide-icon>
                                </span>
                              }
                            </div>
                          </td>
                          <td class="py-3">
                            <div class="flex w-fit items-center gap-1 rounded-full px-2 py-0.5"
                                 [class]="getForecastBadgeClass(item.forecast)">
                              <lucide-icon [img]="getForecastIcon(item.forecast)" [size]="14"
                                           [class]="getForecastIconRotation(item.forecast)"></lucide-icon>
                              <span class="text-xs font-medium capitalize">{{ item.forecast }}</span>
                            </div>
                          </td>
                          <td class="py-3">
                            <span class="font-medium"
                                  [class]="item.actualMovement.startsWith('+') ? 'text-accent' : item.actualMovement.startsWith('-') ? 'text-destructive' : 'text-muted-foreground'">
                              {{ item.actualMovement }}
                            </span>
                          </td>
                          <td class="py-3">
                            @if (item.accurate) {
                              <lucide-icon [img]="CheckCircle2" [size]="20" class="text-accent"></lucide-icon>
                            } @else {
                              <lucide-icon [img]="XCircle" [size]="20" class="text-destructive"></lucide-icon>
                            }
                          </td>
                        </tr>
                      }
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div>
              <div class="rounded-xl border border-border bg-card">
                <div class="flex items-center gap-2 border-b border-border p-6">
                  <lucide-icon [img]="PieChart" [size]="20" class="text-accent"></lucide-icon>
                  <h3 class="text-lg font-semibold">Distribution</h3>
                </div>
                <div class="space-y-4 p-6">
                  <div>
                    <div class="mb-2 flex items-center justify-between text-sm">
                      <span class="flex items-center gap-2">
                        <lucide-icon [img]="TrendingUp" [size]="16" class="text-accent"></lucide-icon>
                        Growth
                      </span>
                      <span class="font-medium">{{ growthPct() }}%</span>
                    </div>
                    <div class="h-2 overflow-hidden rounded-full bg-secondary">
                      <div class="h-full bg-accent transition-all" [style.width.%]="growthPctNum()"></div>
                    </div>
                  </div>

                  <div>
                    <div class="mb-2 flex items-center justify-between text-sm">
                      <span class="flex items-center gap-2">
                        <lucide-icon [img]="TrendingDown" [size]="16" class="text-destructive"></lucide-icon>
                        Decline
                      </span>
                      <span class="font-medium">{{ declinePct() }}%</span>
                    </div>
                    <div class="h-2 overflow-hidden rounded-full bg-secondary">
                      <div class="h-full bg-destructive transition-all" [style.width.%]="declinePctNum()"></div>
                    </div>
                  </div>

                  <div>
                    <div class="mb-2 flex items-center justify-between text-sm">
                      <span class="flex items-center gap-2">
                        <lucide-icon [img]="TrendingUp" [size]="16" class="rotate-[30deg] text-warning"></lucide-icon>
                        Stagnation
                      </span>
                      <span class="font-medium">{{ stagnationPct() }}%</span>
                    </div>
                    <div class="h-2 overflow-hidden rounded-full bg-secondary">
                      <div class="h-full bg-warning transition-all" [style.width.%]="stagnationPctNum()"></div>
                    </div>
                  </div>

                  <div class="mt-6 rounded-lg border border-border bg-secondary/50 p-4">
                    <h4 class="mb-2 font-medium">Accuracy Breakdown</h4>
                    <div class="space-y-2 text-sm">
                      <div class="flex justify-between">
                        <span class="text-muted-foreground">Growth predictions</span>
                        <span class="font-medium text-accent">{{ stats().growthAccuracy ?? '—' }}{{ stats().growthAccuracy != null ? '%' : '' }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-muted-foreground">Decline predictions</span>
                        <span class="font-medium text-accent">{{ stats().declineAccuracy ?? '—' }}{{ stats().declineAccuracy != null ? '%' : '' }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-muted-foreground">Stagnation predictions</span>
                        <span class="font-medium text-accent">{{ stats().stagnationAccuracy ?? '—' }}{{ stats().stagnationAccuracy != null ? '%' : '' }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </main>
    </div>
  `,
})
export class ForecastComponent {
  private readonly forecastApi = inject(ForecastApiService);

  readonly loading = signal(true);
  readonly historyLoading = signal(true);
  readonly stats = toSignal(this.forecastApi.getStats().pipe(tap(() => this.loading.set(false))), { initialValue: DEFAULT_STATS });
  readonly history = toSignal(this.forecastApi.getHistory().pipe(tap(() => this.historyLoading.set(false))), { initialValue: [] });

  readonly TrendingUp = TrendingUp;
  readonly TrendingDown = TrendingDown;
  readonly CheckCircle2 = CheckCircle2;
  readonly XCircle = XCircle;
  readonly Target = Target;
  readonly BarChart3 = BarChart3;
  readonly PieChart = PieChart;
  readonly Loader2 = Loader2;

  readonly growthPctNum = computed(() => {
    const s = this.stats();
    return s.totalForecasts > 0 ? (s.growthForecasts / s.totalForecasts) * 100 : 0;
  });
  readonly declinePctNum = computed(() => {
    const s = this.stats();
    return s.totalForecasts > 0 ? (s.declineForecasts / s.totalForecasts) * 100 : 0;
  });
  readonly stagnationPctNum = computed(() => {
    const s = this.stats();
    return s.totalForecasts > 0 ? (s.stagnationForecasts / s.totalForecasts) * 100 : 0;
  });

  readonly growthPct = computed(() => this.growthPctNum().toFixed(1));
  readonly declinePct = computed(() => this.declinePctNum().toFixed(1));
  readonly stagnationPct = computed(() => this.stagnationPctNum().toFixed(1));

  getForecastIcon(forecast: Forecast) {
    return forecast === 'decline' ? TrendingDown : TrendingUp;
  }

  getForecastIconRotation(forecast: Forecast): string {
    return forecast === 'stagnation' ? 'rotate-[30deg]' : '';
  }

  getForecastBadgeClass(forecast: Forecast): string {
    const map: Record<Forecast, string> = {
      growth: 'bg-accent/10 text-accent',
      decline: 'bg-destructive/10 text-destructive',
      stagnation: 'bg-warning/10 text-warning',
    };
    return map[forecast];
  }

  getTickerClass(forecast: Forecast): string {
    const map: Record<Forecast, string> = {
      growth: 'border-accent/40 bg-accent/10 text-accent',
      decline: 'border-destructive/40 bg-destructive/10 text-destructive',
      stagnation: 'border-warning/40 bg-warning/10 text-warning',
    };
    return map[forecast];
  }
}

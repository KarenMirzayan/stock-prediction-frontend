import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { MockDataService } from '../../services/mock-data.service';
import { LucideAngularModule, TrendingUp, TrendingDown, CheckCircle2, XCircle, Target, BarChart3, PieChart } from 'lucide-angular';
import { Forecast } from '../../models';

@Component({
  selector: 'app-forecast',
  imports: [HeaderComponent, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-background">
      <app-header />

      <main class="container mx-auto px-4 py-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold">Forecast Analytics</h1>
          <p class="mt-1 text-muted-foreground">Transparency and analytical reliability of the system</p>
        </div>

        <!-- Stats Cards -->
        <div class="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div class="rounded-xl border border-border bg-card p-6">
            <div class="flex items-center justify-between pb-2">
              <span class="text-sm font-medium text-muted-foreground">Forecast Accuracy</span>
              <lucide-icon [img]="Target" [size]="16" class="text-accent"></lucide-icon>
            </div>
            <div class="text-3xl font-bold text-accent">{{ stats.accuracy }}%</div>
            <p class="mt-1 text-xs text-muted-foreground">Based on {{ stats.totalForecasts }} predictions</p>
          </div>

          <div class="rounded-xl border border-border bg-card p-6">
            <div class="flex items-center justify-between pb-2">
              <span class="text-sm font-medium text-muted-foreground">Growth Forecasts</span>
              <lucide-icon [img]="TrendingUp" [size]="16" class="text-accent"></lucide-icon>
            </div>
            <div class="text-3xl font-bold">{{ stats.growthForecasts }}</div>
            <p class="mt-1 text-xs text-muted-foreground">{{ growthPct }}% of total</p>
          </div>

          <div class="rounded-xl border border-border bg-card p-6">
            <div class="flex items-center justify-between pb-2">
              <span class="text-sm font-medium text-muted-foreground">Decline Forecasts</span>
              <lucide-icon [img]="TrendingDown" [size]="16" class="text-destructive"></lucide-icon>
            </div>
            <div class="text-3xl font-bold">{{ stats.declineForecasts }}</div>
            <p class="mt-1 text-xs text-muted-foreground">{{ declinePct }}% of total</p>
          </div>

          <div class="rounded-xl border border-border bg-card p-6">
            <div class="flex items-center justify-between pb-2">
              <span class="text-sm font-medium text-muted-foreground">Stagnation Forecasts</span>
              <lucide-icon [img]="TrendingUp" [size]="16" class="rotate-[30deg] text-warning"></lucide-icon>
            </div>
            <div class="text-3xl font-bold">{{ stats.stagnationForecasts }}</div>
            <p class="mt-1 text-xs text-muted-foreground">{{ stagnationPct }}% of total</p>
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
                <table class="w-full">
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
                    @for (item of data.forecastHistory; track item.id) {
                      <tr class="border-b border-border last:border-0">
                        <td class="py-3 text-sm text-muted-foreground">{{ item.date }}</td>
                        <td class="py-3">
                          <p class="text-sm font-medium" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 250px;">{{ item.headline }}</p>
                          <div class="mt-1 flex gap-1">
                            @for (c of item.companies; track c) {
                              <span class="rounded-md bg-secondary px-1.5 py-0.5 text-xs">{{ c }}</span>
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
                    <span class="font-medium">{{ growthPct }}%</span>
                  </div>
                  <div class="h-2 overflow-hidden rounded-full bg-secondary">
                    <div class="h-full bg-accent transition-all" [style.width.%]="growthPctNum"></div>
                  </div>
                </div>

                <div>
                  <div class="mb-2 flex items-center justify-between text-sm">
                    <span class="flex items-center gap-2">
                      <lucide-icon [img]="TrendingDown" [size]="16" class="text-destructive"></lucide-icon>
                      Decline
                    </span>
                    <span class="font-medium">{{ declinePct }}%</span>
                  </div>
                  <div class="h-2 overflow-hidden rounded-full bg-secondary">
                    <div class="h-full bg-destructive transition-all" [style.width.%]="declinePctNum"></div>
                  </div>
                </div>

                <div>
                  <div class="mb-2 flex items-center justify-between text-sm">
                    <span class="flex items-center gap-2">
                      <lucide-icon [img]="TrendingUp" [size]="16" class="rotate-[30deg] text-warning"></lucide-icon>
                      Stagnation
                    </span>
                    <span class="font-medium">{{ stagnationPct }}%</span>
                  </div>
                  <div class="h-2 overflow-hidden rounded-full bg-secondary">
                    <div class="h-full bg-warning transition-all" [style.width.%]="stagnationPctNum"></div>
                  </div>
                </div>

                <div class="mt-6 rounded-lg border border-border bg-secondary/50 p-4">
                  <h4 class="mb-2 font-medium">Accuracy Breakdown</h4>
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Growth predictions</span>
                      <span class="font-medium text-accent">82%</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Decline predictions</span>
                      <span class="font-medium text-accent">75%</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Stagnation predictions</span>
                      <span class="font-medium text-accent">71%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
})
export class ForecastComponent {
  readonly data = inject(MockDataService);
  readonly stats = this.data.forecastStats;

  readonly TrendingUp = TrendingUp;
  readonly TrendingDown = TrendingDown;
  readonly CheckCircle2 = CheckCircle2;
  readonly XCircle = XCircle;
  readonly Target = Target;
  readonly BarChart3 = BarChart3;
  readonly PieChart = PieChart;

  readonly growthPctNum = (this.stats.growthForecasts / this.stats.totalForecasts) * 100;
  readonly declinePctNum = (this.stats.declineForecasts / this.stats.totalForecasts) * 100;
  readonly stagnationPctNum = (this.stats.stagnationForecasts / this.stats.totalForecasts) * 100;
  readonly growthPct = this.growthPctNum.toFixed(1);
  readonly declinePct = this.declinePctNum.toFixed(1);
  readonly stagnationPct = this.stagnationPctNum.toFixed(1);

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
}

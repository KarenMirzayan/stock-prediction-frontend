import { Component, ChangeDetectionStrategy, input, signal } from '@angular/core';
import { LucideAngularModule, LucideIconData, TrendingUp, TrendingDown, Info } from 'lucide-angular';
import { MarketState } from '../../models';

@Component({
  selector: 'app-market-indicator',
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative overflow-hidden rounded-xl border p-6"
         [class]="stateConfig[state()].colorClass">
      <div class="flex items-start justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="flex h-14 w-14 items-center justify-center rounded-xl bg-background/50"
               [class]="stateConfig[state()].iconClass">
            <lucide-icon [img]="stateConfig[state()].icon" [size]="28"
                         [class]="stateConfig[state()].iconRotation"></lucide-icon>
          </div>
          <div>
            <h2 class="text-xl font-semibold">{{ stateConfig[state()].label }}</h2>
            <p class="mt-1 text-sm opacity-80">{{ description() }}</p>
          </div>
        </div>

        <div class="relative">
          <button (click)="tooltipOpen.set(!tooltipOpen())"
                  class="rounded-full p-1.5 transition-colors hover:bg-background/20"
                  aria-label="View factors">
            <lucide-icon [img]="Info" [size]="20"></lucide-icon>
          </button>
          @if (tooltipOpen()) {
            <div class="absolute right-0 top-full z-10 mt-1 w-64 rounded-lg border border-border bg-card p-3 text-card-foreground shadow-lg">
              <p class="mb-2 font-medium">Evaluation Factors:</p>
              <ul class="space-y-1 text-sm">
                @for (factor of factors(); track factor) {
                  <li class="flex items-start gap-2">
                    <span class="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-current"></span>
                    {{ factor }}
                  </li>
                }
              </ul>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class MarketIndicatorComponent {
  readonly state = input.required<MarketState>();
  readonly description = input.required<string>();
  readonly factors = input.required<string[]>();
  readonly tooltipOpen = signal(false);

  readonly Info = Info;

  readonly stateConfig: Record<MarketState, { label: string; icon: LucideIconData; colorClass: string; iconClass: string; iconRotation: string }> = {
    bullish: {
      label: 'Bullish Market',
      icon: TrendingUp,
      colorClass: 'text-accent bg-accent/10 border-accent/20',
      iconClass: 'text-accent',
      iconRotation: '',
    },
    bearish: {
      label: 'Bearish Market',
      icon: TrendingDown,
      colorClass: 'text-destructive bg-destructive/10 border-destructive/20',
      iconClass: 'text-destructive',
      iconRotation: '',
    },
    stagnation: {
      label: 'Stagnation',
      icon: TrendingUp,
      colorClass: 'text-warning bg-warning/10 border-warning/20',
      iconClass: 'text-warning',
      iconRotation: 'rotate-[30deg]',
    },
  };
}

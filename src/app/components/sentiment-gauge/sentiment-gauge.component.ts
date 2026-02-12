import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

@Component({
  selector: 'app-sentiment-gauge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rounded-xl border border-border bg-card p-5">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="font-semibold">{{ label() || 'Market Sentiment' }}</h3>
        <span class="text-2xl font-bold" [class]="sentimentColor()">
          {{ value() > 0 ? '+' : '' }}{{ value() }}
        </span>
      </div>

      <div class="relative h-3 w-full overflow-hidden rounded-full bg-secondary">
        <div class="absolute inset-y-0 left-0 bg-gradient-to-r from-destructive via-warning to-accent"
             style="width: 100%"></div>
        <div class="absolute inset-y-0 w-1 -translate-x-1/2 bg-foreground shadow-lg transition-all duration-500"
             [style.left.%]="percentage()"></div>
      </div>

      <div class="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>Bearish</span>
        <span class="font-medium" [class]="sentimentColor()">{{ sentimentLabel() }}</span>
        <span>Bullish</span>
      </div>
    </div>
  `,
})
export class SentimentGaugeComponent {
  readonly value = input.required<number>();
  readonly label = input<string>();

  readonly percentage = computed(() => {
    const normalized = Math.max(-100, Math.min(100, this.value()));
    return ((normalized + 100) / 200) * 100;
  });

  readonly sentimentColor = computed(() => {
    const val = this.value();
    if (val > 20) return 'text-accent';
    if (val < -20) return 'text-destructive';
    return 'text-warning';
  });

  readonly sentimentLabel = computed(() => {
    const val = this.value();
    if (val > 50) return 'Very Bullish';
    if (val > 20) return 'Bullish';
    if (val > -20) return 'Neutral';
    if (val > -50) return 'Bearish';
    return 'Very Bearish';
  });
}

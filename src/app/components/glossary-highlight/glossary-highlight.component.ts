import { Component, ChangeDetectionStrategy, ViewEncapsulation, input, computed, signal } from '@angular/core';
import { GlossaryTerm } from '../../models';

interface TextSegment {
  text: string;
  term: GlossaryTerm | null;
}

@Component({
  selector: 'app-glossary-highlight',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <span class="glossary-highlight-wrapper">
      @for (seg of segments(); track $index) {
        @if (seg.term) {
          <span class="glossary-term-highlight"
                (mouseenter)="showTooltip(seg.term, $event)"
                (mouseleave)="hideTooltip()">{{ seg.text }}</span>
        } @else {
          <span>{{ seg.text }}</span>
        }
      }
    </span>

    @if (activeTerm()) {
      <div class="glossary-tooltip"
           [class.glossary-tooltip--below]="tooltipBelow()"
           [style.left.px]="tooltipX()"
           [style.top.px]="tooltipY()">
        <div class="glossary-tooltip-term">{{ activeTerm()!.term }}</div>
        <div class="glossary-tooltip-category">{{ activeTerm()!.category }}</div>
        <div class="glossary-tooltip-def">{{ activeTerm()!.definition }}</div>
      </div>
    }
  `,
  styles: [`
    .glossary-highlight-wrapper {
      display: contents;
    }
    .glossary-term-highlight {
      text-decoration: underline;
      text-decoration-style: dotted;
      text-decoration-color: hsl(var(--accent));
      text-underline-offset: 3px;
      cursor: help;
      transition: background-color 0.15s;
    }
    .glossary-term-highlight:hover {
      background-color: hsl(var(--accent) / 0.1);
      border-radius: 2px;
    }
    .glossary-tooltip {
      position: fixed;
      z-index: 9999;
      max-width: 320px;
      padding: 12px 14px;
      border-radius: 10px;
      border: 1px solid hsl(var(--border));
      background-color: hsl(var(--card));
      color: hsl(var(--foreground));
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
      pointer-events: none;
      animation: tooltip-in 0.15s ease-out;
      isolation: isolate;
      backdrop-filter: none;
      transform: translateY(-100%);
    }
    .glossary-tooltip--below {
      transform: translateY(0);
    }
    .glossary-tooltip-term {
      font-weight: 600;
      font-size: 0.8125rem;
      margin-bottom: 2px;
    }
    .glossary-tooltip-category {
      font-size: 0.6875rem;
      color: hsl(var(--muted-foreground));
      margin-bottom: 6px;
    }
    .glossary-tooltip-def {
      font-size: 0.8125rem;
      line-height: 1.45;
      color: hsl(var(--muted-foreground));
    }
    @keyframes tooltip-in {
      from { opacity: 0; transform: translateY(4px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class GlossaryHighlightComponent {
  readonly text = input.required<string>();
  readonly terms = input.required<GlossaryTerm[]>();

  readonly activeTerm = signal<GlossaryTerm | null>(null);
  readonly tooltipX = signal(0);
  readonly tooltipY = signal(0);

  readonly segments = computed<TextSegment[]>(() => {
    const text = this.text();
    const terms = this.terms();
    if (!text || terms.length === 0) return [{ text, term: null }];

    // Build regex matching all terms (longest first to avoid partial matches)
    const sorted = [...terms].sort((a, b) => b.term.length - a.term.length);
    const escaped = sorted.map(t => t.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const pattern = new RegExp(`\\b(${escaped.join('|')})\\b`, 'gi');

    // Build a map for quick lookup (lowercase key)
    const termMap = new Map<string, GlossaryTerm>();
    for (const t of terms) {
      termMap.set(t.term.toLowerCase(), t);
    }

    const segments: TextSegment[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(text)) !== null) {
      if (match.index > lastIndex) {
        segments.push({ text: text.slice(lastIndex, match.index), term: null });
      }
      const matched = termMap.get(match[1].toLowerCase()) ?? null;
      segments.push({ text: match[0], term: matched });
      lastIndex = pattern.lastIndex;
    }

    if (lastIndex < text.length) {
      segments.push({ text: text.slice(lastIndex), term: null });
    }

    return segments;
  });

  readonly tooltipBelow = signal(false);

  showTooltip(term: GlossaryTerm, event: MouseEvent): void {
    const el = event.target as HTMLElement;
    const rect = el.getBoundingClientRect();
    const x = Math.max(8, Math.min(rect.left + rect.width / 2 - 160, window.innerWidth - 330));
    // Show below the word if near the top of the viewport, otherwise above
    if (rect.top < 160) {
      this.tooltipY.set(rect.bottom + 8);
      this.tooltipBelow.set(true);
    } else {
      this.tooltipY.set(rect.top - 12);
      this.tooltipBelow.set(false);
    }
    this.tooltipX.set(x);
    this.activeTerm.set(term);
  }

  hideTooltip(): void {
    this.activeTerm.set(null);
  }
}

import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Calendar, ArrowRight } from 'lucide-angular';
import { EventItem, Relevance } from '../../models';

@Component({
  selector: 'app-events-preview',
  imports: [RouterLink, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rounded-xl border border-border bg-card">
      <div class="flex items-center justify-between border-b border-border p-5">
        <div class="flex items-center gap-2">
          <lucide-icon [img]="Calendar" [size]="20" class="text-accent"></lucide-icon>
          <h3 class="font-semibold">Upcoming Events</h3>
        </div>
        <a routerLink="/calendar"
           class="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-secondary">
          View all
          <lucide-icon [img]="ArrowRight" [size]="14"></lucide-icon>
        </a>
      </div>

      <div class="divide-y divide-border">
        @for (event of events(); track event.id) {
          <div class="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-secondary/50">
            <div class="flex items-center gap-4">
              <div class="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-secondary text-center">
                <span class="text-xs font-medium text-muted-foreground">{{ getMonth(event.date) }}</span>
                <span class="text-sm font-bold">{{ getDay(event.date) }}</span>
              </div>
              <div>
                <p class="font-medium">{{ event.title }}</p>
                <div class="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                  @if (event.company) {
                    <span>{{ event.company }}</span>
                    <span>&bull;</span>
                  }
                  <span>{{ event.sector }}</span>
                  <span>&bull;</span>
                  <span>{{ event.time }}</span>
                </div>
              </div>
            </div>
            <span class="rounded-full border px-2.5 py-0.5 text-xs font-medium"
                  [class]="getRelevanceClass(event.relevance)">
              {{ event.relevance }}
            </span>
          </div>
        }
      </div>
    </div>
  `,
})
export class EventsPreviewComponent {
  readonly events = input.required<EventItem[]>();
  readonly Calendar = Calendar;
  readonly ArrowRight = ArrowRight;

  getMonth(date: string): string {
    return date.split(' ')[0];
  }

  getDay(date: string): string {
    return date.split(' ')[1];
  }

  getRelevanceClass(relevance: Relevance): string {
    const map: Record<Relevance, string> = {
      high: 'bg-destructive/20 text-destructive border-destructive/30',
      medium: 'bg-warning/20 text-warning border-warning/30',
      low: 'bg-muted text-muted-foreground',
    };
    return map[relevance];
  }
}

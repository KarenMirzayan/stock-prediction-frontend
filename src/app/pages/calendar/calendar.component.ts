import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { MockDataService } from '../../services/mock-data.service';
import { LucideAngularModule, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Building2, Filter } from 'lucide-angular';
import { CalendarEvent, EventType, Relevance } from '../../models';

@Component({
  selector: 'app-calendar',
  imports: [FormsModule, HeaderComponent, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-background">
      <app-header />

      <main class="container mx-auto px-4 py-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold">Economic Calendar</h1>
          <p class="mt-1 text-muted-foreground">Track important market events, earnings, and economic releases</p>
        </div>

        <!-- Filters -->
        <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2 text-sm text-muted-foreground">
              <lucide-icon [img]="Filter" [size]="16"></lucide-icon>
              <span>Filters:</span>
            </div>
            <select [ngModel]="selectedCompany()" (ngModelChange)="selectedCompany.set($event)"
                    class="rounded-lg border border-input bg-card px-3 py-1.5 text-sm outline-none">
              <option value="">All Companies</option>
              @for (company of data.calendarCompanies; track company) {
                <option [value]="company">{{ company }}</option>
              }
            </select>
            <select [ngModel]="selectedSector()" (ngModelChange)="selectedSector.set($event)"
                    class="rounded-lg border border-input bg-card px-3 py-1.5 text-sm outline-none">
              <option value="">All Sectors</option>
              @for (sector of data.calendarSectors; track sector) {
                <option [value]="sector">{{ sector }}</option>
              }
            </select>
          </div>

          <div class="flex rounded-lg border border-border bg-card p-1">
            <button (click)="view.set('month')"
                    class="rounded-md px-4 py-1.5 text-sm font-medium transition-colors hover:bg-secondary"
                    [class.bg-secondary]="view() === 'month'">Month</button>
            <button (click)="view.set('week')"
                    class="rounded-md px-4 py-1.5 text-sm font-medium transition-colors hover:bg-secondary"
                    [class.bg-secondary]="view() === 'week'">Week</button>
          </div>
        </div>

        <div class="grid gap-6 lg:grid-cols-3">
          <!-- Calendar Grid -->
          <div class="lg:col-span-2">
            <div class="rounded-xl border border-border bg-card">
              <div class="flex items-center justify-between border-b border-border p-6">
                <div class="flex items-center gap-2">
                  <lucide-icon [img]="CalendarIcon" [size]="20" class="text-accent"></lucide-icon>
                  <h3 class="text-lg font-semibold">{{ monthName() }} {{ year() }}</h3>
                </div>
                <div class="flex items-center gap-1">
                  <button (click)="prevMonth()" class="rounded-md p-2 transition-colors hover:bg-secondary" aria-label="Previous month">
                    <lucide-icon [img]="ChevronLeft" [size]="16"></lucide-icon>
                  </button>
                  <button (click)="nextMonth()" class="rounded-md p-2 transition-colors hover:bg-secondary" aria-label="Next month">
                    <lucide-icon [img]="ChevronRight" [size]="16"></lucide-icon>
                  </button>
                </div>
              </div>
              <div class="p-6">
                <div class="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-border bg-border">
                  @for (day of dayNames; track day) {
                    <div class="bg-secondary p-2 text-center text-sm font-medium text-muted-foreground">{{ day }}</div>
                  }
                  @for (i of emptyDays(); track $index) {
                    <div class="min-h-24 bg-card p-2"></div>
                  }
                  @for (day of daysArray(); track day) {
                    <div class="min-h-24 bg-card p-2 transition-colors hover:bg-secondary/50"
                         [class.bg-accent/5]="isToday(day)">
                      <span class="inline-flex h-6 w-6 items-center justify-center rounded-full text-sm"
                            [class.bg-accent]="isToday(day)" [class.text-accent-foreground]="isToday(day)">
                        {{ day }}
                      </span>
                      <div class="mt-1 space-y-1">
                        @for (event of getEventsForDate(day).slice(0, 2); track event.id) {
                          <div class="truncate rounded px-1.5 py-0.5 text-xs" [class]="getTypeClass(event.type)">
                            {{ event.title }}
                          </div>
                        }
                        @if (getEventsForDate(day).length > 2) {
                          <div class="px-1.5 text-xs text-muted-foreground">+{{ getEventsForDate(day).length - 2 }} more</div>
                        }
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>

          <!-- Upcoming Events -->
          <div>
            <div class="rounded-xl border border-border bg-card">
              <div class="border-b border-border p-6">
                <h3 class="text-lg font-semibold">Upcoming Events</h3>
              </div>
              <div class="space-y-3 p-6">
                @for (event of upcomingEvents(); track event.id) {
                  <div class="rounded-lg border border-border p-3 transition-colors hover:bg-secondary/50">
                    <div class="mb-2 flex items-start justify-between gap-2">
                      <span class="rounded-md px-2 py-0.5 text-xs font-medium" [class]="getTypeClass(event.type)">
                        {{ getTypeLabel(event.type) }}
                      </span>
                      <span class="rounded-full border px-2.5 py-0.5 text-xs font-medium" [class]="getRelevanceClass(event.relevance)">
                        {{ event.relevance }}
                      </span>
                    </div>
                    <h4 class="font-medium">{{ event.title }}</h4>
                    <div class="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span class="flex items-center gap-1">
                        <lucide-icon [img]="CalendarIcon" [size]="12"></lucide-icon>
                        {{ formatDate(event.date) }}
                      </span>
                      <span class="flex items-center gap-1">
                        <lucide-icon [img]="Clock" [size]="12"></lucide-icon>
                        {{ event.time }}
                      </span>
                      @if (event.company) {
                        <span class="flex items-center gap-1">
                          <lucide-icon [img]="Building2" [size]="12"></lucide-icon>
                          {{ event.company }}
                        </span>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
})
export class CalendarComponent {
  readonly data = inject(MockDataService);
  readonly view = signal<'month' | 'week'>('month');
  readonly selectedCompany = signal('');
  readonly selectedSector = signal('');
  readonly currentDate = signal(new Date(2026, 1, 1));

  readonly Filter = Filter;
  readonly CalendarIcon = CalendarIcon;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  readonly Clock = Clock;
  readonly Building2 = Building2;

  readonly dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  readonly daysInMonth = computed(() => new Date(this.currentDate().getFullYear(), this.currentDate().getMonth() + 1, 0).getDate());
  readonly firstDayOfMonth = computed(() => new Date(this.currentDate().getFullYear(), this.currentDate().getMonth(), 1).getDay());
  readonly monthName = computed(() => this.currentDate().toLocaleString('default', { month: 'long' }));
  readonly year = computed(() => this.currentDate().getFullYear());
  readonly daysArray = computed(() => Array.from({ length: this.daysInMonth() }, (_, i) => i + 1));
  readonly emptyDays = computed(() => Array.from({ length: this.firstDayOfMonth() }));

  readonly filteredEvents = computed(() => {
    const company = this.selectedCompany();
    const sector = this.selectedSector();
    return this.data.calendarEvents.filter(event => {
      if (company && event.company !== company) return false;
      if (sector && event.sector !== sector) return false;
      return true;
    });
  });

  readonly upcomingEvents = computed(() =>
    [...this.filteredEvents()]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 6)
  );

  prevMonth(): void {
    const d = this.currentDate();
    this.currentDate.set(new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  nextMonth(): void {
    const d = this.currentDate();
    this.currentDate.set(new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  getEventsForDate(day: number): CalendarEvent[] {
    const d = this.currentDate();
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return this.filteredEvents().filter(e => e.date === dateStr);
  }

  isToday(day: number): boolean {
    return day === 4 && this.currentDate().getMonth() === 1;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  getTypeClass(type: EventType): string {
    const map: Record<EventType, string> = {
      earnings: 'bg-accent/20 text-accent',
      economic: 'bg-chart-3/20 text-chart-3',
      dividend: 'bg-chart-4/20 text-chart-4',
      conference: 'bg-chart-5/20 text-chart-5',
    };
    return map[type];
  }

  getTypeLabel(type: EventType): string {
    const map: Record<EventType, string> = { earnings: 'Earnings', economic: 'Economic', dividend: 'Dividend', conference: 'Conference' };
    return map[type];
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

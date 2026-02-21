import { Component, ChangeDetectionStrategy, signal, computed, inject, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { MockDataService } from '../../services/mock-data.service';
import { CalendarApiService } from '../../services/calendar-api.service';
import { LucideAngularModule, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Building2, X, ArrowRight, GripHorizontal } from 'lucide-angular';
import { CalendarEvent, EventType, Relevance } from '../../models';

interface PinnedPopup {
  event: CalendarEvent;
  x: number;
  y: number;
  id: string;
  zIndex: number;
}

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

        <!-- Legend + Filters -->
        <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span class="flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-full bg-accent"></span>Earnings</span>
            <span class="flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-full bg-chart-3"></span>Economic</span>
            <span class="flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-full bg-chart-4"></span>Dividend</span>
            <span class="flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-full bg-chart-5"></span>Conference</span>
          </div>
          <div class="flex items-center gap-3">
            <select [ngModel]="selectedType()" (ngModelChange)="selectedType.set($event)"
                    class="cursor-pointer rounded-lg border border-input bg-card px-3 py-1.5 text-sm outline-none">
              <option value="">All Types</option>
              <option value="earnings">Earnings</option>
              <option value="economic">Economic</option>
              <option value="dividend">Dividend</option>
              <option value="conference">Conference</option>
            </select>
            <select [ngModel]="selectedSector()" (ngModelChange)="selectedSector.set($event)"
                    class="cursor-pointer rounded-lg border border-input bg-card px-3 py-1.5 text-sm outline-none">
              <option value="">All Sectors</option>
              @for (sector of calendarSectors(); track sector) {
                <option [value]="sector">{{ sector }}</option>
              }
            </select>
            <div class="flex rounded-lg border border-border bg-card p-1">
              <button (click)="view.set('month')"
                      class="cursor-pointer rounded-md px-4 py-1.5 text-sm font-medium transition-colors"
                      [class.bg-secondary]="view() === 'month'">Month</button>
              <button (click)="view.set('week')"
                      class="cursor-pointer rounded-md px-4 py-1.5 text-sm font-medium transition-colors"
                      [class.bg-secondary]="view() === 'week'">Week</button>
            </div>
          </div>
        </div>

        <div class="grid gap-6 lg:grid-cols-3">
          <!-- Calendar -->
          <div class="lg:col-span-2">
            <div class="rounded-xl border border-border bg-card">
              <div class="flex items-center justify-between border-b border-border px-5 py-4">
                <div class="flex items-center gap-2">
                  <lucide-icon [img]="CalendarIcon" [size]="18" class="text-accent"></lucide-icon>
                  @if (view() === 'week') {
                    <button (click)="view.set('month')"
                            class="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {{ monthName() }} {{ year() }}
                    </button>
                    <lucide-icon [img]="ChevronRight" [size]="14" class="text-muted-foreground"></lucide-icon>
                  }
                  <h3 class="text-base font-semibold">{{ headerLabel() }}</h3>
                </div>
                <div class="flex items-center gap-1">
                  <button (click)="prevPeriod()" class="cursor-pointer rounded-md p-2 transition-colors hover:bg-secondary">
                    <lucide-icon [img]="ChevronLeft" [size]="16"></lucide-icon>
                  </button>
                  <button (click)="goToToday()"
                          class="cursor-pointer rounded-md border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-secondary">
                    Today
                  </button>
                  <button (click)="nextPeriod()" class="cursor-pointer rounded-md p-2 transition-colors hover:bg-secondary">
                    <lucide-icon [img]="ChevronRight" [size]="16"></lucide-icon>
                  </button>
                </div>
              </div>

              <!-- Month View -->
              @if (view() === 'month') {
                <div class="p-4">
                  <div class="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-border bg-border">
                    @for (day of dayNames; track day) {
                      <div class="bg-secondary px-2 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {{ day }}
                      </div>
                    }
                    @for (i of emptyDays(); track $index) {
                      <div class="min-h-28 bg-card/40 p-2"></div>
                    }
                    @for (day of daysArray(); track day) {
                      <div class="group min-h-28 cursor-pointer bg-card p-2 transition-colors hover:bg-secondary/40"
                           [class.outline]="isToday(day)" [class.outline-accent]="isToday(day)" [class.outline-1]="isToday(day)"
                           (click)="selectDay(day)">
                        <span class="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium"
                              [class.bg-accent]="isToday(day)" [class.text-white]="isToday(day)"
                              [class.text-muted-foreground]="isPastDay(day) && !isToday(day)">{{ day }}</span>
                        <div class="mt-1 space-y-0.5">
                          @for (event of getEventsForDate(day).slice(0, 3); track event.id) {
                            <div class="flex cursor-pointer items-center gap-1 truncate rounded px-1.5 py-0.5 text-xs transition-opacity hover:opacity-80"
                                 [class]="getTypeClass(event.type)"
                                 [class.ring-1]="isPinned(event.id)" [class.ring-current]="isPinned(event.id)"
                                 (click)="onEventClick($event, event)">
                              <span class="h-1.5 w-1.5 shrink-0 rounded-full" [class]="getTypeDotClass(event.type)"></span>
                              <span class="truncate">{{ event.title }}</span>
                            </div>
                          }
                          @if (getEventsForDate(day).length > 3) {
                            <div class="px-1.5 text-xs text-muted-foreground">+{{ getEventsForDate(day).length - 3 }} more</div>
                          }
                        </div>
                      </div>
                    }
                  </div>
                </div>
              }

              <!-- Week View -->
              @if (view() === 'week') {
                <div class="p-4">
                  <div class="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-border bg-border">
                    @for (date of currentWeekDays(); track date.toISOString()) {
                      <div class="bg-secondary px-2 py-3 text-center" [class.bg-accent/10]="isDateToday(date)">
                        <div class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{{ getShortDayName(date) }}</div>
                        <div class="mx-auto mt-1.5 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
                             [class.bg-accent]="isDateToday(date)" [class.text-white]="isDateToday(date)">
                          {{ date.getDate() }}
                        </div>
                      </div>
                    }
                    @for (date of currentWeekDays(); track date.toISOString()) {
                      <div class="min-h-52 bg-card p-1.5 space-y-1" [class.bg-accent/5]="isDateToday(date)">
                        @for (event of getEventsForFullDate(date); track event.id) {
                          <div class="cursor-pointer rounded px-1.5 py-1 text-xs transition-opacity hover:opacity-80"
                               [class]="getTypeClass(event.type)"
                               [class.ring-1]="isPinned(event.id)" [class.ring-current]="isPinned(event.id)"
                               (click)="onEventClick($event, event)">
                            <div class="flex items-start gap-1">
                              <span class="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full" [class]="getTypeDotClass(event.type)"></span>
                              <div class="min-w-0">
                                <div class="font-medium leading-tight line-clamp-2">{{ event.title }}</div>
                                <div class="mt-0.5 opacity-60">{{ event.time }}</div>
                              </div>
                            </div>
                          </div>
                        }
                        @if (getEventsForFullDate(date).length === 0) {
                          <div class="flex min-h-12 items-center justify-center text-xs text-border">—</div>
                        }
                      </div>
                    }
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Upcoming Events sidebar -->
          <div class="sticky top-4 flex max-h-[calc(100vh-6rem)] flex-col rounded-xl border border-border bg-card">
            <div class="shrink-0 border-b border-border p-5">
              <h3 class="font-semibold">Upcoming Events</h3>
              <p class="mt-0.5 text-xs text-muted-foreground">From today onward</p>
            </div>
            <div class="flex-1 overflow-y-auto scrollbar-thin divide-y divide-border">
              @for (event of upcomingEvents(); track event.id) {
                <div [id]="'upcoming-' + event.id"
                     class="p-4 transition-colors duration-300 hover:bg-secondary/50"
                     [class.bg-accent/10]="highlightedEventId() === event.id">
                  <div class="mb-2 flex items-center justify-between gap-2">
                    <span class="rounded px-2 py-0.5 text-xs font-medium" [class]="getTypeClass(event.type)">{{ getTypeLabel(event.type) }}</span>
                    <span class="rounded-full border px-2 py-0.5 text-xs font-medium" [class]="getRelevanceClass(event.relevance)">{{ event.relevance }}</span>
                  </div>
                  <p class="text-sm font-medium leading-snug">{{ event.title }}</p>
                  <div class="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span class="flex items-center gap-1"><lucide-icon [img]="CalendarIcon" [size]="11"></lucide-icon>{{ formatDate(event.date) }}</span>
                    <span class="flex items-center gap-1"><lucide-icon [img]="Clock" [size]="11"></lucide-icon>{{ event.time }}</span>
                    @if (event.company) {
                      <span class="flex items-center gap-1"><lucide-icon [img]="Building2" [size]="11"></lucide-icon>{{ event.company }}</span>
                    }
                  </div>
                </div>
              }
              @if (upcomingEvents().length === 0) {
                <div class="p-8 text-center text-sm text-muted-foreground">No upcoming events</div>
              }
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Pinned popups (multiple, draggable) -->
    @for (popup of pinnedPopups(); track popup.id) {
      <div class="fixed w-64 select-none rounded-xl border border-border bg-card shadow-xl"
           [style.left.px]="popup.x"
           [style.top.px]="popup.y"
           [style.zIndex]="popup.zIndex"
           (mousedown)="bringToFront(popup.id)">
        <!-- Drag handle -->
        <div class="flex cursor-move items-center justify-between rounded-t-xl px-4 py-2.5"
             [class]="getTypeClass(popup.event.type)"
             (mousedown)="startDrag($event, popup.id)">
          <div class="flex items-center gap-2">
            <lucide-icon [img]="GripHorizontal" [size]="14" class="opacity-60"></lucide-icon>
            <span class="text-xs font-semibold uppercase tracking-wide">{{ getTypeLabel(popup.event.type) }}</span>
          </div>
          <button (click)="unpinPopup(popup.id); $event.stopPropagation()"
                  class="cursor-pointer rounded p-0.5 transition-opacity hover:opacity-70">
            <lucide-icon [img]="X" [size]="14"></lucide-icon>
          </button>
        </div>
        <!-- Body -->
        <div class="p-4">
          <p class="font-semibold leading-snug">{{ popup.event.title }}</p>
          <div class="mt-3 space-y-1.5 text-xs text-muted-foreground">
            <div class="flex items-center gap-2"><lucide-icon [img]="CalendarIcon" [size]="12"></lucide-icon>{{ formatDate(popup.event.date) }}</div>
            <div class="flex items-center gap-2"><lucide-icon [img]="Clock" [size]="12"></lucide-icon>{{ popup.event.time }}</div>
            @if (popup.event.company) {
              <div class="flex items-center gap-2"><lucide-icon [img]="Building2" [size]="12"></lucide-icon>{{ popup.event.company }}</div>
            }
            <div class="pt-1">
              <span class="rounded-full border px-2 py-0.5 text-xs font-medium" [class]="getRelevanceClass(popup.event.relevance)">
                {{ popup.event.relevance }} relevance
              </span>
            </div>
          </div>
          @if (isInUpcoming(popup.event)) {
            <button (click)="scrollToEvent(popup.event.id)"
                    class="mt-3 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium transition-colors hover:bg-secondary">
              See in upcoming events
              <lucide-icon [img]="ArrowRight" [size]="12"></lucide-icon>
            </button>
          }
        </div>
      </div>
    }
  `,
})
export class CalendarComponent {
  private readonly calendarApi = inject(CalendarApiService);
  readonly data = inject(MockDataService);
  readonly view = signal<'month' | 'week'>('month');
  readonly selectedType = signal('');
  readonly selectedSector = signal('');
  readonly currentDate = signal(new Date());
  readonly allEvents = signal<CalendarEvent[]>([]);

  readonly pinnedPopups = signal<PinnedPopup[]>([]);
  readonly highlightedEventId = signal<string | null>(null);

  private zTop = 51;

  readonly CalendarIcon = CalendarIcon;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  readonly Clock = Clock;
  readonly Building2 = Building2;
  readonly X = X;
  readonly ArrowRight = ArrowRight;
  readonly GripHorizontal = GripHorizontal;

  readonly calendarSectors = computed(() =>
    [...new Set(this.allEvents().map(e => e.sector).filter(Boolean))].sort()
  );

  readonly dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  constructor() {
    effect(() => {
      const d = this.currentDate();
      const from = new Date(d.getFullYear(), d.getMonth() - 1, 1);
      const to = new Date(d.getFullYear(), d.getMonth() + 2, 0);
      const fmt = (dt: Date) => dt.toISOString().slice(0, 10);
      this.calendarApi.getByDateRange(fmt(from), fmt(to)).subscribe({
        next: (events) => this.allEvents.set(events.length ? events : this.data.calendarEvents),
        error: () => this.allEvents.set(this.data.calendarEvents),
      });
    });
  }

  readonly daysInMonth = computed(() =>
    new Date(this.currentDate().getFullYear(), this.currentDate().getMonth() + 1, 0).getDate()
  );
  readonly firstDayOfMonth = computed(() => {
    const dow = new Date(this.currentDate().getFullYear(), this.currentDate().getMonth(), 1).getDay();
    return (dow + 6) % 7;
  });
  readonly monthName = computed(() => this.currentDate().toLocaleString('en-US', { month: 'long' }));
  readonly year = computed(() => this.currentDate().getFullYear());
  readonly daysArray = computed(() => Array.from({ length: this.daysInMonth() }, (_, i) => i + 1));
  readonly emptyDays = computed(() => Array.from({ length: this.firstDayOfMonth() }));

  readonly currentWeekDays = computed(() => {
    const d = new Date(this.currentDate());
    const dow = d.getDay();
    const mondayOffset = dow === 0 ? -6 : 1 - dow;
    const monday = new Date(d);
    monday.setDate(d.getDate() + mondayOffset);
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return date;
    });
  });

  readonly weekRangeLabel = computed(() => {
    const days = this.currentWeekDays();
    const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${fmt(days[0])} – ${fmt(days[6])}, ${days[6].getFullYear()}`;
  });

  readonly headerLabel = computed(() =>
    this.view() === 'week' ? this.weekRangeLabel() : `${this.monthName()} ${this.year()}`
  );

  readonly filteredEvents = computed(() => {
    const type = this.selectedType();
    const sector = this.selectedSector();
    return this.allEvents().filter(e => {
      if (type && e.type !== type) return false;
      if (sector && e.sector !== sector) return false;
      return true;
    });
  });

  readonly upcomingEvents = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return [...this.filteredEvents()]
      .filter(e => new Date(e.date + 'T00:00:00') >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 10);
  });

  // --- Navigation ---

  prevPeriod(): void {
    const d = this.currentDate();
    if (this.view() === 'week') {
      const n = new Date(d); n.setDate(d.getDate() - 7); this.currentDate.set(n);
    } else {
      this.currentDate.set(new Date(d.getFullYear(), d.getMonth() - 1, 1));
    }
  }

  nextPeriod(): void {
    const d = this.currentDate();
    if (this.view() === 'week') {
      const n = new Date(d); n.setDate(d.getDate() + 7); this.currentDate.set(n);
    } else {
      this.currentDate.set(new Date(d.getFullYear(), d.getMonth() + 1, 1));
    }
  }

  goToToday(): void { this.currentDate.set(new Date()); }

  selectDay(day: number): void {
    const d = this.currentDate();
    this.currentDate.set(new Date(d.getFullYear(), d.getMonth(), day));
    this.view.set('week');
  }

  // --- Pinned popups ---

  onEventClick(e: MouseEvent, event: CalendarEvent): void {
    e.stopPropagation();
    if (this.isPinned(event.id)) {
      this.unpinPopup(event.id);
    } else {
      const W = 256, H = 220;
      let x = e.clientX + 14;
      let y = e.clientY - 8;
      if (x + W > window.innerWidth - 8) x = e.clientX - W - 8;
      if (y + H > window.innerHeight - 8) y = Math.max(8, e.clientY - H);
      this.pinnedPopups.update(ps => [...ps, { event, x, y, id: event.id, zIndex: ++this.zTop }]);
    }
  }

  isPinned(eventId: string): boolean {
    return this.pinnedPopups().some(p => p.id === eventId);
  }

  unpinPopup(eventId: string): void {
    this.pinnedPopups.update(ps => ps.filter(p => p.id !== eventId));
  }

  bringToFront(popupId: string): void {
    this.pinnedPopups.update(ps =>
      ps.map(p => p.id === popupId ? { ...p, zIndex: ++this.zTop } : p)
    );
  }

  startDrag(e: MouseEvent, popupId: string): void {
    e.preventDefault();
    e.stopPropagation();

    const popup = this.pinnedPopups().find(p => p.id === popupId);
    if (!popup) return;

    const startX = e.clientX, startY = e.clientY;
    const origX = popup.x, origY = popup.y;

    const onMove = (ev: MouseEvent) => {
      this.pinnedPopups.update(ps =>
        ps.map(p => p.id === popupId
          ? { ...p, x: origX + ev.clientX - startX, y: origY + ev.clientY - startY }
          : p
        )
      );
    };

    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  // --- Sidebar ---

  isInUpcoming(event: CalendarEvent): boolean {
    return this.upcomingEvents().some(e => e.id === event.id);
  }

  scrollToEvent(id: string): void {
    this.highlightedEventId.set(id);
    document.getElementById('upcoming-' + id)
      ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    setTimeout(() => this.highlightedEventId.set(null), 1500);
  }

  // --- Calendar helpers ---

  getEventsForDate(day: number): CalendarEvent[] {
    const d = this.currentDate();
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return this.filteredEvents().filter(e => e.date === dateStr);
  }

  getEventsForFullDate(date: Date): CalendarEvent[] {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return this.filteredEvents().filter(e => e.date === dateStr);
  }

  isToday(day: number): boolean {
    const t = new Date(), d = this.currentDate();
    return day === t.getDate() && d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear();
  }

  isPastDay(day: number): boolean {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const d = this.currentDate();
    return new Date(d.getFullYear(), d.getMonth(), day) < today;
  }

  isDateToday(date: Date): boolean {
    const t = new Date();
    return date.getDate() === t.getDate() && date.getMonth() === t.getMonth() && date.getFullYear() === t.getFullYear();
  }

  getShortDayName(date: Date): string {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }

  formatDate(date: string): string {
    return new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  getTypeClass(type: EventType): string {
    return ({ earnings: 'bg-accent/15 text-accent', economic: 'bg-chart-3/15 text-chart-3', dividend: 'bg-chart-4/15 text-chart-4', conference: 'bg-chart-5/15 text-chart-5' })[type];
  }

  getTypeDotClass(type: EventType): string {
    return ({ earnings: 'bg-accent', economic: 'bg-chart-3', dividend: 'bg-chart-4', conference: 'bg-chart-5' })[type];
  }

  getTypeLabel(type: EventType): string {
    return ({ earnings: 'Earnings', economic: 'Economic', dividend: 'Dividend', conference: 'Conference' })[type];
  }

  getRelevanceClass(relevance: Relevance): string {
    return ({ high: 'bg-destructive/10 text-destructive border-destructive/30', medium: 'bg-warning/10 text-warning border-warning/30', low: 'bg-muted text-muted-foreground border-border' })[relevance];
  }
}

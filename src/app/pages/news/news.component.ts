import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { NewsCardComponent } from '../../components/news-card/news-card.component';
import { MockDataService } from '../../services/mock-data.service';
import { LucideAngularModule, Search, Filter, X } from 'lucide-angular';

@Component({
  selector: 'app-news',
  imports: [FormsModule, HeaderComponent, NewsCardComponent, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-background">
      <app-header />

      <main class="container mx-auto px-4 py-8">
        <div class="mb-6 space-y-4">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex rounded-lg border border-border bg-card p-1">
              <button (click)="feedMode.set('all')"
                      class="rounded-md px-4 py-1.5 text-sm font-medium transition-colors hover:bg-secondary"
                      [class.bg-secondary]="feedMode() === 'all'">
                All News
              </button>
              <button (click)="feedMode.set('subscriptions')"
                      class="rounded-md px-4 py-1.5 text-sm font-medium transition-colors hover:bg-secondary"
                      [class.bg-secondary]="feedMode() === 'subscriptions'">
                My Subscriptions
              </button>
            </div>

            <div class="relative max-w-sm flex-1">
              <lucide-icon [img]="Search" [size]="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"></lucide-icon>
              <input type="text" placeholder="Search news..."
                     [ngModel]="searchQuery()"
                     (ngModelChange)="searchQuery.set($event)"
                     class="w-full rounded-lg border border-input bg-card py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <div class="flex items-center gap-2 text-sm text-muted-foreground">
              <lucide-icon [img]="Filter" [size]="16"></lucide-icon>
              <span>Filters:</span>
            </div>

            <select [ngModel]="selectedCompany()" (ngModelChange)="onCompanyChange($event)"
                    class="rounded-lg border border-input bg-card px-3 py-1.5 text-sm outline-none">
              <option value="">Company</option>
              @for (company of data.filterCompanies; track company) {
                <option [value]="company">{{ company }}</option>
              }
            </select>

            <select [ngModel]="selectedSector()" (ngModelChange)="onSectorChange($event)"
                    class="rounded-lg border border-input bg-card px-3 py-1.5 text-sm outline-none">
              <option value="">Sector</option>
              @for (sector of data.filterSectors; track sector) {
                <option [value]="sector">{{ sector }}</option>
              }
            </select>

            <select [ngModel]="selectedImpact()" (ngModelChange)="onImpactChange($event)"
                    class="rounded-lg border border-input bg-card px-3 py-1.5 text-sm outline-none">
              <option value="">Impact</option>
              <option value="growth">Growth</option>
              <option value="decline">Decline</option>
              <option value="stagnation">Stagnation</option>
            </select>
          </div>

          @if (activeFilters().length > 0) {
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-sm text-muted-foreground">Active:</span>
              @for (filter of activeFilters(); track filter) {
                <span class="inline-flex cursor-pointer items-center gap-1 rounded-md bg-secondary px-2 py-1 pr-1 text-xs font-medium"
                      (click)="removeFilter(filter)">
                  {{ filter }}
                  <lucide-icon [img]="X" [size]="12"></lucide-icon>
                </span>
              }
              <button (click)="clearAllFilters()"
                      class="text-xs text-muted-foreground hover:text-foreground">
                Clear all
              </button>
            </div>
          }
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          @for (news of data.allNews; track news.id) {
            <app-news-card [news]="news" />
          }
        </div>
      </main>
    </div>
  `,
})
export class NewsComponent {
  readonly data = inject(MockDataService);
  readonly feedMode = signal<'all' | 'subscriptions'>('all');
  readonly searchQuery = signal('');
  readonly selectedCompany = signal('');
  readonly selectedSector = signal('');
  readonly selectedImpact = signal('');
  readonly activeFilters = signal<string[]>([]);

  readonly Search = Search;
  readonly Filter = Filter;
  readonly X = X;

  onCompanyChange(value: string): void {
    this.selectedCompany.set(value);
    if (value) this.addFilter(value);
  }

  onSectorChange(value: string): void {
    this.selectedSector.set(value);
    if (value) this.addFilter(value);
  }

  onImpactChange(value: string): void {
    this.selectedImpact.set(value);
    if (value) this.addFilter(value);
  }

  addFilter(filter: string): void {
    const current = this.activeFilters();
    if (!current.includes(filter)) {
      this.activeFilters.set([...current, filter]);
    }
  }

  removeFilter(filter: string): void {
    this.activeFilters.set(this.activeFilters().filter(f => f !== filter));
    if (this.data.filterCompanies.includes(filter)) this.selectedCompany.set('');
    if (this.data.filterSectors.includes(filter)) this.selectedSector.set('');
    if (['growth', 'decline', 'stagnation'].includes(filter)) this.selectedImpact.set('');
  }

  clearAllFilters(): void {
    this.activeFilters.set([]);
    this.selectedCompany.set('');
    this.selectedSector.set('');
    this.selectedImpact.set('');
    this.searchQuery.set('');
  }
}

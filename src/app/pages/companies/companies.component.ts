import { Component, ChangeDetectionStrategy, signal, inject, OnInit, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { CompanyApiService } from '../../services/company-api.service';
import { Company } from '../../models';
import { LucideAngularModule, Search, Building2, ExternalLink } from 'lucide-angular';

@Component({
  selector: 'app-companies',
  imports: [RouterLink, FormsModule, HeaderComponent, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-background">
      <app-header />

      <main class="container mx-auto px-4 py-8">
        <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 class="text-2xl font-bold">Companies</h1>
          <div class="relative max-w-xs flex-1">
            <lucide-icon [img]="Search" [size]="16"
                         class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"></lucide-icon>
            <input type="text" placeholder="Search by name or ticker…"
                   [ngModel]="searchQuery()"
                   (ngModelChange)="searchQuery.set($event)"
                   class="w-full rounded-lg border border-input bg-card py-2 pl-11 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>

        @if (loading() || !logosReady()) {
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            @for (i of skeletons; track i) {
              <div class="animate-pulse rounded-xl border border-border bg-card p-5">
                <div class="mb-4 flex items-start gap-3">
                  <div class="h-10 w-10 flex-shrink-0 rounded-lg bg-secondary"></div>
                  <div class="flex-1 space-y-2">
                    <div class="h-3.5 w-16 rounded bg-secondary"></div>
                    <div class="h-5 w-36 rounded bg-secondary"></div>
                  </div>
                  <div class="h-3.5 w-12 rounded bg-secondary"></div>
                </div>
                <div class="flex gap-1.5">
                  <div class="h-5 w-14 rounded bg-secondary"></div>
                  <div class="h-5 w-20 rounded bg-secondary"></div>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            @for (company of filteredCompanies(); track company.ticker) {
              <a [routerLink]="['/companies', company.ticker]"
                 class="group rounded-xl border border-border bg-card p-4 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5">
                <div class="mb-3 flex items-start gap-3">
                  <!-- Logo / initials -->
                  @if (company.logoUrl && !logoErrors().has(company.ticker)) {
                    <img [src]="company.logoUrl" [alt]="company.name"
                         (error)="onLogoError(company.ticker)"
                         class="h-10 w-10 flex-shrink-0 rounded-lg bg-white object-contain p-0.5" />
                  } @else {
                    <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent/20 text-sm font-bold text-accent">
                      {{ company.ticker.slice(0, 2) }}
                    </div>
                  }

                  <!-- Name + ticker -->
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-1.5">
                      <span class="font-mono text-sm font-bold text-accent">{{ company.ticker }}</span>
                      @if (company.exchange) {
                        <span class="rounded border border-border px-1 py-0.5 text-[10px] text-muted-foreground">
                          {{ company.exchange }}
                        </span>
                      }
                    </div>
                    <p class="line-clamp-1 text-sm font-medium text-foreground transition-colors group-hover:text-accent">
                      {{ company.name }}
                    </p>
                  </div>

                  <!-- Market cap -->
                  @if (company.marketCap) {
                    <span class="flex-shrink-0 text-xs text-muted-foreground">
                      {{ formatMarketCap(company.marketCap) }}
                    </span>
                  }
                </div>

                <!-- Sectors + country -->
                <div class="flex flex-wrap items-center gap-1.5">
                  @for (sector of company.sectors.slice(0, 3); track sector) {
                    <span class="rounded-md border border-border bg-secondary/50 px-1.5 py-0.5 text-xs text-muted-foreground">
                      {{ sector }}
                    </span>
                  }
                  @if (company.sectors.length > 3) {
                    <span class="text-xs text-muted-foreground">+{{ company.sectors.length - 3 }}</span>
                  }
                  @if (company.country) {
                    <span class="ml-auto text-xs font-medium text-muted-foreground">{{ company.country }}</span>
                  }
                </div>
              </a>
            }

            @empty {
              <p class="col-span-3 py-16 text-center text-muted-foreground">
                No companies match "{{ searchQuery() }}"
              </p>
            }
          </div>
        }
      </main>
    </div>
  `,
})
export class CompaniesComponent implements OnInit {
  private readonly companyApi = inject(CompanyApiService);

  readonly Search = Search;
  readonly Building2 = Building2;
  readonly ExternalLink = ExternalLink;

  readonly skeletons = [1, 2, 3, 4, 5, 6];
  readonly loading = signal(true);
  readonly logosReady = signal(false);
  readonly companies = signal<Company[]>([]);
  readonly searchQuery = signal('');
  readonly logoErrors = signal<Set<string>>(new Set());

  readonly filteredCompanies = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.companies();
    return this.companies().filter(c =>
      c.ticker.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
    );
  });

  ngOnInit(): void {
    this.companyApi.getAll().subscribe({
      next: (list) => {
        this.companies.set(list);
        this.loading.set(false);
        this.preloadLogos(list);
      },
      error: () => {
        this.loading.set(false);
        this.logosReady.set(true);
      },
    });
  }

  private preloadLogos(companies: Company[]): void {
    const withLogos = companies.filter(c => c.logoUrl);
    if (!withLogos.length) {
      this.logosReady.set(true);
      return;
    }

    let settled = 0;
    const onSettle = (ticker?: string, failed?: boolean) => {
      if (ticker && failed) {
        this.logoErrors.update(s => new Set([...s, ticker]));
      }
      if (++settled === withLogos.length) {
        this.logosReady.set(true);
      }
    };

    for (const company of withLogos) {
      const img = new Image();
      img.onload = () => onSettle();
      img.onerror = () => onSettle(company.ticker, true);
      img.src = company.logoUrl!;
    }
  }

  onLogoError(ticker: string): void {
    this.logoErrors.update(s => new Set([...s, ticker]));
  }

  formatMarketCap(mc: number): string {
    if (mc >= 1_000_000) return `$${(mc / 1_000_000).toFixed(2)}T`;
    if (mc >= 1_000) return `$${(mc / 1_000).toFixed(1)}B`;
    return `$${mc.toFixed(0)}M`;
  }
}

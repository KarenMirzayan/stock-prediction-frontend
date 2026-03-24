import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { NewsCardComponent } from '../../components/news-card/news-card.component';
import { CompanyApiService } from '../../services/company-api.service';
import { NewsApiService } from '../../services/news-api.service';
import { AdminApiService } from '../../services/admin-api.service';
import { AuthService } from '../../services/auth.service';
import { CompanyDetail, NewsItem } from '../../models';
import { LucideAngularModule, ArrowLeft, ExternalLink, Globe, TrendingUp, Calendar, BarChart2, Bell, BellOff, Pencil, Trash2, Check, X } from 'lucide-angular';

@Component({
  selector: 'app-company-detail',
  imports: [RouterLink, FormsModule, HeaderComponent, NewsCardComponent, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-background">
      <app-header />

      <main class="container mx-auto px-4 py-8">
        <div class="mb-6">
          <a routerLink="/companies"
             class="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-secondary">
            <lucide-icon [img]="ArrowLeft" [size]="16"></lucide-icon>
            Back to Companies
          </a>
        </div>

        @if (loading() || !logoReady()) {
          <div class="mx-auto max-w-4xl animate-pulse space-y-6">
            <div class="rounded-xl border border-border bg-card p-6">
              <div class="flex items-center gap-4">
                <div class="h-16 w-16 rounded-xl bg-secondary"></div>
                <div class="space-y-2">
                  <div class="h-4 w-20 rounded bg-secondary"></div>
                  <div class="h-7 w-48 rounded bg-secondary"></div>
                  <div class="h-4 w-24 rounded bg-secondary"></div>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
              @for (i of [1,2,3,4]; track i) {
                <div class="h-20 rounded-xl border border-border bg-card"></div>
              }
            </div>
            <div class="h-32 rounded-xl border border-border bg-card"></div>
          </div>

        } @else if (company()) {
          <div class="mx-auto max-w-4xl space-y-6">

            <!-- Header card -->
            <div class="rounded-xl border border-border bg-card p-6">
              <div class="flex flex-wrap items-start gap-5">
                <!-- Logo / initials -->
                @if (company()!.logoUrl && !logoError()) {
                  <img [src]="company()!.logoUrl" [alt]="company()!.name"
                       (error)="logoError.set(true)"
                       class="h-16 w-16 flex-shrink-0 rounded-xl bg-white object-contain p-1 shadow-sm" />
                } @else {
                  <div class="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-accent/20 text-xl font-bold text-accent">
                    {{ company()!.ticker.slice(0, 2) }}
                  </div>
                }

                <div class="flex-1">
                  <div class="mb-1 flex flex-wrap items-center gap-2">
                    <span class="font-mono text-base font-bold text-accent">{{ company()!.ticker }}</span>
                    @if (company()!.exchange) {
                      <span class="rounded border border-border px-1.5 py-0.5 text-xs text-muted-foreground">
                        {{ company()!.exchange }}
                      </span>
                    }
                    @if (company()!.country) {
                      <span class="inline-flex items-center gap-1 rounded border border-border px-1.5 py-0.5 text-xs text-muted-foreground">
                        <lucide-icon [img]="Globe" [size]="10"></lucide-icon>
                        {{ company()!.countryName ?? company()!.country }}
                      </span>
                    }
                  </div>
                  <h1 class="text-2xl font-bold md:text-3xl">{{ company()!.name }}</h1>
                  @if (company()!.websiteUrl) {
                    <a [href]="company()!.websiteUrl" target="_blank" rel="noopener noreferrer"
                       class="mt-1.5 inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
                       (click)="$event.stopPropagation()">
                      <lucide-icon [img]="ExternalLink" [size]="13"></lucide-icon>
                      {{ cleanUrl(company()!.websiteUrl!) }}
                    </a>
                  }
                </div>

                <!-- Subscribe button -->
                <div class="flex flex-shrink-0 gap-2">
                  <button (click)="toggleSubscription()"
                          [class]="auth.isSubscribed(company()!.id)
                            ? 'inline-flex cursor-pointer items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/20'
                            : 'inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-accent/30 hover:text-accent'">
                    <lucide-icon [img]="auth.isSubscribed(company()!.id) ? Bell : BellOff" [size]="16"></lucide-icon>
                    {{ auth.isSubscribed(company()!.id) ? 'Subscribed' : 'Subscribe' }}
                  </button>
                  @if (isAdmin()) {
                    <button (click)="confirmDeleteCompany()"
                            class="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20">
                      <lucide-icon [img]="Trash2" [size]="16"></lucide-icon>
                      Delete
                    </button>
                  }
                </div>
              </div>
            </div>

            <!-- Stats row -->
            <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div class="rounded-xl border border-border bg-card p-4">
                <div class="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <lucide-icon [img]="BarChart2" [size]="12"></lucide-icon>
                  Market Cap
                </div>
                <p class="text-lg font-semibold">
                  {{ company()!.marketCap ? formatMarketCap(company()!.marketCap!) : '—' }}
                </p>
              </div>

              <div class="rounded-xl border border-border bg-card p-4">
                <div class="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <lucide-icon [img]="Calendar" [size]="12"></lucide-icon>
                  IPO Date
                </div>
                <p class="text-lg font-semibold">{{ company()!.ipoDate ?? '—' }}</p>
              </div>

              <div class="col-span-2 rounded-xl border border-border bg-card p-4">
                <div class="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <lucide-icon [img]="TrendingUp" [size]="12"></lucide-icon>
                  Sectors
                </div>
                @if (company()!.sector) {
                  <div class="flex flex-wrap gap-1.5">
                    <span class="rounded-md border border-border bg-secondary/50 px-2 py-0.5 text-xs font-medium">
                      {{ company()!.sector }}
                    </span>
                  </div>
                } @else {
                  <p class="text-sm text-muted-foreground">—</p>
                }
              </div>
            </div>

            <!-- Description -->
            @if (company()!.description || isAdmin()) {
              <div class="rounded-xl border border-border bg-card p-6">
                <div class="mb-3 flex items-center justify-between">
                  <h2 class="font-semibold text-accent">About</h2>
                  @if (isAdmin() && !editingDescription()) {
                    <button (click)="startEditDescription()"
                            class="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-secondary">
                      <lucide-icon [img]="Pencil" [size]="12"></lucide-icon>
                      Edit
                    </button>
                  }
                </div>
                @if (editingDescription()) {
                  <textarea [(ngModel)]="editDescriptionValue"
                            class="mb-2 w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground focus:border-accent focus:outline-none"
                            rows="5"></textarea>
                  <div class="mb-3">
                    <label class="mb-1 block text-xs text-muted-foreground">Logo URL</label>
                    <input type="text" [(ngModel)]="editLogoUrlValue"
                           class="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
                           placeholder="https://..." />
                  </div>
                  <div class="flex gap-2">
                    <button (click)="saveCompanyEdit()"
                            class="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-xs text-white hover:bg-accent/80">
                      <lucide-icon [img]="CheckIcon" [size]="12"></lucide-icon> Save
                    </button>
                    <button (click)="editingDescription.set(false)"
                            class="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs hover:bg-secondary">
                      <lucide-icon [img]="XIcon" [size]="12"></lucide-icon> Cancel
                    </button>
                  </div>
                } @else {
                  <p class="leading-relaxed text-muted-foreground">{{ company()!.description }}</p>
                }
              </div>
            }

            <!-- Recent news -->
            <section>
              <h2 class="mb-4 text-xl font-semibold">Recent News</h2>
              @if (newsLoading()) {
                <div class="grid gap-4 md:grid-cols-2">
                  @for (i of [1,2,3,4]; track i) {
                    <div class="animate-pulse rounded-xl border border-border bg-card p-5">
                      <div class="h-3.5 w-24 rounded bg-secondary"></div>
                      <div class="mt-3 h-5 w-3/4 rounded bg-secondary"></div>
                      <div class="mt-3 h-4 w-full rounded bg-secondary"></div>
                    </div>
                  }
                </div>
              } @else if (recentNews().length) {
                <div class="grid gap-4 md:grid-cols-2">
                  @for (item of recentNews(); track item.id) {
                    <app-news-card [news]="item" [compact]="true" />
                  }
                </div>
              } @else {
                <p class="py-8 text-center text-muted-foreground">No recent news for this company.</p>
              }
            </section>

          </div>

        } @else {
          <div class="py-16 text-center">
            <p class="text-lg text-muted-foreground">Company not found.</p>
            <a routerLink="/companies" class="mt-4 inline-block text-accent hover:underline">Back to Companies</a>
          </div>
        }
      </main>
    </div>
  `,
})
export class CompanyDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly companyApi = inject(CompanyApiService);
  private readonly newsApi = inject(NewsApiService);
  readonly auth = inject(AuthService);

  private readonly adminApi = inject(AdminApiService);

  readonly ArrowLeft = ArrowLeft;
  readonly ExternalLink = ExternalLink;
  readonly Globe = Globe;
  readonly TrendingUp = TrendingUp;
  readonly Calendar = Calendar;
  readonly BarChart2 = BarChart2;
  readonly Bell = Bell;
  readonly BellOff = BellOff;
  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;
  readonly CheckIcon = Check;
  readonly XIcon = X;

  readonly isAdmin = computed(() => this.auth.user()?.role === 'ADMIN');

  readonly loading = signal(true);
  readonly logoReady = signal(false);
  readonly newsLoading = signal(true);
  readonly company = signal<CompanyDetail | null>(null);
  readonly recentNews = signal<NewsItem[]>([]);
  readonly logoError = signal(false);

  // Admin editing
  readonly editingDescription = signal(false);
  editDescriptionValue = '';
  editLogoUrlValue = '';

  ngOnInit(): void {
    const ticker = this.route.snapshot.paramMap.get('ticker') ?? '';

    this.companyApi.getDetail(ticker).subscribe({
      next: (c) => {
        this.company.set(c);
        this.loading.set(false);
        this.loadNews(c.ticker);
        if (c.logoUrl) {
          const img = new Image();
          img.onload = () => this.logoReady.set(true);
          img.onerror = () => { this.logoError.set(true); this.logoReady.set(true); };
          img.src = c.logoUrl;
        } else {
          this.logoReady.set(true);
        }
      },
      error: () => {
        this.company.set(null);
        this.loading.set(false);
        this.logoReady.set(true);
        this.newsLoading.set(false);
      },
    });
  }

  toggleSubscription(): void {
    const c = this.company();
    if (!c) return;

    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/register']);
      return;
    }

    if (this.auth.isSubscribed(c.id)) {
      this.auth.unsubscribe(c.id).subscribe();
    } else {
      this.auth.subscribe(c.id).subscribe();
    }
  }

  private loadNews(ticker: string): void {
    this.newsApi.getNewsByCompany(ticker, 0, 6).subscribe({
      next: (page) => {
        this.recentNews.set(page.content);
        this.newsLoading.set(false);
      },
      error: () => this.newsLoading.set(false),
    });
  }

  formatMarketCap(mc: number): string {
    if (mc >= 1_000_000) return `$${(mc / 1_000_000).toFixed(2)}T`;
    if (mc >= 1_000) return `$${(mc / 1_000).toFixed(1)}B`;
    return `$${mc.toFixed(0)}M`;
  }

  cleanUrl(url: string): string {
    return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
  }

  // ── Admin actions ──

  startEditDescription(): void {
    const c = this.company()!;
    this.editDescriptionValue = c.description ?? '';
    this.editLogoUrlValue = c.logoUrl ?? '';
    this.editingDescription.set(true);
  }

  saveCompanyEdit(): void {
    const c = this.company()!;
    this.adminApi.updateCompany(c.id, {
      description: this.editDescriptionValue,
      logoUrl: this.editLogoUrlValue || undefined,
    }).subscribe({
      next: () => {
        this.company.set({
          ...c,
          description: this.editDescriptionValue,
          logoUrl: this.editLogoUrlValue || c.logoUrl,
        });
        this.editingDescription.set(false);
      },
    });
  }

  confirmDeleteCompany(): void {
    if (!confirm(`Delete ${this.company()!.name}? This cannot be undone.`)) return;
    this.adminApi.deleteCompany(this.company()!.id).subscribe({
      next: () => this.router.navigate(['/companies']),
    });
  }
}

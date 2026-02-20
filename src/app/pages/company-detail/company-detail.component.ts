import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { NewsCardComponent } from '../../components/news-card/news-card.component';
import { CompanyApiService } from '../../services/company-api.service';
import { NewsApiService } from '../../services/news-api.service';
import { CompanyDetail, NewsItem } from '../../models';
import { LucideAngularModule, ArrowLeft, ExternalLink, Globe, TrendingUp, Calendar, BarChart2 } from 'lucide-angular';

@Component({
  selector: 'app-company-detail',
  imports: [RouterLink, HeaderComponent, NewsCardComponent, LucideAngularModule],
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
                @if (company()!.sectors.length) {
                  <div class="flex flex-wrap gap-1.5">
                    @for (sector of company()!.sectors; track sector) {
                      <span class="rounded-md border border-border bg-secondary/50 px-2 py-0.5 text-xs font-medium">
                        {{ sector }}
                      </span>
                    }
                  </div>
                } @else {
                  <p class="text-sm text-muted-foreground">—</p>
                }
              </div>
            </div>

            <!-- Description -->
            @if (company()!.description) {
              <div class="rounded-xl border border-border bg-card p-6">
                <h2 class="mb-3 font-semibold text-accent">About</h2>
                <p class="leading-relaxed text-muted-foreground">{{ company()!.description }}</p>
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
  private readonly companyApi = inject(CompanyApiService);
  private readonly newsApi = inject(NewsApiService);

  readonly ArrowLeft = ArrowLeft;
  readonly ExternalLink = ExternalLink;
  readonly Globe = Globe;
  readonly TrendingUp = TrendingUp;
  readonly Calendar = Calendar;
  readonly BarChart2 = BarChart2;

  readonly loading = signal(true);
  readonly logoReady = signal(false);
  readonly newsLoading = signal(true);
  readonly company = signal<CompanyDetail | null>(null);
  readonly recentNews = signal<NewsItem[]>([]);
  readonly logoError = signal(false);

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
}

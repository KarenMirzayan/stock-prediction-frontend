import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { NewsCardComponent } from '../../components/news-card/news-card.component';
import { MockDataService } from '../../services/mock-data.service';
import { NewsApiService } from '../../services/news-api.service';
import { AdminApiService } from '../../services/admin-api.service';
import { AuthService } from '../../services/auth.service';
import { LucideAngularModule, ArrowLeft, TrendingUp, TrendingDown, Minus, Shuffle, Zap, Share2, Globe, Pencil, Trash2, Check, X } from 'lucide-angular';
import { Direction, NewsDetail, PredictionDetail } from '../../models';

@Component({
  selector: 'app-news-detail',
  imports: [RouterLink, FormsModule, HeaderComponent, NewsCardComponent, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-background">
      <app-header />

      <main class="container mx-auto px-4 py-8">
        <div class="mb-6">
          <a routerLink="/news"
             class="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-secondary">
            <lucide-icon [img]="ArrowLeft" [size]="16"></lucide-icon>
            Back to News
          </a>
        </div>

        @if (loading()) {
          <div class="mx-auto max-w-4xl animate-pulse space-y-6">
            <div class="h-4 w-32 rounded bg-secondary"></div>
            <div class="h-10 w-3/4 rounded bg-secondary"></div>
            <div class="flex gap-2">
              <div class="h-6 w-16 rounded bg-secondary"></div>
              <div class="h-6 w-16 rounded bg-secondary"></div>
            </div>
            <div class="h-32 rounded-xl bg-secondary"></div>
            <div class="space-y-3">
              <div class="h-4 w-full rounded bg-secondary"></div>
              <div class="h-4 w-full rounded bg-secondary"></div>
              <div class="h-4 w-2/3 rounded bg-secondary"></div>
            </div>
          </div>
        } @else if (news()) {
          <article class="mx-auto max-w-4xl">
            <header class="mb-8">
              <time class="mb-4 block text-sm text-muted-foreground"
                    [attr.title]="news()!.publishedAtExact">{{ news()!.publishedAt }}</time>

              <h1 class="mb-4 text-3xl font-bold leading-tight md:text-4xl">{{ news()!.headline }}</h1>

              <div class="mb-4 flex flex-wrap gap-2">
                @for (company of news()!.companies; track company.ticker) {
                  <div class="relative"
                       (mouseenter)="hoveredTicker.set(company.ticker)"
                       (mouseleave)="hoveredTicker.set(null)">
                    <span class="inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-all duration-150 hover:brightness-125"
                          [class]="getDirectionClass(company.direction)"
                          [class.border-dashed]="isSectorPrediction(company.ticker)"
                          [routerLink]="isSectorPrediction(company.ticker) ? null : ['/companies', company.ticker]">
                      @if (isSectorPrediction(company.ticker)) {
                        <lucide-icon [img]="Globe" [size]="12"></lucide-icon>
                      }
                      {{ company.ticker }}
                      <lucide-icon [img]="getDirectionIcon(company.direction)" [size]="12"></lucide-icon>
                    </span>
                    @if (hoveredTicker() === company.ticker && company.rationale) {
                      <div class="pointer-events-none absolute bottom-full left-0 z-20 mb-2 w-64 rounded-xl border border-border bg-card p-3 shadow-xl">
                        <div class="mb-2 flex items-center gap-2">
                          <span class="inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-xs font-medium capitalize"
                                [class]="getDirectionClass(company.direction)">
                            {{ company.direction }}
                            <lucide-icon [img]="getDirectionIcon(company.direction)" [size]="10"></lucide-icon>
                          </span>
                          @if (company.confidence != null) {
                            <span class="text-xs text-muted-foreground">{{ company.confidence }}% confidence</span>
                          }
                        </div>
                        @if (company.timeHorizon) {
                          <p class="mb-1.5 text-xs font-medium text-muted-foreground">{{ formatTimeHorizon(company.timeHorizon) }}</p>
                        }
                        <p class="text-xs leading-relaxed text-foreground">{{ company.rationale }}</p>
                        @if (company.evidence?.length) {
                          <ul class="mt-2 space-y-1 border-t border-border pt-2">
                            @for (item of company.evidence; track $index) {
                              <li class="text-xs text-muted-foreground before:mr-1 before:content-['·']">{{ item }}</li>
                            }
                          </ul>
                        }
                      </div>
                    }
                  </div>
                }
              </div>

              <div class="mb-6 flex flex-wrap gap-1.5">
                @for (tag of news()!.tags; track tag) {
                  <span class="rounded-md border border-border bg-transparent px-2 py-0.5 text-xs font-medium">{{ tag }}</span>
                }
              </div>

              <div class="flex flex-wrap items-center gap-3">
                <div class="rounded-full border px-3 py-1.5" [class]="getSentimentClass()">
                  <span class="text-sm font-medium capitalize">{{ news()!.sentiment }}</span>
                </div>
                <button class="inline-flex items-center gap-1.5 rounded-md border border-border bg-transparent px-3 py-1.5 text-sm transition-colors hover:bg-secondary">
                  <lucide-icon [img]="Share2" [size]="14"></lucide-icon>
                  Share
                </button>
                @if (isAdmin()) {
                  <button (click)="confirmDeleteArticle()"
                          class="inline-flex items-center gap-1.5 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-sm text-destructive transition-colors hover:bg-destructive/20">
                    <lucide-icon [img]="Trash2" [size]="14"></lucide-icon>
                    Delete Article
                  </button>
                }
              </div>
            </header>

            <div class="mb-8 rounded-xl border border-border bg-card p-6">
              <div class="mb-3 flex items-center justify-between">
                <h2 class="font-semibold text-accent">AI Analysis Summary</h2>
                @if (isAdmin() && editingSummary() === null) {
                  <button (click)="startEditSummary()"
                          class="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-secondary">
                    <lucide-icon [img]="Pencil" [size]="12"></lucide-icon>
                    Edit
                  </button>
                }
              </div>
              @if (editingSummary() !== null) {
                <textarea [(ngModel)]="editingSummaryValue"
                          class="mb-2 w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground focus:border-accent focus:outline-none"
                          rows="4"></textarea>
                <div class="flex gap-2">
                  <button (click)="saveSummary()"
                          class="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-xs text-white transition-colors hover:bg-accent/80">
                    <lucide-icon [img]="CheckIcon" [size]="12"></lucide-icon> Save
                  </button>
                  <button (click)="editingSummary.set(null)"
                          class="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs transition-colors hover:bg-secondary">
                    <lucide-icon [img]="XIcon" [size]="12"></lucide-icon> Cancel
                  </button>
                </div>
              } @else {
                <p class="text-muted-foreground">{{ news()!.analyticalExplanation }}</p>
              }
            </div>

            @if (news()!.predictions.length > 0) {
              <div class="mb-8 rounded-xl border border-border bg-card p-6">
                <h2 class="mb-4 font-semibold text-accent">Predictions</h2>
                <div class="space-y-3">
                  @for (pred of news()!.predictions; track pred.id ?? $index) {
                    <div class="rounded-lg border border-border/50 bg-background p-3">
                      @if (editingPrediction() === pred.id) {
                        <div class="space-y-3">
                          <div class="grid grid-cols-3 gap-2">
                            <div>
                              <label class="mb-1 block text-xs text-muted-foreground">Direction</label>
                              <select [(ngModel)]="editPredForm.direction"
                                      class="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs focus:border-accent focus:outline-none">
                                <option value="BULLISH">Bullish</option>
                                <option value="BEARISH">Bearish</option>
                                <option value="NEUTRAL">Neutral</option>
                                <option value="MIXED">Mixed</option>
                                <option value="VOLATILE">Volatile</option>
                              </select>
                            </div>
                            <div>
                              <label class="mb-1 block text-xs text-muted-foreground">Time Horizon</label>
                              <select [(ngModel)]="editPredForm.timeHorizon"
                                      class="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs focus:border-accent focus:outline-none">
                                <option value="SHORT_TERM">Short Term</option>
                                <option value="MID_TERM">Mid Term</option>
                                <option value="LONG_TERM">Long Term</option>
                              </select>
                            </div>
                            <div>
                              <label class="mb-1 block text-xs text-muted-foreground">Confidence</label>
                              <input type="number" [(ngModel)]="editPredForm.confidence" min="0" max="100"
                                     class="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs focus:border-accent focus:outline-none" />
                            </div>
                          </div>
                          <div>
                            <label class="mb-1 block text-xs text-muted-foreground">Rationale</label>
                            <textarea [(ngModel)]="editPredForm.rationale" rows="2"
                                      class="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs focus:border-accent focus:outline-none"></textarea>
                          </div>
                          <div class="flex gap-2">
                            <button (click)="savePrediction(pred)"
                                    class="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-xs text-white hover:bg-accent/80">
                              <lucide-icon [img]="CheckIcon" [size]="12"></lucide-icon> Save
                            </button>
                            <button (click)="editingPrediction.set(null)"
                                    class="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs hover:bg-secondary">
                              <lucide-icon [img]="XIcon" [size]="12"></lucide-icon> Cancel
                            </button>
                          </div>
                        </div>
                      } @else {
                        <div class="mb-2 flex flex-wrap items-center gap-2">
                          <span class="inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-xs font-medium capitalize"
                                [class]="getDirectionClass($any(pred.direction.toLowerCase()))">
                            {{ pred.direction.toLowerCase() }}
                            <lucide-icon [img]="getDirectionIcon($any(pred.direction.toLowerCase()))" [size]="10"></lucide-icon>
                          </span>
                          @for (target of pred.targets; track target) {
                            <span class="rounded-md border border-border bg-secondary/50 px-1.5 py-0.5 text-xs font-mono font-medium text-muted-foreground">{{ target }}</span>
                          }
                          @if (pred.timeHorizon) {
                            <span class="text-xs text-muted-foreground">· {{ formatTimeHorizon(pred.timeHorizon) }}</span>
                          }
                          @if (pred.confidence) {
                            <span class="text-xs text-muted-foreground">· {{ pred.confidence }}% confidence</span>
                          }
                          @if (isAdmin()) {
                            <div class="ml-auto flex gap-1">
                              <button (click)="startEditPrediction(pred)"
                                      class="inline-flex items-center rounded-md border border-border p-1 text-muted-foreground transition-colors hover:bg-secondary">
                                <lucide-icon [img]="Pencil" [size]="12"></lucide-icon>
                              </button>
                              <button (click)="confirmDeletePrediction(pred)"
                                      class="inline-flex items-center rounded-md border border-destructive/30 p-1 text-destructive transition-colors hover:bg-destructive/10">
                                <lucide-icon [img]="Trash2" [size]="12"></lucide-icon>
                              </button>
                            </div>
                          }
                        </div>
                        <p class="text-sm leading-relaxed text-foreground/80">{{ pred.rationale }}</p>
                        @if (pred.evidence.length) {
                          <ul class="mt-2 space-y-1 border-t border-border pt-2">
                            @for (item of pred.evidence; track $index) {
                              <li class="text-xs text-muted-foreground before:mr-1.5 before:content-['·']">{{ item }}</li>
                            }
                          </ul>
                        }
                      }
                    </div>
                  }
                </div>
              </div>
            }

            <div class="max-w-none">
              @if (isAdmin()) {
                <div class="mb-3 flex items-center justify-between">
                  <h2 class="font-semibold text-accent">Full Text</h2>
                  @if (editingContent() === null) {
                    <button (click)="startEditContent()"
                            class="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-secondary">
                      <lucide-icon [img]="Pencil" [size]="12"></lucide-icon>
                      Edit
                    </button>
                  }
                </div>
              }
              @if (editingContent() !== null) {
                <textarea [(ngModel)]="editingContentValue"
                          class="mb-2 w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground focus:border-accent focus:outline-none"
                          rows="12"></textarea>
                <div class="flex gap-2">
                  <button (click)="saveContent()"
                          class="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-xs text-white hover:bg-accent/80">
                    <lucide-icon [img]="CheckIcon" [size]="12"></lucide-icon> Save
                  </button>
                  <button (click)="editingContent.set(null)"
                          class="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs hover:bg-secondary">
                    <lucide-icon [img]="XIcon" [size]="12"></lucide-icon> Cancel
                  </button>
                </div>
              } @else {
                @for (paragraph of paragraphs(); track $index) {
                  <p class="mb-4 leading-relaxed text-foreground/90">{{ paragraph }}</p>
                }
              }
            </div>
          </article>

          @if (relatedNews().length > 0) {
            <section class="mx-auto mt-12 max-w-4xl">
              <h2 class="mb-6 text-xl font-semibold">Related News</h2>
              <div class="grid gap-4 md:grid-cols-2">
                @for (item of relatedNews(); track item.id) {
                  <app-news-card [news]="item" [compact]="true" />
                }
              </div>
            </section>
          }
        } @else {
          <div class="py-16 text-center">
            <p class="text-lg text-muted-foreground">Article not found.</p>
            <a routerLink="/news" class="mt-4 inline-block text-accent hover:underline">Back to News</a>
          </div>
        }
      </main>
    </div>
  `,
})
export class NewsDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly newsApi = inject(NewsApiService);
  private readonly adminApi = inject(AdminApiService);
  private readonly auth = inject(AuthService);
  private readonly mockData = inject(MockDataService);

  readonly ArrowLeft = ArrowLeft;
  readonly Share2 = Share2;
  readonly Globe = Globe;
  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;
  readonly CheckIcon = Check;
  readonly XIcon = X;

  readonly isAdmin = computed(() => this.auth.user()?.role === 'ADMIN');

  readonly news = signal<NewsDetail | null>(null);
  readonly hoveredTicker = signal<string | null>(null);
  readonly relatedNews = signal(this.mockData.relatedNews);
  readonly loading = signal(true);
  readonly paragraphs = signal<string[]>([]);

  // Admin editing state
  readonly editingSummary = signal<string | null>(null);
  editingSummaryValue = '';
  readonly editingContent = signal<string | null>(null);
  editingContentValue = '';
  readonly editingPrediction = signal<number | null>(null);
  editPredForm = { direction: '', timeHorizon: '', confidence: 0, rationale: '' };

  private readonly directionConfig: Record<Direction, { icon: any; class: string }> = {
    bullish:  { icon: TrendingUp,   class: 'border-accent/40 bg-accent/10 text-accent' },
    bearish:  { icon: TrendingDown,  class: 'border-destructive/40 bg-destructive/10 text-destructive' },
    neutral:  { icon: Minus,         class: 'border-border bg-muted text-muted-foreground' },
    mixed:    { icon: Shuffle,       class: 'border-warning/40 bg-warning/10 text-warning' },
    volatile: { icon: Zap,           class: 'border-purple-500/40 bg-purple-500/10 text-purple-500' },
  };

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.loading.set(false);
      return;
    }

    this.newsApi.getNewsDetail(id).subscribe({
      next: (detail) => {
        this.news.set(detail);
        this.paragraphs.set(detail.fullText?.split('\n\n') ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.news.set(this.mockData.newsDetail);
        this.paragraphs.set(this.mockData.newsDetail.fullText.split('\n\n'));
        this.loading.set(false);
      },
    });
  }

  getDirectionClass(direction: Direction): string {
    return this.directionConfig[direction].class;
  }

  getDirectionIcon(direction: Direction) {
    return this.directionConfig[direction].icon;
  }

  isSectorPrediction(ticker: string): boolean {
    return ticker.includes(':');
  }

  formatTimeHorizon(th: string): string {
    return th.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
  }

  getSentimentClass(): string {
    const map = {
      positive: 'bg-accent/20 text-accent border-accent/30',
      negative: 'bg-destructive/20 text-destructive border-destructive/30',
      neutral: 'bg-muted text-muted-foreground border-border',
    };
    return map[this.news()!.sentiment];
  }

  // ── Admin actions ──

  startEditSummary(): void {
    this.editingSummaryValue = this.news()!.analyticalExplanation;
    this.editingSummary.set('editing');
  }

  saveSummary(): void {
    const n = this.news()!;
    this.adminApi.updateArticle(n.id, { summary: this.editingSummaryValue }).subscribe({
      next: () => {
        this.news.set({ ...n, analyticalExplanation: this.editingSummaryValue });
        this.editingSummary.set(null);
      },
    });
  }

  startEditContent(): void {
    this.editingContentValue = this.news()!.fullText;
    this.editingContent.set('editing');
  }

  saveContent(): void {
    const n = this.news()!;
    this.adminApi.updateArticle(n.id, { content: this.editingContentValue }).subscribe({
      next: () => {
        this.news.set({ ...n, fullText: this.editingContentValue });
        this.paragraphs.set(this.editingContentValue.split('\n\n'));
        this.editingContent.set(null);
      },
    });
  }

  startEditPrediction(pred: PredictionDetail): void {
    this.editPredForm = {
      direction: pred.direction,
      timeHorizon: pred.timeHorizon || 'SHORT_TERM',
      confidence: pred.confidence,
      rationale: pred.rationale,
    };
    this.editingPrediction.set(pred.id);
  }

  savePrediction(pred: PredictionDetail): void {
    this.adminApi.updatePrediction(pred.id, this.editPredForm).subscribe({
      next: () => {
        const n = this.news()!;
        const updated = n.predictions.map(p =>
          p.id === pred.id ? { ...p, ...this.editPredForm } : p
        );
        this.news.set({ ...n, predictions: updated });
        this.editingPrediction.set(null);
      },
    });
  }

  confirmDeletePrediction(pred: PredictionDetail): void {
    if (!confirm('Delete this prediction?')) return;
    this.adminApi.deletePrediction(pred.id).subscribe({
      next: () => {
        const n = this.news()!;
        this.news.set({ ...n, predictions: n.predictions.filter(p => p.id !== pred.id) });
      },
    });
  }

  confirmDeleteArticle(): void {
    if (!confirm('Delete this entire article? This cannot be undone.')) return;
    this.adminApi.deleteArticle(this.news()!.id).subscribe({
      next: () => this.router.navigate(['/news']),
    });
  }
}

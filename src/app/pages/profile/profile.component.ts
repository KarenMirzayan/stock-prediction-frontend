import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { AuthService } from '../../services/auth.service';
import { Company, UserProfile } from '../../models';
import { LucideAngularModule, User, Building2, Bell, Trash2, Settings, LogOut } from 'lucide-angular';

@Component({
  selector: 'app-profile',
  imports: [HeaderComponent, RouterLink, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-background">
      <app-header />

      <main class="container mx-auto px-4 py-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold">Profile Settings</h1>
          <p class="mt-1 text-muted-foreground">Manage your subscriptions and notification preferences</p>
        </div>

        <div class="grid gap-6 lg:grid-cols-3">
          <div class="space-y-6 lg:col-span-2">
            <!-- Company Subscriptions -->
            <div class="rounded-xl border border-border bg-card" id="subscriptions">
              <div class="border-b border-border p-6">
                <div class="flex items-center gap-2">
                  <lucide-icon [img]="Building2" [size]="20" class="text-accent"></lucide-icon>
                  <h3 class="text-lg font-semibold">Company Subscriptions</h3>
                </div>
                <p class="mt-1 text-sm text-muted-foreground">Receive updates for these companies in your personalized feed</p>
              </div>
              <div class="p-6">
                @if (subscriptionsLoading()) {
                  <div class="space-y-3">
                    @for (i of [1,2,3]; track i) {
                      <div class="animate-pulse rounded-lg border border-border p-4">
                        <div class="flex items-center gap-4">
                          <div class="h-10 w-10 rounded-lg bg-secondary"></div>
                          <div class="space-y-2">
                            <div class="h-4 w-20 rounded bg-secondary"></div>
                            <div class="h-3 w-32 rounded bg-secondary"></div>
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                } @else if (companies().length > 0) {
                  <div class="space-y-3">
                    @for (company of companies(); track company.id) {
                      <div class="flex items-center justify-between rounded-lg border border-border p-4">
                        <a [routerLink]="['/companies', company.ticker]" class="flex items-center gap-4">
                          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary font-semibold">
                            {{ company.ticker.slice(0, 2) }}
                          </div>
                          <div>
                            <div class="flex items-center gap-2">
                              <span class="font-medium">{{ company.ticker }}</span>
                              @if (company.exchange) {
                                <span class="rounded-md border border-border px-2 py-0.5 text-xs">{{ company.exchange }}</span>
                              }
                            </div>
                            <p class="text-sm text-muted-foreground">{{ company.name }}</p>
                          </div>
                        </a>
                        <button (click)="removeCompany(company.id)"
                                class="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive"
                                aria-label="Remove company">
                          <lucide-icon [img]="Trash2" [size]="16"></lucide-icon>
                        </button>
                      </div>
                    }
                  </div>
                } @else {
                  <div class="rounded-lg border border-dashed border-border py-8 text-center">
                    <lucide-icon [img]="Building2" [size]="32" class="mx-auto text-muted-foreground"></lucide-icon>
                    <p class="mt-2 text-sm text-muted-foreground">No company subscriptions yet</p>
                    <a routerLink="/companies" class="mt-1 inline-block text-sm text-accent hover:underline">Browse companies to subscribe</a>
                  </div>
                }
              </div>
            </div>

            <!-- Notification Preferences -->
            <div class="rounded-xl border border-border bg-card">
              <div class="border-b border-border p-6">
                <div class="flex items-center gap-2">
                  <lucide-icon [img]="Bell" [size]="20" class="text-accent"></lucide-icon>
                  <h3 class="text-lg font-semibold">Notification Preferences</h3>
                </div>
                <p class="mt-1 text-sm text-muted-foreground">Configure how and when you want to receive updates</p>
              </div>
              <div class="space-y-6 p-6">
                <div>
                  <h4 class="mb-4 font-medium">Content Types</h4>
                  <div class="space-y-4">
                    @for (item of notificationItems; track item.key) {
                      <div class="flex items-center justify-between">
                        <div>
                          <label [for]="item.key" class="font-medium">{{ item.label }}</label>
                          <p class="text-sm text-muted-foreground">{{ item.description }}</p>
                        </div>
                        <button [id]="item.key" role="switch"
                                [attr.aria-checked]="notifications()[item.key]"
                                (click)="toggleNotification(item.key)"
                                class="relative h-6 w-11 rounded-full transition-colors"
                                [class]="notifications()[item.key] ? 'bg-accent' : 'bg-secondary'">
                          <span class="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform"
                                [class.translate-x-5]="notifications()[item.key]"></span>
                        </button>
                      </div>
                      @if (!$last) {
                        <div class="border-t border-border"></div>
                      }
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Account Card -->
            <div class="rounded-xl border border-border bg-card">
              <div class="border-b border-border p-6">
                <div class="flex items-center gap-2">
                  <lucide-icon [img]="User" [size]="20" class="text-accent"></lucide-icon>
                  <h3 class="text-lg font-semibold">Account</h3>
                </div>
              </div>
              <div class="space-y-4 p-6">
                <div class="flex items-center gap-4">
                  <div class="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-2xl font-bold text-accent-foreground">
                    {{ userInitials() }}
                  </div>
                  <div>
                    <h3 class="font-semibold">{{ displayName() }}</h3>
                    <p class="text-sm text-muted-foreground">&#64;{{ auth.user()?.username }}</p>
                  </div>
                </div>
                <div class="border-t border-border"></div>
                <div class="space-y-3">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-muted-foreground">Member since</span>
                    <span>{{ memberSince() }}</span>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-muted-foreground">Company subscriptions</span>
                    <span>{{ companies().length }}</span>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-muted-foreground">Role</span>
                    <span class="rounded-md border border-border px-2 py-0.5 text-xs">{{ auth.user()?.role }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sign Out -->
            <button (click)="auth.logout()"
                    class="flex w-full items-center justify-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10">
              <lucide-icon [img]="LogOut" [size]="16"></lucide-icon>
              Sign Out
            </button>
          </div>
        </div>
      </main>
    </div>
  `,
})
export class ProfileComponent implements OnInit {
  readonly auth = inject(AuthService);
  private readonly http = inject(HttpClient);

  readonly companies = signal<Company[]>([]);
  readonly subscriptionsLoading = signal(true);
  readonly notifications = signal<Record<string, boolean>>({
    breakingNews: true,
    dailyDigest: true,
    priceAlerts: false,
    earningsReports: true,
  });

  readonly User = User;
  readonly Building2 = Building2;
  readonly Bell = Bell;
  readonly Trash2 = Trash2;
  readonly Settings = Settings;
  readonly LogOut = LogOut;

  readonly notificationItems = [
    { key: 'breakingNews', label: 'Breaking News', description: 'Get notified immediately for major market events' },
    { key: 'dailyDigest', label: 'Daily Digest', description: 'Summary of key news sent every morning' },
    { key: 'priceAlerts', label: 'Price Alerts', description: 'Notifications for significant price movements' },
    { key: 'earningsReports', label: 'Earnings Reports', description: 'Alerts for subscribed company earnings' },
  ];

  ngOnInit(): void {
    this.loadSubscriptions();
  }

  userInitials(): string {
    const u = this.auth.user();
    if (!u) return '?';
    if (u.firstName && u.lastName) return (u.firstName[0] + u.lastName[0]).toUpperCase();
    return u.username.slice(0, 2).toUpperCase();
  }

  displayName(): string {
    const u = this.auth.user();
    if (!u) return '';
    if (u.firstName && u.lastName) return `${u.firstName} ${u.lastName}`;
    if (u.firstName) return u.firstName;
    return u.username;
  }

  memberSince(): string {
    const u = this.auth.user();
    if (!u?.createdAt) return '—';
    const d = new Date(u.createdAt);
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  removeCompany(companyId: number): void {
    this.auth.unsubscribe(companyId).subscribe({
      next: () => this.companies.update(list => list.filter(c => c.id !== companyId)),
    });
  }

  toggleNotification(key: string): void {
    this.notifications.update(n => ({ ...n, [key]: !n[key] }));
  }

  private loadSubscriptions(): void {
    this.http.get<Company[]>('http://localhost:8081/api/users/me/subscriptions').subscribe({
      next: (list) => {
        this.companies.set(list);
        this.subscriptionsLoading.set(false);
      },
      error: () => this.subscriptionsLoading.set(false),
    });
  }
}

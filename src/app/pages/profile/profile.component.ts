import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { MockDataService } from '../../services/mock-data.service';
import { LucideAngularModule, User, Building2, LayoutGrid, Bell, Trash2, Send, Settings, Link as LinkIcon, CheckCircle2 } from 'lucide-angular';

@Component({
  selector: 'app-profile',
  imports: [HeaderComponent, LucideAngularModule],
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
                @if (companies().length > 0) {
                  <div class="space-y-3">
                    @for (company of companies(); track company.symbol) {
                      <div class="flex items-center justify-between rounded-lg border border-border p-4">
                        <div class="flex items-center gap-4">
                          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary font-semibold">
                            {{ company.symbol.slice(0, 2) }}
                          </div>
                          <div>
                            <div class="flex items-center gap-2">
                              <span class="font-medium">{{ company.symbol }}</span>
                              <span class="rounded-md border border-border px-2 py-0.5 text-xs">{{ company.sector }}</span>
                            </div>
                            <p class="text-sm text-muted-foreground">{{ company.name }}</p>
                          </div>
                        </div>
                        <button (click)="removeCompany(company.symbol)"
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
                    <button class="mt-1 text-sm text-accent">Browse news to subscribe</button>
                  </div>
                }
              </div>
            </div>

            <!-- Sector Subscriptions -->
            <div class="rounded-xl border border-border bg-card">
              <div class="border-b border-border p-6">
                <div class="flex items-center gap-2">
                  <lucide-icon [img]="LayoutGrid" [size]="20" class="text-accent"></lucide-icon>
                  <h3 class="text-lg font-semibold">Sector Subscriptions</h3>
                </div>
                <p class="mt-1 text-sm text-muted-foreground">Follow entire sectors to stay informed about industry trends</p>
              </div>
              <div class="p-6">
                @if (sectors().length > 0) {
                  <div class="grid gap-3 sm:grid-cols-2">
                    @for (sector of sectors(); track sector.name) {
                      <div class="flex items-center justify-between rounded-lg border border-border p-4">
                        <div>
                          <span class="font-medium">{{ sector.name }}</span>
                          <p class="text-sm text-muted-foreground">{{ sector.companies }} companies</p>
                        </div>
                        <button (click)="removeSector(sector.name)"
                                class="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive"
                                aria-label="Remove sector">
                          <lucide-icon [img]="Trash2" [size]="16"></lucide-icon>
                        </button>
                      </div>
                    }
                  </div>
                } @else {
                  <div class="rounded-lg border border-dashed border-border py-8 text-center">
                    <lucide-icon [img]="LayoutGrid" [size]="32" class="mx-auto text-muted-foreground"></lucide-icon>
                    <p class="mt-2 text-sm text-muted-foreground">No sector subscriptions yet</p>
                    <button class="mt-1 text-sm text-accent">Explore sectors</button>
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

                <div>
                  <h4 class="mb-4 font-medium">Delivery Channels</h4>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <lucide-icon [img]="Send" [size]="20" class="text-muted-foreground"></lucide-icon>
                      <div>
                        <label for="telegram-notif" class="font-medium">Telegram</label>
                        <p class="text-sm text-muted-foreground">Receive notifications via Telegram bot</p>
                      </div>
                    </div>
                    <button id="telegram-notif" role="switch"
                            [attr.aria-checked]="notifications()['telegram']"
                            (click)="toggleNotification('telegram')"
                            class="relative h-6 w-11 rounded-full transition-colors"
                            [class]="notifications()['telegram'] ? 'bg-accent' : 'bg-secondary'">
                      <span class="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform"
                            [class.translate-x-5]="notifications()['telegram']"></span>
                    </button>
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
                    JD
                  </div>
                  <div>
                    <h3 class="font-semibold">John Doe</h3>
                    <p class="text-sm text-muted-foreground">&#64;johndoe</p>
                  </div>
                </div>
                <div class="border-t border-border"></div>
                <div class="space-y-3">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-muted-foreground">Member since</span>
                    <span>January 2026</span>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-muted-foreground">Company subscriptions</span>
                    <span>{{ companies().length }}</span>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-muted-foreground">Sector subscriptions</span>
                    <span>{{ sectors().length }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Telegram Connection -->
            <div class="rounded-xl border border-border bg-card">
              <div class="border-b border-border p-6">
                <div class="flex items-center gap-2">
                  <lucide-icon [img]="LinkIcon" [size]="20" class="text-accent"></lucide-icon>
                  <h3 class="text-lg font-semibold">Telegram Connection</h3>
                </div>
              </div>
              <div class="p-6">
                <div class="flex items-center gap-3 rounded-lg border border-accent/30 bg-accent/10 p-4">
                  <lucide-icon [img]="CheckCircle2" [size]="20" class="text-accent"></lucide-icon>
                  <div>
                    <p class="font-medium text-accent">Connected</p>
                    <p class="text-sm text-muted-foreground">Linked to &#64;johndoe_tg</p>
                  </div>
                </div>
                <button class="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-border bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary">
                  <lucide-icon [img]="Settings" [size]="16"></lucide-icon>
                  Manage Connection
                </button>
              </div>
            </div>

            <!-- Danger Zone -->
            <div class="rounded-xl border border-destructive/30 bg-destructive/5">
              <div class="border-b border-destructive/30 p-6">
                <h3 class="text-lg font-semibold text-destructive">Danger Zone</h3>
              </div>
              <div class="p-6">
                <p class="mb-4 text-sm text-muted-foreground">Permanently delete your account and all associated data.</p>
                <button class="w-full rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
})
export class ProfileComponent {
  private readonly data = inject(MockDataService);
  readonly companies = signal([...this.data.subscribedCompanies]);
  readonly sectors = signal([...this.data.subscribedSectors]);
  readonly notifications = signal<Record<string, boolean>>({
    breakingNews: true,
    dailyDigest: true,
    priceAlerts: false,
    earningsReports: true,
    telegram: true,
    email: false,
  });

  readonly User = User;
  readonly Building2 = Building2;
  readonly LayoutGrid = LayoutGrid;
  readonly Bell = Bell;
  readonly Trash2 = Trash2;
  readonly Send = Send;
  readonly Settings = Settings;
  readonly LinkIcon = LinkIcon;
  readonly CheckCircle2 = CheckCircle2;

  readonly notificationItems = [
    { key: 'breakingNews', label: 'Breaking News', description: 'Get notified immediately for major market events' },
    { key: 'dailyDigest', label: 'Daily Digest', description: 'Summary of key news sent every morning' },
    { key: 'priceAlerts', label: 'Price Alerts', description: 'Notifications for significant price movements' },
    { key: 'earningsReports', label: 'Earnings Reports', description: 'Alerts for subscribed company earnings' },
  ];

  removeCompany(symbol: string): void {
    this.companies.update(list => list.filter(c => c.symbol !== symbol));
  }

  removeSector(name: string): void {
    this.sectors.update(list => list.filter(s => s.name !== name));
  }

  toggleNotification(key: string): void {
    this.notifications.update(n => ({ ...n, [key]: !n[key] }));
  }
}

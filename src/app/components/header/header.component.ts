import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, TrendingUp, Newspaper, GraduationCap, Calendar, User, Menu, X, Home, Building2, LogOut, UserPlus } from 'lucide-angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="container mx-auto flex h-16 items-center justify-between px-4">
        <div class="flex items-center gap-6">
          <a routerLink="/" class="flex items-center gap-2">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <lucide-icon [img]="TrendingUp" class="h-5 w-5 text-accent-foreground" [size]="20"></lucide-icon>
            </div>
            <span class="text-lg font-semibold">InvestAssist</span>
          </a>

          <nav class="hidden items-center gap-1 md:flex">
            @for (item of navigation; track item.name) {
              <a [routerLink]="item.href"
                 routerLinkActive="bg-secondary text-foreground"
                 [routerLinkActiveOptions]="{exact: item.href === '/'}"
                 class="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                <lucide-icon [img]="item.icon" [size]="16"></lucide-icon>
                <span class="hidden lg:inline">{{ item.name }}</span>
              </a>
            }
          </nav>
        </div>

        <div class="flex items-center gap-3">
          @if (auth.isLoggedIn()) {
            <div class="relative">
              <button (click)="userMenuOpen.set(!userMenuOpen())"
                      class="flex items-center gap-2 rounded-full p-2 transition-colors hover:bg-secondary"
                      aria-label="User menu">
                <div class="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                  {{ userInitials() }}
                </div>
              </button>
              @if (userMenuOpen()) {
                <div class="absolute right-0 top-full mt-1 w-48 rounded-lg border border-border bg-card p-1 shadow-lg">
                  <div class="border-b border-border px-3 py-2">
                    <p class="text-sm font-medium">{{ auth.user()?.firstName || auth.user()?.username }}</p>
                    <p class="text-xs text-muted-foreground">&#64;{{ auth.user()?.username }}</p>
                  </div>
                  <a routerLink="/profile" (click)="userMenuOpen.set(false)"
                     class="mt-1 block rounded-md px-3 py-2 text-sm transition-colors hover:bg-secondary">Profile</a>
                  <a routerLink="/profile" fragment="subscriptions" (click)="userMenuOpen.set(false)"
                     class="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-secondary">My Subscriptions</a>
                  <button (click)="onSignOut()"
                          class="mt-1 flex w-full items-center gap-2 rounded-md border-t border-border px-3 py-2 text-left text-sm text-destructive transition-colors hover:bg-secondary">
                    <lucide-icon [img]="LogOut" [size]="14"></lucide-icon>
                    Sign Out
                  </button>
                </div>
              }
            </div>
          } @else {
            <a routerLink="/register"
               class="hidden items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90 sm:inline-flex">
              <lucide-icon [img]="UserPlus" [size]="16"></lucide-icon>
              Sign Up
            </a>
            <a routerLink="/login"
               class="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary">
              Sign In
            </a>
          }

          <button (click)="mobileMenuOpen.set(!mobileMenuOpen())"
                  class="rounded-md p-2 transition-colors hover:bg-secondary md:hidden"
                  aria-label="Toggle menu">
            @if (mobileMenuOpen()) {
              <lucide-icon [img]="X" [size]="20"></lucide-icon>
            } @else {
              <lucide-icon [img]="Menu" [size]="20"></lucide-icon>
            }
          </button>
        </div>
      </div>

      @if (mobileMenuOpen()) {
        <div class="border-t border-border md:hidden">
          <nav class="container mx-auto flex flex-col gap-1 px-4 py-3">
            @for (item of navigation; track item.name) {
              <a [routerLink]="item.href"
                 routerLinkActive="bg-secondary text-foreground"
                 [routerLinkActiveOptions]="{exact: item.href === '/'}"
                 (click)="mobileMenuOpen.set(false)"
                 class="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                <lucide-icon [img]="item.icon" [size]="16"></lucide-icon>
                {{ item.name }}
              </a>
            }
            @if (!auth.isLoggedIn()) {
              <a routerLink="/register" (click)="mobileMenuOpen.set(false)"
                 class="mt-2 flex items-center gap-3 rounded-md bg-accent px-3 py-2.5 text-sm font-medium text-accent-foreground">
                <lucide-icon [img]="UserPlus" [size]="16"></lucide-icon>
                Sign Up
              </a>
            }
          </nav>
        </div>
      }
    </header>
  `,
})
export class HeaderComponent {
  readonly auth = inject(AuthService);

  readonly mobileMenuOpen = signal(false);
  readonly userMenuOpen = signal(false);

  readonly TrendingUp = TrendingUp;
  readonly User = User;
  readonly Menu = Menu;
  readonly X = X;
  readonly LogOut = LogOut;
  readonly UserPlus = UserPlus;

  readonly navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'News', href: '/news', icon: Newspaper },
    { name: 'Companies', href: '/companies', icon: Building2 },
    { name: 'Forecast Analytics', href: '/forecast', icon: TrendingUp },
    { name: 'Education', href: '/education', icon: GraduationCap },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
  ];

  userInitials(): string {
    const u = this.auth.user();
    if (!u) return '?';
    if (u.firstName && u.lastName) return (u.firstName[0] + u.lastName[0]).toUpperCase();
    return u.username.slice(0, 2).toUpperCase();
  }

  onSignOut(): void {
    this.userMenuOpen.set(false);
    this.auth.logout();
  }
}

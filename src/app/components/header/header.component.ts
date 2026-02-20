import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { LucideAngularModule, TrendingUp, Newspaper, GraduationCap, Calendar, LayoutGrid, User, Menu, X, Home, Building2 } from 'lucide-angular';

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

        <div class="flex items-center gap-4">
          <div class="relative">
            <button (click)="userMenuOpen.set(!userMenuOpen())"
                    class="rounded-full p-2 transition-colors hover:bg-secondary"
                    aria-label="User menu">
              <lucide-icon [img]="User" [size]="20"></lucide-icon>
            </button>
            @if (userMenuOpen()) {
              <div class="absolute right-0 top-full mt-1 w-48 rounded-lg border border-border bg-card p-1 shadow-lg">
                <a routerLink="/profile" (click)="userMenuOpen.set(false)"
                   class="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-secondary">Profile</a>
                <a routerLink="/profile" fragment="subscriptions" (click)="userMenuOpen.set(false)"
                   class="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-secondary">My Subscriptions</a>
                <button class="block w-full rounded-md px-3 py-2 text-left text-sm text-destructive transition-colors hover:bg-secondary">
                  Sign Out
                </button>
              </div>
            }
          </div>

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
          </nav>
        </div>
      }
    </header>
  `,
})
export class HeaderComponent {
  readonly mobileMenuOpen = signal(false);
  readonly userMenuOpen = signal(false);

  readonly TrendingUp = TrendingUp;
  readonly User = User;
  readonly Menu = Menu;
  readonly X = X;

  readonly navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'News', href: '/news', icon: Newspaper },
    { name: 'Companies', href: '/companies', icon: Building2 },
    { name: 'Forecast Analytics', href: '/forecast', icon: TrendingUp },
    { name: 'Education', href: '/education', icon: GraduationCap },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Heatmap', href: '/heatmap', icon: LayoutGrid },
  ];
}

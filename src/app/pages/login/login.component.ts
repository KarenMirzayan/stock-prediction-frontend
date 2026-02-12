import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, TrendingUp, Send } from 'lucide-angular';

@Component({
  selector: 'app-login',
  imports: [RouterLink, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex min-h-screen items-center justify-center bg-background p-4">
      <div class="w-full max-w-md">
        <div class="mb-8 text-center">
          <a routerLink="/" class="inline-flex items-center gap-2">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
              <lucide-icon [img]="TrendingUp" [size]="28" class="text-accent-foreground"></lucide-icon>
            </div>
            <span class="text-2xl font-bold">InvestAssist</span>
          </a>
          <p class="mt-3 text-muted-foreground">AI-powered investment analytics platform</p>
        </div>

        <div class="rounded-xl border border-border bg-card">
          <div class="p-6 text-center">
            <h2 class="text-lg font-semibold">Welcome Back</h2>
            <p class="mt-1 text-sm text-muted-foreground">Sign in to access your personalized market insights</p>
          </div>
          <div class="space-y-4 px-6 pb-6">
            <a routerLink="/"
               class="flex w-full items-center justify-center gap-2 rounded-md bg-accent px-4 py-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90">
              <lucide-icon [img]="Send" [size]="20"></lucide-icon>
              Login with Telegram
            </a>

            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <span class="w-full border-t border-border"></span>
              </div>
              <div class="relative flex justify-center text-xs uppercase">
                <span class="bg-card px-2 text-muted-foreground">Secure authentication</span>
              </div>
            </div>

            <div class="rounded-lg border border-border bg-secondary/50 p-4 text-center text-sm text-muted-foreground">
              <p>By continuing, you agree to our Terms of Service and Privacy Policy.
                Your Telegram account will be linked for seamless access across web and mobile.</p>
            </div>
          </div>
        </div>

        <div class="mt-6 space-y-4 text-center text-sm text-muted-foreground">
          <div class="flex items-center justify-center gap-6">
            <div class="flex items-center gap-2">
              <div class="h-2 w-2 rounded-full bg-accent"></div>
              <span>Real-time market data</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="h-2 w-2 rounded-full bg-accent"></div>
              <span>AI-powered forecasts</span>
            </div>
          </div>
          <p>New to InvestAssist? <span class="text-accent">Your account will be created automatically.</span></p>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  readonly TrendingUp = TrendingUp;
  readonly Send = Send;
}

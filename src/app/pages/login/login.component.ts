import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, TrendingUp, Eye, EyeOff, ArrowRight } from 'lucide-angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule, LucideAngularModule],
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
            <h2 class="text-lg font-semibold">{{ isRegister() ? 'Create Account' : 'Welcome Back' }}</h2>
            <p class="mt-1 text-sm text-muted-foreground">
              {{ isRegister() ? 'Sign up to track your favorite companies' : 'Sign in to access your personalized market insights' }}
            </p>
          </div>

          <form (ngSubmit)="onSubmit()" class="space-y-4 px-6 pb-6">
            @if (error()) {
              <div class="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {{ error() }}
              </div>
            }

            <div>
              <label for="username" class="mb-1.5 block text-sm font-medium">Username</label>
              <input id="username" type="text" autocomplete="username"
                     [(ngModel)]="username" name="username" required
                     class="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                     placeholder="Enter your username" />
            </div>

            @if (isRegister()) {
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label for="firstName" class="mb-1.5 block text-sm font-medium">First Name</label>
                  <input id="firstName" type="text" autocomplete="given-name"
                         [(ngModel)]="firstName" name="firstName"
                         class="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                         placeholder="John" />
                </div>
                <div>
                  <label for="lastName" class="mb-1.5 block text-sm font-medium">Last Name</label>
                  <input id="lastName" type="text" autocomplete="family-name"
                         [(ngModel)]="lastName" name="lastName"
                         class="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                         placeholder="Doe" />
                </div>
              </div>
            }

            <div>
              <label for="password" class="mb-1.5 block text-sm font-medium">Password</label>
              <div class="relative">
                <input id="password" [type]="showPassword() ? 'text' : 'password'"
                       autocomplete="{{ isRegister() ? 'new-password' : 'current-password' }}"
                       [(ngModel)]="password" name="password" required
                       class="w-full rounded-lg border border-input bg-background px-3 py-2.5 pr-10 text-sm outline-none focus:ring-2 focus:ring-ring"
                       placeholder="{{ isRegister() ? 'At least 6 characters' : 'Enter your password' }}" />
                <button type="button" (click)="showPassword.set(!showPassword())"
                        class="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <lucide-icon [img]="showPassword() ? EyeOff : Eye" [size]="16"></lucide-icon>
                </button>
              </div>
            </div>

            <button type="submit" [disabled]="submitting()"
                    class="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90 disabled:opacity-50">
              @if (submitting()) {
                <div class="h-4 w-4 animate-spin rounded-full border-2 border-accent-foreground/30 border-t-accent-foreground"></div>
              }
              {{ isRegister() ? 'Create Account' : 'Sign In' }}
              <lucide-icon [img]="ArrowRight" [size]="16"></lucide-icon>
            </button>
          </form>
        </div>

        <p class="mt-6 text-center text-sm text-muted-foreground">
          @if (isRegister()) {
            Already have an account?
            <a routerLink="/login" class="font-medium text-accent hover:underline">Sign in</a>
          } @else {
            New to InvestAssist?
            <a routerLink="/register" class="font-medium text-accent hover:underline">Create an account</a>
          }
        </p>
      </div>
    </div>
  `,
})
export class LoginComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly TrendingUp = TrendingUp;
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  readonly ArrowRight = ArrowRight;

  readonly isRegister = signal(false);
  readonly showPassword = signal(false);
  readonly submitting = signal(false);
  readonly error = signal('');

  username = '';
  password = '';
  firstName = '';
  lastName = '';

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/profile']);
      return;
    }
    this.isRegister.set(this.router.url.startsWith('/register'));
  }

  onSubmit(): void {
    this.error.set('');
    if (!this.username.trim() || !this.password.trim()) {
      this.error.set('Username and password are required');
      return;
    }
    if (this.isRegister() && this.password.length < 6) {
      this.error.set('Password must be at least 6 characters');
      return;
    }

    this.submitting.set(true);
    const obs = this.isRegister()
      ? this.auth.register({
          username: this.username.trim(),
          password: this.password,
          firstName: this.firstName.trim() || undefined,
          lastName: this.lastName.trim() || undefined,
        })
      : this.auth.login({
          username: this.username.trim(),
          password: this.password,
        });

    obs.subscribe({
      next: () => {
        this.submitting.set(false);
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        this.submitting.set(false);
        const msg = err.error?.message || err.error?.messages?.[0];
        if (err.status === 409) {
          this.error.set('Username is already taken');
        } else if (err.status === 401) {
          this.error.set('Invalid username or password');
        } else {
          this.error.set(msg || 'Something went wrong. Please try again.');
        }
      },
    });
  }
}

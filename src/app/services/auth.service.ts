import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError, of, Observable } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, UserProfile, Company, TelegramLinkResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly baseUrl = 'http://localhost:8081/api';

  private readonly _user = signal<UserProfile | null>(this.loadUser());
  readonly user = this._user.asReadonly();
  readonly isLoggedIn = computed(() => !!this._user());

  private readonly _subscriptions = signal<Set<number>>(this.loadSubscriptions());
  readonly subscriptions = this._subscriptions.asReadonly();

  private readonly _subscribedTickers = signal<Set<string>>(this.loadSubscribedTickers());
  readonly subscribedTickers = this._subscribedTickers.asReadonly();

  register(req: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/register`, req).pipe(
      tap(res => this.handleAuth(res))
    );
  }

  login(req: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, req).pipe(
      tap(res => this.handleAuth(res))
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('subscriptions');
    localStorage.removeItem('subscribed_tickers');
    this._user.set(null);
    this._subscriptions.set(new Set());
    this._subscribedTickers.set(new Set());
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  refreshToken(): Observable<AuthResponse | null> {
    const token = localStorage.getItem('refresh_token');
    if (!token) return of(null);
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/refresh`, { refreshToken: token }).pipe(
      tap(res => this.handleAuth(res)),
      catchError(() => {
        this.logout();
        return of(null);
      })
    );
  }

  loadProfile(): void {
    if (!this.getToken()) return;
    this.http.get<UserProfile>(`${this.baseUrl}/users/me`).subscribe({
      next: user => {
        this._user.set(user);
        localStorage.setItem('user', JSON.stringify(user));
      },
    });
  }

  isSubscribed(companyId: number): boolean {
    return this._subscriptions().has(companyId);
  }

  fetchSubscriptions(): void {
    if (!this.getToken()) return;
    this.http.get<Company[]>(`${this.baseUrl}/users/me/subscriptions`).subscribe({
      next: companies => {
        const ids = new Set(companies.map(c => c.id));
        const tickers = new Set(companies.map(c => c.ticker));
        this._subscriptions.set(ids);
        this._subscribedTickers.set(tickers);
        localStorage.setItem('subscriptions', JSON.stringify([...ids]));
        localStorage.setItem('subscribed_tickers', JSON.stringify([...tickers]));
      },
    });
  }

  subscribe(companyId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/users/me/subscriptions/${companyId}`, {}).pipe(
      tap(() => {
        this._subscriptions.update(s => new Set([...s, companyId]));
        localStorage.setItem('subscriptions', JSON.stringify([...this._subscriptions()]));
        this.fetchSubscriptions();
      })
    );
  }

  linkTelegram(): Observable<TelegramLinkResponse> {
    return this.http.post<TelegramLinkResponse>(`${this.baseUrl}/users/me/telegram/link`, {});
  }

  unlinkTelegram(): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/me/telegram/unlink`).pipe(
      tap(() => {
        this._user.update(u => u ? { ...u, telegramLinked: false, telegramUsername: null } : null);
        localStorage.setItem('user', JSON.stringify(this._user()));
      })
    );
  }

  unsubscribe(companyId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/me/subscriptions/${companyId}`).pipe(
      tap(() => {
        this._subscriptions.update(s => {
          const next = new Set(s);
          next.delete(companyId);
          return next;
        });
        localStorage.setItem('subscriptions', JSON.stringify([...this._subscriptions()]));
        this.fetchSubscriptions();
      })
    );
  }

  private handleAuth(res: AuthResponse): void {
    localStorage.setItem('access_token', res.accessToken);
    localStorage.setItem('refresh_token', res.refreshToken);
    localStorage.setItem('user', JSON.stringify(res.user));
    this._user.set(res.user);
    this.fetchSubscriptions();
  }

  private loadUser(): UserProfile | null {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  }

  private loadSubscriptions(): Set<number> {
    const raw = localStorage.getItem('subscriptions');
    if (!raw) return new Set();
    try { return new Set(JSON.parse(raw)); } catch { return new Set(); }
  }

  private loadSubscribedTickers(): Set<string> {
    const raw = localStorage.getItem('subscribed_tickers');
    if (!raw) return new Set();
    try { return new Set(JSON.parse(raw)); } catch { return new Set(); }
  }
}

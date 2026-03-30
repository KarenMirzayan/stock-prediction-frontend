import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Company, CompanyDetail, CompanySentiment } from '../models';

@Injectable({ providedIn: 'root' })
export class CompanyApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8081/api/companies';

  getAll(): Observable<Company[]> {
    return this.http.get<Company[]>(this.baseUrl).pipe(
      map(list => list.map(c => ({ ...c, logoUrl: this.proxyLogo(c.logoUrl, 80) })))
    );
  }

  getDetail(ticker: string): Observable<CompanyDetail> {
    return this.http.get<CompanyDetail>(`${this.baseUrl}/${ticker}`).pipe(
      map(c => ({ ...c, logoUrl: this.proxyLogo(c.logoUrl, 128) }))
    );
  }

  getSentiment(ticker: string): Observable<CompanySentiment> {
    return this.http.get<CompanySentiment>(`${this.baseUrl}/${ticker}/sentiment`);
  }

  private proxyLogo(url: string | undefined, size: number): string | undefined {
    if (!url) return undefined;
    return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=${size}&h=${size}&fit=contain&output=webp&q=90`;
  }
}

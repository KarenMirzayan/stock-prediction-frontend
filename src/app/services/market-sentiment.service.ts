import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MarketSentiment } from '../models';

@Injectable({ providedIn: 'root' })
export class MarketSentimentService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8081/api/market-sentiment';

  getSentiment(): Observable<MarketSentiment> {
    return this.http.get<MarketSentiment>(this.baseUrl);
  }
}

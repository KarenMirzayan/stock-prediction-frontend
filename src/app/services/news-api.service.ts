import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NewsItem, NewsDetail, NewsPage } from '../models';

@Injectable({ providedIn: 'root' })
export class NewsApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8081/api/news';

  getLatestNews(page = 0, size = 10): Observable<NewsPage> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<NewsPage>(this.baseUrl, { params });
  }

  getNewsDetail(id: number): Observable<NewsDetail> {
    return this.http.get<NewsDetail>(`${this.baseUrl}/${id}`);
  }

  getNewsByCompany(ticker: string, page = 0, size = 10): Observable<NewsPage> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<NewsPage>(`${this.baseUrl}/company/${ticker}`, { params });
  }

  getNewsBySector(sectorCode: string, page = 0, size = 10): Observable<NewsPage> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<NewsPage>(`${this.baseUrl}/sector/${sectorCode}`, { params });
  }

  getNewsBySentiment(sentiment: string, page = 0, size = 10): Observable<NewsPage> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<NewsPage>(`${this.baseUrl}/sentiment/${sentiment}`, { params });
  }
}

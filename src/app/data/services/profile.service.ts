import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable, tap} from 'rxjs';
import {Profile} from '../Interfaces/profile.interface';
import {Pageble} from '../Interfaces/pageble.interface';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  http: HttpClient = inject(HttpClient);

  baseApiUrl: string = 'https://icherniakov.ru/yt-course/'

  me = signal<Profile | null>(null)

  getTestAccounts(): Observable<Profile[]> {
    return this.http.get<Profile[]>(`${this.baseApiUrl}account/test_accounts`)
  }

  getMe() {
    return this.http.get<Profile>(`${this.baseApiUrl}account/me`)
      .pipe(
        tap(res => this.me.set(res))
      )
  }

  getAccount(id: string) {
    return this.http.get<Profile>(`${this.baseApiUrl}account/${id}`)
  }

  getSubscribersShortList(subsAmount = 3): Observable<Profile[]> {
    return this.http.get<Pageble<Profile>>(`${this.baseApiUrl}account/subscribers/`)
      .pipe(
        map(res => res.items.slice(0, subsAmount))
      )
  }

  patchProfile(profile: Partial<Profile>) {
    return this.http.patch<Profile>(
      `${this.baseApiUrl}account/me`,
      profile
    )
  }

  uploadAvatar(file: File) {
    const fd = new FormData()
    fd.append('image', file)
    return this.http.post<Profile>(
      `${this.baseApiUrl}account/upload_image`,
      fd
    )
  }
}

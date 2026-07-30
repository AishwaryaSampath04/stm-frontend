import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private readonly storageKey = 'selectedLanguage';

  private selectedLanguageSubject = new BehaviorSubject<{ language: string; languageId: number }>(
    JSON.parse(sessionStorage.getItem(this.storageKey) || 'null') || { language: 'English', languageId: 1 }
  );

  selectedLanguage$ = this.selectedLanguageSubject.asObservable();

  setSelectedLanguage(language: string, languageId: number) {
    const selectedLanguage = { language, languageId };
    this.selectedLanguageSubject.next(selectedLanguage);
    sessionStorage.setItem(this.storageKey, JSON.stringify(selectedLanguage));
  }
}

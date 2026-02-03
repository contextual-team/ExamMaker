import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Question } from './questions/question.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private questions: Question[] = [];
  private usedQuestions: Question[] = []

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    
  }

  loadQuestions(examType: string): Observable<void> {
    return this.http.get<any[]>(`/${examType}.json`).pipe(
      map(questions => {
        this.questions = questions;
        this.saveQuestionsToLocalStorage();
      })
    );
  }

  saveQuestions(questions: any[]): void {
    this.questions = questions;
    this.saveQuestionsToLocalStorage();
  }

  getQuestions(): any[] {
    return this.questions;
  }
  getUsedQuestions(): any[] {
    return this.usedQuestions;
  }

  markQuestionAsUsed(question: any): void {
    const usedQuestions = this.getUsedQuestions();
    usedQuestions.push(question);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('usedQuestions', JSON.stringify(usedQuestions));
    }
  }

  loadQuestionsFromLocalStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedQuestions = localStorage.getItem('questions');
      if (storedQuestions) {
        this.questions = JSON.parse(storedQuestions);
      }
    }
  }
  loadUsedQuestionsFromLocalStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      const usedQuestions = localStorage.getItem('usedQuestions');
      if(usedQuestions){
        this.usedQuestions = JSON.parse(usedQuestions);

      }
    }
  }
  private saveQuestionsToLocalStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('questions', JSON.stringify(this.questions));
      localStorage.setItem('usedQuestions', JSON.stringify(this.usedQuestions));
    }
  }

}
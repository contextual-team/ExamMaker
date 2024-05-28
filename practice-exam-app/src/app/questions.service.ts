import { Injectable } from '@angular/core';
import { Question } from './questions/question.model';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private questions: Question[] = [];
  private usedQuestions: Question[] = []

  constructor() {
    
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
    localStorage.setItem('usedQuestions', JSON.stringify(usedQuestions));
  }

  loadQuestionsFromLocalStorage(): void {
    const storedQuestions = localStorage.getItem('questions');
    if (storedQuestions) {
      this.questions = JSON.parse(storedQuestions);
    }
  }
  loadUsedQuestionsFromLocalStorage(): void {
    const usedQuestions = localStorage.getItem('usedQuestions');
    if(usedQuestions){
      this.usedQuestions = JSON.parse(usedQuestions);

    }
  }
  private saveQuestionsToLocalStorage(): void {
    localStorage.setItem('questions', JSON.stringify(this.questions));
    localStorage.setItem('usedQuestions', JSON.stringify(this.usedQuestions));
  }

}

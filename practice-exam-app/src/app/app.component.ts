import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { QuestionService } from './questions.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'practice-exam-app';
  numberOfQuestions: number = 10;
  examStarted: boolean = false;
  questionsInitialized = false;
  constructor(
    private questionService: QuestionService, 
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {

   }

   ngOnInit(): void {
     if (isPlatformBrowser(this.platformId)) {
       if (localStorage.getItem('questions')) {
         this.questionsInitialized = true
       }
     }
   }

  onFileUpload(event: any): void {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const questions = JSON.parse(e.target.result);
      this.questionService.saveQuestions(questions);
      alert('Questions uploaded and stored in local storage.');
    };
    reader.readAsText(file);
    this.questionsInitialized = true
  }

  startExam(): void {
    this.examStarted = true;
    this.questionService.loadQuestionsFromLocalStorage();
    this.questionService.loadUsedQuestionsFromLocalStorage();
    this.router.navigate(['/question', { numQuestions: this.numberOfQuestions }]);
  }
}

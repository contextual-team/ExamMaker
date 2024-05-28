export interface Question {
  answer: string;
  answer_ET: string;
  url: string;
  question_text: string;
  choices: { [key: string]: string };
  id: number;
}

export interface Result {
  question: Question,
  correct: boolean,
  userAnswers: string[]
  correctAnswers: string[]
}

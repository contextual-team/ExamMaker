const fs = require('fs');
const readlineSync = require('readline-sync');

const questionsFile = 'questions_backup.json';
const usedQuestionsFile = 'used_questions.json';

// Read questions from JSON file
const questions = JSON.parse(fs.readFileSync(questionsFile, 'utf8'));

// Read used questions from JSON file, or initialize an empty array if the file doesn't exist
let usedQuestions = [];
if (fs.existsSync(usedQuestionsFile)) {
    usedQuestions = JSON.parse(fs.readFileSync(usedQuestionsFile, 'utf8'));
} else {
    fs.writeFileSync(usedQuestionsFile, JSON.stringify([]));
}

// Function to save used questions to the file
function saveUsedQuestions(usedQuestions) {
    fs.writeFileSync(usedQuestionsFile, JSON.stringify(usedQuestions, null, 2));
}

// Function to generate a practice exam
function generatePracticeExam(questions, usedQuestions) {
    console.clear();

    const numQuestions = parseInt(readlineSync.question('How many questions will the test have?: '), 10);

    // Filter out used questions
    const unusedQuestions = questions.filter(q => !usedQuestions.some(uq => uq.question_text === q.question_text));

    let selectedQuestions;
    if (unusedQuestions.length >= numQuestions) {
        // If there are enough unused questions, use them
        selectedQuestions = unusedQuestions.sort(() => Math.random() - 0.5).slice(0, numQuestions);
    } else {
        // If not, combine unused and used questions and shuffle
        selectedQuestions = [...unusedQuestions, ...questions].sort(() => Math.random() - 0.5).slice(0, numQuestions);
    }

    // Initialize variables to track errors and total questions
    let errors = 0;
    const totalQuestions = numQuestions;
    const wrongAnswers = [];

    // Display questions and get user's answers
    selectedQuestions.forEach((question, index) => {
        console.log(`Question ${index + 1}: ${question.question_text}:`);
        const sortedChoices = Object.keys(question.choices).sort().reduce((acc, key) => {
            acc[key] = question.choices[key];
            return acc;
        }, {});

        Object.keys(sortedChoices).forEach((key) => {
            console.log(`${key}) ${sortedChoices[key]}`);
        });

        // Get user's answer
        const answer = readlineSync.question('Your answer: ').toUpperCase();

        // Check if the answer is correct
        if (answer !== question.answer) {
            errors++;
            wrongAnswers.push({
                id: question.id,
                question: question.question_text,
                yourAnswer: answer,
                correctAnswer: question.answer,
                discussion: question.url
            });
            console.log('Incorrect!');
        } else {
            console.log('Correct!');
        }

        console.log('---------------------------');
    });

    // Calculate percentage
    const percentage = ((totalQuestions - errors) / totalQuestions) * 100;

    // Display results
    console.log(`Total errors: ${errors}`);
    console.log(`Percentage: ${percentage.toFixed(2)}%`);

    // Show wrong answers
    console.log('---------------------------');
    console.log('Wrong Answers:');
    if (wrongAnswers.length === 0) {
        console.log('None');
    } else {
        wrongAnswers.forEach(wrongAnswer => {
            console.log(`Question ${wrongAnswer.id}:`);
            console.log(`Your Answer: ${wrongAnswer.yourAnswer}`);
            console.log(`Correct Answer: ${wrongAnswer.correctAnswer}`);
            console.log(`Discussion: ${wrongAnswer.discussion}`);
            console.log('---------------------------');
        });
    }

    // Add selected questions to usedQuestions
    usedQuestions.push(...selectedQuestions);

    // Save used questions
    saveUsedQuestions(usedQuestions);
}

// Usage
generatePracticeExam(questions, usedQuestions);

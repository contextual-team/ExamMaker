const fs = require('fs');
const readlineSync = require('readline-sync');

// Read questions from JSON file
const questions = JSON.parse(fs.readFileSync('questions_backup.json', 'utf8'));

// Function to generate a practice exam
function generatePracticeExam(questions) {
    console.clear();

    const numQuestions = readlineSync.question('How many questions will the test have?: ')
    // Shuffle questions to randomize order
    const shuffledQuestions = questions.sort(() => Math.random() - 0.5).slice(0, numQuestions);

    // Initialize variables to track errors and total questions
    let errors = 0;
    const totalQuestions = numQuestions;
    const wrongAnswers = [];

    // Display questions and get user's answers
    shuffledQuestions.forEach((question, index) => {
        console.log(`Question ${question.id}: ${question.question_text}:`);
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
                number: question.question_id,
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
}

// Usage
generatePracticeExam(questions);

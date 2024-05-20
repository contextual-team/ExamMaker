const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
// Read the JSON files and return a Promise that resolves with the questions array
const questions = [];
async function readQuestions(questions) {
    for (let i = 1; i < 35; i++) {
        try {
            const data = await fs.promises.readFile(`questions/exam_${i}.json`, 'utf8');
            const jsonObject = JSON.parse(data).pageProps.questions;
            jsonObject.forEach(element => {
                let examQuestion = {
                    answer: element.answer,
                    answer_ET: element.answer_ET,
                    url: element.url,
                    question_text: element.question_text,
                    choices: element.choices,
                    id: element.question_id
                }
                questions.push(examQuestion);
            });
        } catch (error) {
            console.error('Error reading or parsing file:', error);
        }
    }
    return questions;
}

// Write the questions array to a JSON file
async function writeQuestionsToFile() {
    try {
        questions = await readQuestions(questions);
        fs.writeFileSync('questions.json', JSON.stringify(questions, null, 2));
        console.log('Questions written to questions.json');
    } catch (error) {
        console.error('Error writing questions to file:', error);
    }
}

// Usage

// Function to crawl the URL and get the question text
function getQuestionTextFromUrl(url) {
    return new Promise((resolve, reject) => {
        axios.get(url)
            .then(response => {
                const $ = cheerio.load(response.data);
                const questionText = $('p.card-text').text().trim();
                resolve(questionText);
            })
            .catch(error => {
                console.error('Error fetching question text from URL:', error);
                reject(null);
            });
    });
}

// Iterate through questions
async function processQuestions() {
    for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        // Check if question text is blank or empty
        if (!question.question_text) {
            try {
                const questionText = await getQuestionTextFromUrl(question.url);
                if (questionText) {
                    question.question_text = questionText;
                    console.log(`Question ${i + 1} text obtained from URL:`, questionText);
                } else {
                    console.log(`Failed to obtain question ${i + 1} text from URL`);
                }
            } catch (error) {
                console.error(`Error processing question ${i + 1}:`, error);
            }
        }
    }

    // Write updated questions array to a new JSON file
    fs.writeFileSync('updated_questions_v2.json', JSON.stringify(questions, null, 2));
    console.log('Updated questions written to updated_questions.json');
}

// Start processing questions
writeQuestionsToFile().then(x => {
    processQuestions();
});



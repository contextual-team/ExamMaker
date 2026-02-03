const fs = require('fs');
const path = require('path');

const tasks = [
    { inputFile: 'CloudData.json', outputDir: 'data-engineer-renewal' },
    { inputFile: 'network.json', outputDir: 'network-engineer-renewal' },
    { inputFile: 'questions.json', outputDir: 'questions-renewal' } 
];

const questionsPerExam = 25;

tasks.forEach(task => {
    const { inputFile, outputDir } = task;

    if (!fs.existsSync(outputDir)){
        fs.mkdirSync(outputDir);
    }

    try {
        if (!fs.existsSync(inputFile)) {
            console.log(`Skipping ${inputFile}: File not found.`);
            return;
        }

        const data = fs.readFileSync(inputFile, 'utf8');
        const questions = JSON.parse(data);

        let examCount = 1;
        for (let i = 0; i < questions.length; i += questionsPerExam) {
            const examQuestions = questions.slice(i, i + questionsPerExam);
            const examData = {
                exam_number: examCount,
                total_questions: examQuestions.length,
                questions: examQuestions
            };

            const outputFile = path.join(outputDir, `exam-${examCount}.json`);
            fs.writeFileSync(outputFile, JSON.stringify(examData, null, 2));
            console.log(`Created ${outputFile} with ${examQuestions.length} questions.`);
            examCount++;
        }

    } catch (err) {
        console.error(`Error processing ${inputFile}:`, err);
    }
});

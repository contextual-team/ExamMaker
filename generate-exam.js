const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
if (args.length === 0) {
    console.log('Usage: node generate-exam.js <source_file.json>');
    process.exit(1);
}

const inputFile = args[0];
const questionsPerExam = 25;

try {
    if (!fs.existsSync(inputFile)) {
        console.error(`Error: File ${inputFile} not found.`);
        process.exit(1);
    }

    const data = fs.readFileSync(inputFile, 'utf8');
    let questions = JSON.parse(data);

    // Shuffle logic
    for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
    }

    const examQuestions = questions.slice(0, questionsPerExam);
    const examData = {
        generated_at: new Date().toISOString(),
        source: inputFile,
        total_questions: examQuestions.length,
        questions: examQuestions
    };

    // Output to a standalone file
    const timestamp = Date.now();
    const outputFile = `on_demand_exam_${timestamp}.json`;
    fs.writeFileSync(outputFile, JSON.stringify(examData, null, 2));
    console.log(`
✅ Exam generated: ${outputFile}`);
    console.log(`📝 Source: ${inputFile}`);
    console.log(`🔢 Questions: ${examQuestions.length}`);

    // Integration: If practice-exam-app exists, update its active questions
    const appAssetsDir = path.join('practice-exam-app', 'src', 'assets');
    if (fs.existsSync('practice-exam-app')) {
        if (!fs.existsSync(appAssetsDir)) {
            fs.mkdirSync(appAssetsDir, { recursive: true });
        }
        const appFile = path.join(appAssetsDir, 'questions.json');
        // The app might expect a simple array or the full object. 
        // Most apps use the array directly.
        fs.writeFileSync(appFile, JSON.stringify(examQuestions, null, 2));
        console.log(`🚀 Updated practice app: ${appFile}`);
    }

} catch (err) {
    console.error('Error:', err.message);
}

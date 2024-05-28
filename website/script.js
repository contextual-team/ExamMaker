document.getElementById('upload').addEventListener('change', handleFileUpload);
document.getElementById('startExam').addEventListener('click', startExam);

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const questions = JSON.parse(e.target.result);
            localStorage.setItem('questions', JSON.stringify(questions));
            alert('Questions uploaded and stored in local storage.');
        };
        reader.readAsText(file);
    }
}

function startExam() {
    const questions = JSON.parse(localStorage.getItem('questions'));
    if (!questions) {
        alert('No questions available. Please upload questions first.');
        return;
    }

    const numQuestions = parseInt(prompt('How many questions will the test have?'), 10);
    const shuffledQuestions = questions.sort(() => Math.random() - 0.5).slice(0, numQuestions);
    const examContainer = document.getElementById('examContainer');
    examContainer.innerHTML = '';

    shuffledQuestions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');
        questionDiv.innerHTML = `<p>Question ${index + 1}: ${question.question_text}</p>`;

        const optionsUl = document.createElement('ul');
        optionsUl.classList.add('options');

        Object.keys(question.choices).sort().forEach(key => {
            const optionLi = document.createElement('li');
            optionLi.classList.add('option');
            optionLi.innerHTML = `<input type="radio" name="question${index}" value="${key}"> ${key}) ${question.choices[key]}`;
            optionsUl.appendChild(optionLi);
        });

        questionDiv.appendChild(optionsUl);
        examContainer.appendChild(questionDiv);
    });

    const submitButton = document.createElement('button');
    submitButton.innerText = 'Submit Exam';
    submitButton.addEventListener('click', () => submitExam(shuffledQuestions));
    examContainer.appendChild(submitButton);
}

function submitExam(questions) {
    let errors = 0;
    const wrongAnswers = [];
    const examContainer = document.getElementById('examContainer');

    questions.forEach((question, index) => {
        const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
        if (selectedOption) {
            const answer = selectedOption.value;
            if (answer !== question.answer) {
                errors++;
                wrongAnswers.push({
                    question: question.question_text,
                    yourAnswer: answer,
                    correctAnswer: question.answer,
                    discussion: question.url
                });
            }
        } else {
            errors++;
            wrongAnswers.push({
                question: question.question_text,
                yourAnswer: 'No answer selected',
                correctAnswer: question.answer,
                discussion: question.url
            });
        }
    });

    const totalQuestions = questions.length;
    const percentage = ((totalQuestions - errors) / totalQuestions) * 100;

    examContainer.innerHTML = `
        <p>Total errors: ${errors}</p>
        <p>Percentage: ${percentage.toFixed(2)}%</p>
        <h3>Wrong Answers:</h3>
    `;

    if (wrongAnswers.length === 0) {
        examContainer.innerHTML += '<p>None</p>';
    } else {
        wrongAnswers.forEach((wrongAnswer, index) => {
            examContainer.innerHTML += `
                <div class="wrong-answer">
                    <p>Question ${index + 1}:</p>
                    <p>Your Answer: ${wrongAnswer.yourAnswer}</p>
                    <p>Correct Answer: ${wrongAnswer.correctAnswer}</p>
                    <p>Discussion: <a href="${wrongAnswer.discussion}" target="_blank">${wrongAnswer.discussion}</a></p>
                </div>
            `;
        });
    }
}

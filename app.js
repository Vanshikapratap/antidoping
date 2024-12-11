const swiper = new Swiper('.proceduresSwiper', {
    slidesPerView: 1,
    spaceBetween: 20,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    breakpoints: {
        640: {
            slidesPerView: 2,
            spaceBetween: 20,
        },
        992: {
            slidesPerView: 3,
            spaceBetween: 30,
        }
    }
});

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Improve mobile menu behavior
const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
const navbarCollapse = document.querySelector('.navbar-collapse');

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth < 992) {
            navbarCollapse.classList.remove('show');
        }
    });
});

// Quiz Data - You can expand this with more questions
const quizData = [
    {
        question: "Which of the following is NOT a type of anti-doping violation?",
        options: [
            "Presence of a prohibited substance",
            "Use or attempted use of a prohibited substance",
            "Taking supplements recommended by a coach",
            "Tampering with doping control"
        ],
        correctAnswer: 2 // Index of correct answer (0-based)
    },
    {
        question: "What is the minimum notification period for out-of-competition testing?",
        options: [
            "24 hours notice",
            "No advance notice required",
            "48 hours notice",
            "1 week notice"
        ],
        correctAnswer: 1
    },
    {
        question: "How long should athletes retain their sample collection documentation?",
        options: [
            "1 month",
            "6 months",
            "1 year",
            "2 years"
        ],
        correctAnswer: 2
    },
    // Add more questions as needed
];

class Quiz {
    constructor(data) {
        this.quizData = data;
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = new Array(data.length).fill(null);
        
        // DOM Elements
        this.progressBar = document.querySelector('.progress-bar');
        this.questionContainer = document.querySelector('.question-container');
        this.answersContainer = document.querySelector('.answers-container');
        this.prevButton = document.querySelector('.quiz-navigation button:first-child');
        this.nextButton = document.querySelector('.quiz-navigation button:last-child');
        this.quizContent = document.querySelector('.quiz-content');
        this.quizResults = document.querySelector('.quiz-results');
        
        // Bind event listeners
        this.prevButton.addEventListener('click', () => this.previousQuestion());
        this.nextButton.addEventListener('click', () => this.nextQuestion());
        
        // Initialize quiz
        this.initializeQuiz();
    }
    
    initializeQuiz() {
        this.updateQuestion();
        this.updateProgress();
    }
    
    updateQuestion() {
        const currentQ = this.quizData[this.currentQuestion];
        
        // Update question number and text
        this.questionContainer.innerHTML = `
            <span class="badge bg-primary mb-3">Question ${this.currentQuestion + 1}/${this.quizData.length}</span>
            <h3 class="question-text mb-4">${currentQ.question}</h3>
        `;
        
        // Update answer options
        this.answersContainer.innerHTML = currentQ.options.map((option, index) => `
            <div class="answer-option mb-3">
                <button class="btn btn-outline-primary w-100 text-start rounded-pill p-3 ${this.userAnswers[this.currentQuestion] === index ? 'selected' : ''}" 
                        data-answer="${index}">
                    <span class="option-letter me-3">${String.fromCharCode(65 + index)}</span>
                    ${option}
                </button>
            </div>
        `).join('');
        
        // Add click listeners to new answer buttons
        const answerButtons = this.answersContainer.querySelectorAll('button');
        answerButtons.forEach(button => {
            button.addEventListener('click', (e) => this.selectAnswer(parseInt(e.currentTarget.dataset.answer)));
        });
        
        // Update navigation buttons
        this.prevButton.disabled = this.currentQuestion === 0;
        this.nextButton.textContent = this.currentQuestion === this.quizData.length - 1 ? 'Finish' : 'Next';
    }
    
    selectAnswer(answerIndex) {
        this.userAnswers[this.currentQuestion] = answerIndex;
        
        // Update button styles
        const buttons = this.answersContainer.querySelectorAll('button');
        buttons.forEach(button => button.classList.remove('selected'));
        buttons[answerIndex].classList.add('selected');
        
        // Enable next button if it's disabled
        this.nextButton.disabled = false;
    }
    
    updateProgress() {
        const progress = ((this.currentQuestion + 1) / this.quizData.length) * 100;
        this.progressBar.style.width = `${progress}%`;
        this.progressBar.setAttribute('aria-valuenow', progress);
    }
    
    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.updateQuestion();
            this.updateProgress();
        }
    }
    
    nextQuestion() {
        if (this.currentQuestion < this.quizData.length - 1) {
            this.currentQuestion++;
            this.updateQuestion();
            this.updateProgress();
        } else {
            this.showResults();
        }
    }
    
    calculateScore() {
        this.score = this.userAnswers.reduce((score, answer, index) => {
            return score + (answer === this.quizData[index].correctAnswer ? 1 : 0);
        }, 0);
        return (this.score / this.quizData.length) * 100;
    }
    
    showResults() {
        const scorePercentage = this.calculateScore();
        
        // Update the progress ring
        const circle = document.querySelector('.progress-ring-circle');
        const radius = circle.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference;
        
        // Animate the progress ring
        setTimeout(() => {
            circle.style.strokeDashoffset = circumference - (scorePercentage / 100) * circumference;
        }, 0);
        
        // Update score text
        document.querySelector('.score').textContent = `${Math.round(scorePercentage)}%`;
        
        // Hide quiz content and show results
        this.quizContent.style.display = 'none';
        this.quizResults.style.display = 'block';
        
        // Add event listeners for result buttons
        const reviewButton = this.quizResults.querySelector('button:first-child');
        const retryButton = this.quizResults.querySelector('button:last-child');
        
        reviewButton.addEventListener('click', () => this.reviewAnswers());
        retryButton.addEventListener('click', () => this.resetQuiz());
    }
    
    reviewAnswers() {
        // Implement answer review functionality
        console.log('Review answers clicked');
    }
    
    resetQuiz() {
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = new Array(this.quizData.length).fill(null);
        this.quizContent.style.display = 'block';
        this.quizResults.style.display = 'none';
        this.initializeQuiz();
    }
}

// Initialize the quiz when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const quiz = new Quiz(quizData);
});



document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('medicineSearch');
    const searchButton = document.querySelector('.search-container button');
    const resultItems = document.querySelectorAll('.result-item');

    function filterResults() {
        const query = searchInput.value.toLowerCase();
        resultItems.forEach(item => {
            const medicineName = item.querySelector('h5').textContent.toLowerCase();
            if (medicineName.includes(query)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    searchButton.addEventListener('click', filterResults);
    searchInput.addEventListener('keyup', filterResults);
});

// Testing Simulation Functions
let currentStep = 1;
const totalSteps = 5;

function updateStepIndicators() {
    document.querySelectorAll('.step-indicator').forEach(indicator => {
        const step = parseInt(indicator.dataset.step);
        if (step === currentStep) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

function updateNavigationButtons() {
    const prevButton = document.querySelector('.simulation-navigation button:first-child');
    const nextButton = document.querySelector('.simulation-navigation button:last-child');
    
    prevButton.disabled = currentStep === 1;
    nextButton.textContent = currentStep === totalSteps ? 'Finish' : 'Next';
}

function showStep(step) {
    document.querySelectorAll('.simulation-step').forEach(stepElement => {
        stepElement.style.display = 'none';
    });
    document.querySelector(`.simulation-step[data-step="${step}"]`).style.display = 'block';
}

function nextStep() {
    if (currentStep < totalSteps) {
        currentStep++;
        updateStepIndicators();
        updateNavigationButtons();
        showStep(currentStep);
    }
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStepIndicators();
        updateNavigationButtons();
        showStep(currentStep);
    }
}

function signNotification() {
    const button = document.querySelector('.interactive-element button');
    button.innerHTML = '<i class="bi bi-check-circle-fill"></i> Signed';
    button.classList.remove('btn-primary');
    button.classList.add('btn-success');
    button.disabled = true;
    
    // Enable next step after signing
    setTimeout(() => {
        nextStep();
    }, 1000);
}

// Initialize simulation
document.addEventListener('DOMContentLoaded', () => {
    updateStepIndicators();
    updateNavigationButtons();
    showStep(1);
});


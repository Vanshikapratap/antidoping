const translations = {
    en: {
        home: "Home",
        education: "Education",
        testing: "Testing",
        resources: "Resources",
        login: "Login",
        protectingCleanSport: "Protecting Clean Sport",
        learnMore: "Learn More",
        // Add more translations as needed
    },
    es: {
        home: "Inicio",
        education: "Educación",
        testing: "Pruebas",
        resources: "Recursos",
        login: "Iniciar Sesión",
        protectingCleanSport: "Protegiendo el Deporte Limpio",
        learnMore: "Más Información",
        // Add more translations as needed
    },
    fr: {
        home: "Accueil",
        education: "Éducation",
        testing: "Tests",
        resources: "Ressources",
        login: "Connexion",
        protectingCleanSport: "Protéger le Sport Propre",
        learnMore: "En Savoir Plus",
        // Add more translations as needed
    },
    // Add more languages as needed
};

// Add this to your app.js or create a new translation.js file
document.addEventListener('DOMContentLoaded', function() {
    const languageSelector = document.getElementById('languageSelector');
    const currentLang = document.querySelector('.current-lang');
    
    // Function to update content based on selected language
    function updateContent(lang) {
        document.documentElement.lang = lang;
        currentLang.textContent = document.querySelector(`[data-lang="${lang}"]`).textContent;
        
        // Store the selected language in localStorage
        localStorage.setItem('selectedLanguage', lang);
        
        // Update all translatable elements
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[lang] && translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });
    }
    
    // Add click event listeners to language options
    document.querySelectorAll('[data-lang]').forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedLang = option.getAttribute('data-lang');
            updateContent(selectedLang);
        });
    });
    
    // Set initial language from localStorage or default to 'en'
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    updateContent(savedLanguage);
});

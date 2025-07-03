// Configuration
const SHECODES_API_URL = "https://api.shecodes.io/ai/v1/generate";
const API_KEY = "ob355426c418b3a40180cfef0tb03253"; // In production, use environment variables

// Main generation function
async function generateZuluContent(userPrompt) {
    try {
        // Prepare the prompt with Zulu context
        const prompt = `Translate this to isiZulu: "${userPrompt}". 
        Provide only the Zulu translation, no English. 
        Use culturally appropriate phrasing.`;
        
        const context = "You are a professional isiZulu translator. Provide accurate, natural translations.";
        
        const response = await fetch(
            `${SHECODES_API_URL}?prompt=${encodeURIComponent(prompt)}&context=${encodeURIComponent(context)}&key=${API_KEY}`
        );

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        return {
            zulu: data.answer,
            english: userPrompt, // Original English text
            note: "AI-generated translation"
        };
        
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}

// Updated generate button handler
generateBtn.addEventListener('click', async function() {
    const text = userInput.value.trim();
    
    if (!text) {
        showMessage('Please enter some English text to translate', 'error');
        return;
    }

    showMessage('Connecting to AI translator...', 'status');
    generateBtn.disabled = true;
    generateBtn.classList.add('generating');
    generateBtn.textContent = 'Translating...';

    try {
        const apiResponse = await generateZuluContent(text);
        displayResponse(apiResponse);
    } catch (error) {
        showMessage('Translation failed. Please try again.', 'error');
        console.error("Translation failed:", error);
        
        // Fallback to mock response
        const mockResponse = {
            zulu: "Hlola inguquko yesikhathi esedlule...",
            english: text,
            note: "Demo translation (API unavailable)"
        };
        displayResponse(mockResponse);
    } finally {
        generateBtn.disabled = false;
        generateBtn.classList.remove('generating');
        generateBtn.textContent = 'Generate';
    }
});
// js/script.js
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // DOM Elements
    const generateBtn = document.getElementById('generate-btn');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');
    const speakBtn = document.getElementById('speak-btn');
    const userInput = document.getElementById('user-input');
    const aiOutput = document.getElementById('ai-output');

    // Generate AI Response (Mock Function - Replace with actual API call)
    generateBtn.addEventListener('click', async function() {
        const text = userInput.value.trim();
        
        if (!text) {
            showMessage('Please enter some text to generate isiZulu content', 'error');
            return;
        }

        showMessage('Generating...', 'status');
        
        // Simulate API call delay
        generateBtn.disabled = true;
        generateBtn.textContent = 'Generating...';
        
        try {
            // In a real implementation, you would call your AI API here
            // const response = await fetchYourAIAPI(text);
            const mockResponse = generateMockResponse(text);
            
            setTimeout(() => {
                displayResponse(mockResponse);
                generateBtn.disabled = false;
                generateBtn.textContent = 'Generate';
            }, 1500);
            
        } catch (error) {
            showMessage('Error generating content. Please try again.', 'error');
            generateBtn.disabled = false;
            generateBtn.textContent = 'Generate';
            console.error('Generation error:', error);
        }
    });

    // Clear all fields
    clearBtn.addEventListener('click', function() {
        userInput.value = '';
        aiOutput.innerHTML = '<p class="placeholder-text">Your generated isiZulu content will appear here...</p>';
    });

    // Copy text to clipboard
    copyBtn.addEventListener('click', function() {
        const textToCopy = aiOutput.innerText;
        
        if (!textToCopy || aiOutput.querySelector('.placeholder-text')) {
            showMessage('Nothing to copy', 'error');
            return;
        }

        navigator.clipboard.writeText(textToCopy)
            .then(() => showMessage('Copied to clipboard!', 'success'))
            .catch(err => {
                showMessage('Failed to copy text', 'error');
                console.error('Copy error:', err);
            });
    });

    // Text-to-speech functionality
    speakBtn.addEventListener('click', function() {
        const textToSpeak = aiOutput.innerText;
        
        if (!textToSpeak || aiOutput.querySelector('.placeholder-text')) {
            showMessage('Nothing to read', 'error');
            return;
        }

        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            utterance.lang = 'zu'; // isiZulu language code
            utterance.rate = 0.9;
            speechSynthesis.speak(utterance);
        } else {
            showMessage('Text-to-speech not supported in your browser', 'error');
        }
    });

    // Helper Functions
    function displayResponse(response) {
        aiOutput.innerHTML = `
            <div class="ai-response">
                <h3>Generated isiZulu:</h3>
                <p>${response.zulu}</p>
                <div class="cultural-divider" style="margin: 1rem 0; width: 50%;"></div>
                <h3>English Translation:</h3>
                <p>${response.english}</p>
                ${response.note ? `<div class="ai-note"><strong>Note:</strong> ${response.note}</div>` : ''}
            </div>
        `;
    }

    function showMessage(message, type) {
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}`;
        messageEl.textContent = message;
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.classList.add('fade-out');
            setTimeout(() => messageEl.remove(), 500);
        }, 3000);
    }

    function generateMockResponse(input) {
        const responses = [
            {
                zulu: "Sawubona! Ngingakusiza ngani namuhla?",
                english: "Hello! How can I help you today?",
                note: "Common isiZulu greeting"
            },
            {
                zulu: "Inkanyezi yesiZulu ikhanya kakhulu namuhla.",
                english: "The Zulu star shines brightly today.",
                note: "Poetic expression"
            },
            {
                zulu: "Ungakwazi ukufunda isiZulu ngokuzikhandla.",
                english: "You can learn isiZulu with dedication.",
                note: "Encouraging phrase"
            }
        ];
        
        // Simple mock response based on input length
        const randomIndex = input.length % responses.length;
        return responses[randomIndex];
    }
});
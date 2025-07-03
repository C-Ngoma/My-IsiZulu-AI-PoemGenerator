document.addEventListener('DOMContentLoaded', function() {
    // Constants
    const API_KEY = "ob355426c418b3a40180cfef0tb03253";
    
    // DOM Elements
    const generateBtn = document.getElementById('generate-btn');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');
    const speakBtn = document.getElementById('speak-btn');
    const userInput = document.getElementById('user-input');
    const aiOutput = document.getElementById('ai-output');
    const modeSwitch = document.getElementById('mode-switch');
    const modeLabel = document.getElementById('mode-label');

    // State
    let currentMode = 'translate'; // 'translate' or 'poem'

    // Initialize
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Mode Switching
    modeSwitch.addEventListener('change', function() {
        currentMode = this.checked ? 'poem' : 'translate';
        modeLabel.textContent = this.checked ? 'Poem Mode' : 'Translate Mode';
        userInput.placeholder = this.checked 
            ? 'Enter a topic (e.g. Flower, Love)' 
            : 'Enter English text to translate';
    });

    // Generate Functionality
    generateBtn.addEventListener('click', async function() {
        const text = userInput.value.trim();
        
        if (!text) {
            showMessage('Please enter some text', 'error');
            return;
        }

        generateBtn.disabled = true;
        generateBtn.textContent = 'Generating...';
        aiOutput.innerHTML = '<p class="status-message">Generating content...</p>';

        try {
            let response;
            if (currentMode === 'translate') {
                response = await generateTranslation(text);
            } else {
                response = await generatePoem(text);
            }
            displayResponse(response);
        } catch (error) {
            showMessage('Error generating content', 'error');
            console.error('Generation error:', error);
        } finally {
            generateBtn.disabled = false;
            generateBtn.textContent = 'Generate';
        }
    });

    // API Functions
    async function generateTranslation(text) {
        const prompt = `Translate this to isiZulu: "${text}". Provide only the Zulu translation.`;
        const apiUrl = `https://api.shecodes.io/ai/v1/generate?prompt=${encodeURIComponent(prompt)}&key=${API_KEY}`;
        
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        return {
            type: 'translation',
            original: text,
            zulu: data.answer,
            note: 'AI-generated translation'
        };
    }

    async function generatePoem(topic) {
        const prompt = `Create a 4-line isiZulu poem about ${topic}. 
        Use traditional Zulu poetic style with nature imagery. 
        Provide ONLY the poem in isiZulu.`;
        
        const response = await fetch(
            `https://api.shecodes.io/ai/v1/generate?prompt=${encodeURIComponent(prompt)}&key=${API_KEY}`
        );
        const data = await response.json();
        
        return {
            type: 'poem',
            topic: topic,
            content: data.answer,
            note: 'AI-generated poem'
        };
    }

    // Display Functions
    function displayResponse(response) {
        if (response.type === 'translation') {
            aiOutput.innerHTML = `
                <div class="translation-result">
                    <h3>Translation Result</h3>
                    <p><strong>Original:</strong> ${response.original}</p>
                    <p><strong>isiZulu:</strong> ${response.zulu}</p>
                    ${response.note ? `<p class="note">${response.note}</p>` : ''}
                </div>
            `;
        } else {
            aiOutput.innerHTML = `
                <div class="poem-result">
                    <h3>${response.topic}</h3>
                    <div class="poem">
                        ${response.content.split('\n').map(line => `<p>${line}</p>`).join('')}
                    </div>
                    <p class="signature">SheCodes AI</p>
                </div>
            `;
        }
    }

    // Existing Helper Functions (keep these unchanged)
    function showMessage(message, type) {
        // ... (your existing showMessage implementation)
    }

    // Clear all fields
    clearBtn.addEventListener('click', function() {
        userInput.value = '';
        aiOutput.innerHTML = '<p class="placeholder-text">Your generated content will appear here...</p>';
    });

    // Copy text to clipboard
    copyBtn.addEventListener('click', function() {
        // ... (your existing copy functionality)
    });

    // Text-to-speech functionality
    speakBtn.addEventListener('click', function() {
        // ... (your existing TTS functionality)
    });
});
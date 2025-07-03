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
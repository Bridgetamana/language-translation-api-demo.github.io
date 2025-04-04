
document.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.getElementById('mainContainer');
    const errorContainer = document.getElementById('errorContainer');
    const sourceText = document.getElementById('sourceText');
    const detectButton = document.getElementById('detectButton');
    const detectedLanguages = document.getElementById('detectedLanguages');
    const targetLanguage = document.getElementById('targetLanguage');
    const translateButton = document.getElementById('translateButton');
    const translationResult = document.getElementById('translationResult');

    let detectedSourceLanguage = '';

    // Check if APIs are supported
    function checkApiSupport() {
        if (!('ai' in window) ||
            !('translator' in window.ai) ||
            !('languageDetector' in window.ai)) {
            mainContainer.classList.add('hidden');
            errorContainer.classList.remove('hidden');
            return false;
        }
        return true;
    }
    async function detectLanguage() {
        const text = sourceText.value.trim();

        if (!text) {
            alert('Please enter some text to detect.');
            return;
        }

        try {
            const detector = await window.ai.languageDetector.create();
            await detector.ready;

            const results = await detector.detect(text);

            if (results && results.length > 0) {
                detectedSourceLanguage = results[0].detectedLanguage;
                const langName = getLanguageName(detectedSourceLanguage);
                const confidence = (results[0].confidence * 100).toFixed(0);

                detectedLanguages.textContent = `${langName} (${confidence}%)`;
                translateButton.disabled = false;
            } else {
                detectedLanguages.textContent = 'Could not detect language';
            }
        } catch (error) {
            console.error('Detection error:', error);
            detectedLanguages.textContent = 'Error detecting language';
        }
    }
    async function translateText() {
        const text = sourceText.value.trim();
        const target = targetLanguage.value;

        if (!text || !detectedSourceLanguage) {
            return;
        }

        try {
            const translator = await window.ai.translator.create({
                sourceLanguage: detectedSourceLanguage,
                targetLanguage: target
            });

            const result = await translator.translate(text);
            translationResult.textContent = result;
        } catch (error) {
            console.error('Translation error:', error);
            translationResult.textContent = `Translation error: ${error}`;
        }
    }

    function getLanguageName(code) {
        const languages = {
            'en': 'English',
            'es': 'Spanish',
            'fr': 'French',
            'de': 'German',
        };

        return languages[code] || code;
    }

    detectButton.addEventListener('click', detectLanguage);
    translateButton.addEventListener('click', translateText);
    checkApiSupport();
});
// UT-Assistant Portal - Main JavaScript

// Base URL for Understand Tech assistants
const UT_BASE_URL = 'https://app.understand.tech/';

/**
 * Build assistant URL with API key and model ID
 */
function buildAssistantUrl(apiKey, modelId) {
    const url = new URL(UT_BASE_URL);
    url.searchParams.set('api_key', apiKey);
    url.searchParams.set('model_id', modelId);
    return url.toString();
}

/**
 * Create assistant card HTML
 */
function createAssistantCard(assistant) {
    const assistantUrl = buildAssistantUrl(assistant.api_key, assistant.model_id);

    return `
        <div class="assistant-card" data-assistant-id="${assistant.id}">
            <div class="assistant-icon">${assistant.icon}</div>
            <h2>${assistant.name}</h2>
            <p class="description">${assistant.description}</p>
            <div class="team-badge">Team: ${assistant.team}</div>
            <a href="${assistantUrl}"
               target="_blank"
               rel="noopener noreferrer"
               class="launch-button"
               onclick="trackAssistantLaunch('${assistant.id}', '${assistant.name}')">
                Launch Assistant →
            </a>
        </div>
    `;
}

/**
 * Load assistants from config.json
 */
async function loadAssistants() {
    const gridElement = document.getElementById('assistants-grid');

    try {
        const response = await fetch('config.json');

        if (!response.ok) {
            throw new Error(`Failed to load configuration: ${response.status}`);
        }

        const config = await response.json();

        if (!config.assistants || config.assistants.length === 0) {
            throw new Error('No assistants configured');
        }

        // Clear loading state
        gridElement.innerHTML = '';

        // Create cards for each assistant
        config.assistants.forEach((assistant, index) => {
            const cardHtml = createAssistantCard(assistant);
            const cardElement = document.createElement('div');
            cardElement.innerHTML = cardHtml;
            cardElement.firstElementChild.style.animationDelay = `${index * 0.1}s`;
            gridElement.appendChild(cardElement.firstElementChild);
        });

        console.log(`✅ Loaded ${config.assistants.length} assistant(s)`);

    } catch (error) {
        console.error('❌ Error loading assistants:', error);
        gridElement.innerHTML = `
            <div class="error">
                <h2>⚠️ Unable to load assistants</h2>
                <p>${error.message}</p>
                <p>Please check the configuration and try again.</p>
            </div>
        `;
    }
}

/**
 * Track assistant launches (for analytics/debugging)
 */
function trackAssistantLaunch(assistantId, assistantName) {
    console.log(`🚀 Launching assistant: ${assistantName} (${assistantId})`);

    // Optional: Add analytics tracking here
    // Example: gtag('event', 'assistant_launch', { assistant_id: assistantId });
}

/**
 * Initialize the application
 */
function init() {
    console.log('🎯 UT-Assistant Portal initialized');
    loadAssistants();
}

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('.step');
    let currentStep = 1;
    
    const egregorData = {
        name: '',
        intent: '',
        emotion: '',
        archetype: '',
        force: ''
    };

    const showStep = (stepNumber) => {
        steps.forEach(step => step.classList.remove('active'));
        const nextStep = document.getElementById(`step-${stepNumber}`);
        if (nextStep) {
            nextStep.classList.add('active');
            currentStep = stepNumber;
        } else {
             // Fallback to a valid step if something goes wrong
            document.getElementById('step-1-intro').classList.add('active');
            currentStep = 1;
        }
    };

    // Navigation
    document.getElementById('begin-button').addEventListener('click', () => showStep('2-identity'));
    document.getElementById('next-to-components').addEventListener('click', () => {
        egregorData.name = document.getElementById('egregor-name').value;
        egregorData.intent = document.getElementById('egregor-intent').value;
        
        if(!egregorData.name || !egregorData.intent) {
            alert('Please provide a Name and Intent for your construct.');
            return;
        }
        showStep('3-components');
    });

    document.getElementById('generate-button').addEventListener('click', async () => {
        egregorData.emotion = document.getElementById('egregor-emotion').value;
        egregorData.archetype = document.getElementById('egregor-archetype').value;
        egregorData.force = document.getElementById('egregor-force').value;
        
        showStep('4-generation');

        try {
            // Construct prompts
            const sigilPrompt = `A luminous, intricate, sacred geometry sigil representing the concept of "${egregorData.intent}". It embodies the emotion of ${egregorData.emotion} and the archetype of ${egregorData.archetype}, charged with the elemental force of ${egregorData.force}. The style is a mix of futuristic digital art and ancient mystical symbols, glowing with ethereal light on a dark, cosmic background. Centered, circular, complex design.`;
            const invocationPrompt = `A mystical, resonant, mantric chant for invoking an entity of ${egregorData.emotion} and ${egregorData.archetype}. The sound should have a deep humming drone, layered with ethereal, bell-like tones and a gentle, rhythmic, whispered vocalization of abstract, powerful syllables. It should feel both ancient and futuristic, evoking a sense of calm power and focused intention.`;

            // Generate assets
            const [sigilAsset, invocationAsset] = await Promise.all([
                game.assets.generate({
                    type: "image",
                    prompt: sigilPrompt,
                    asset_name: "egregor_sigil.png",
                    aspect: "square",
                    transparent: false
                }),
                game.assets.generate({
                    type: "sound",
                    prompt: invocationPrompt,
                    asset_name: "egregor_invocation.mp3",
                    duration_seconds: 15
                })
            ]);

            // Populate the chamber
            document.getElementById('chamber-title').textContent = egregorData.name;
            document.getElementById('chamber-intent').textContent = egregorData.intent;
            document.getElementById('egregor-sigil').src = sigilAsset.url;
            document.getElementById('egregor-invocation').src = invocationAsset.url;
            
            const componentsContainer = document.getElementById('chamber-components');
            componentsContainer.innerHTML = `
                <p><strong>Emotion:</strong> ${egregorData.emotion}</p>
                <p><strong>Archetype:</strong> ${egregorData.archetype}</p>
                <p><strong>Force:</strong> ${egregorData.force}</p>
            `;
            
            showStep('5-chamber');

        } catch (error) {
            console.error("Error during Egregor synthesis:", error);
            alert("The synthesis failed. The aether is unstable. Please try again.");
            // Reset to the beginning or the form
            showStep('2-identity');
        }
    });
    
    document.getElementById('create-new-button').addEventListener('click', () => {
        // Reset form fields
        document.getElementById('egregor-name').value = '';
        document.getElementById('egregor-intent').value = '';
        document.getElementById('egregor-emotion').selectedIndex = 0;
        document.getElementById('egregor-archetype').selectedIndex = 0;
        document.getElementById('egregor-force').selectedIndex = 0;
        document.getElementById('journal').value = '';
        
        showStep('1-intro');
    });

    // Initialize with the first step
    showStep('1-intro');
});

// A simple polyfill for game.assets for local testing if needed
if (typeof game === 'undefined') {
    console.warn("`game.assets` not found. Using mock data for local development.");
    window.game = {
        assets: {
            generate: async ({ type, asset_name }) => {
                await new Promise(resolve => setTimeout(resolve, 2000));
                if (type === 'image') {
                    return { url: 'https://picsum.photos/300' };
                }
                if (type === 'sound') {
                    return { url: 'https://open.spotify.com/intl-es/artist/0HOGJNckuSAagDoMGVaI0h?si=nsxJl7hNRwiA_-6vgUB9hg' };
                }
            }
        }
    };
}


document.addEventListener('DOMContentLoaded', () => {
    const simulator = new GridSimulator('grid-container', 'generated-css', 'controls-container');
    
    // UI Elements
    const navItems = document.querySelectorAll('.nav-item');
    const topicTitle = document.getElementById('topic-title');
    const topicDescription = document.getElementById('topic-description');
    const topicExplanation = document.getElementById('topic-explanation');
    const copyBtn = document.getElementById('copy-code');

    // Navigation logic
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const topicKey = item.getAttribute('data-topic');
            
            // Update UI active state
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Load Content
            const topic = topics[topicKey];
            topicTitle.textContent = topic.title;
            topicDescription.textContent = topic.description;
            topicExplanation.innerHTML = topic.explanation;

            // Load Simulator
            simulator.loadTopic(topicKey);
        });
    });

    // Copy Code functionality
    copyBtn.addEventListener('click', () => {
        const code = document.getElementById('generated-css').textContent;
        navigator.clipboard.writeText(code).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copiado!';
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        });
    });

    // Initialize with first topic
    simulator.loadTopic('intro');
    topicExplanation.innerHTML = topics['intro'].explanation;
});
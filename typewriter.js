// Typewriter effect function for hero text
function typeText(element, text, speed = 50, showCursor = false) {
    return new Promise((resolve) => {
        let index = 0;
        element.textContent = '';
        
        function type() {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, speed);
            } else {
                // Add cursor only if requested
                if (showCursor) {
                    const cursor = document.createElement('span');
                    cursor.className = 'typewriter-cursor';
                    cursor.textContent = '_';
                    element.appendChild(cursor);
                }
                resolve();
            }
        }
        
        type();
    });
}

// Initialize typewriter effect on page load
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.getElementById('hero-title');
    const heroSubtitle = document.getElementById('hero-subtitle');
    
    if (heroTitle && heroSubtitle) {
        typeText(heroTitle, 'EXPLORING THE FRONTIERS OF NEUROSCIENCE', 40, false)
            .then(() => {
                return typeText(heroSubtitle, 'Oxford\'s Premier Neuroscience Society - Where Minds Meet to Unravel the Mysteries of the Brain', 20, true);
            });
    }
});


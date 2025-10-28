// Dynamic content loader for Cortex Club website
async function loadSection(sectionName) {
    try {
        const response = await fetch(`sections/${sectionName}.html`);
        const html = await response.text();
        
        // Remove existing section if it exists
        const existingSection = document.getElementById(sectionName);
        if (existingSection) {
            existingSection.remove();
        }
        
        // Create temporary div to parse the HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const section = tempDiv.querySelector('section');
        
        if (section) {
            // Insert into content container
            const container = document.getElementById('content-container');
            if (container) {
                container.appendChild(section);
            } else {
                // Fallback: insert after hero
                const hero = document.querySelector('.hero');
                if (hero) {
                    hero.parentNode.insertBefore(section, hero.nextSibling);
                }
            }
        }
    } catch (error) {
        console.error(`Failed to load section: ${sectionName}`, error);
    }
}

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

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Load all sections from their separate files
    const sections = ['about', 'events', 'news', 'committee', 'contact'];
    
    sections.forEach(section => {
        loadSection(section);
    });
    
    // Start typing effect for hero text
    const heroTitle = document.getElementById('hero-title');
    const heroSubtitle = document.getElementById('hero-subtitle');
    
    if (heroTitle) {
        typeText(heroTitle, 'EXPLORING THE FRONTIERS OF NEUROSCIENCE', 40, false)
            .then(() => {
                if (heroSubtitle) {
                    return typeText(heroSubtitle, 'Oxford\'s Premier Neuroscience Society - Where Minds Meet to Unravel the Mysteries of the Brain', 20, true);
                }
            });
    }
});

// Smooth scroll handler for anchor links
document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (link && link.getAttribute('href') !== '#') {
        e.preventDefault();
        const target = link.getAttribute('href').slice(1); // Remove #
        
        const section = document.getElementById(target);
        if (section) {
            section.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    }
});

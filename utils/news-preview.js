// News Preview Loader for Homepage
// Loads and displays the 2 most recent news items on index.html

// Format date from YYYY-MM-DD to "MON DD, YYYY"
function formatDate(dateString) {
    const date = new Date(dateString);
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
}

// Load and display 2 most recent news items
async function loadNewsPreview() {
    try {
        // Load the index.json to get list of all news files
        const indexResponse = await fetch('news/json/index.json');
        const indexData = await indexResponse.json();
        
        // Load all news files listed in index.json
        const promises = indexData.news.map(filename => 
            fetch(`news/json/${filename}`)
                .then(response => response.json())
                .catch(error => console.error(`Failed to load ${filename}:`, error))
        );

        const results = await Promise.all(promises);
        let allNews = results.filter(news => news !== undefined);
        
        // Sort news by date (newest first)
        allNews.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Take only the 2 most recent
        const recentNews = allNews.slice(0, 2);
        
        // Render the news preview
        const grid = document.getElementById('newsPreviewGrid');
        if (!grid) return;

        grid.innerHTML = '';

        recentNews.forEach(news => {
            const card = document.createElement('div');
            card.className = 'news-card';
            
            // Determine Read More link
            let readMoreLink = null;
            if (news.readmore && news.readmore !== null) {
                readMoreLink = `news/html/${news.readmore}`;
            } else if (news.link && news.link !== '#' && news.link !== null) {
                readMoreLink = news.link;
            }
            
            const readMoreButton = readMoreLink 
                ? `<a href="${readMoreLink}" class="news-link">Read More →</a>`
                : '';
            
            card.innerHTML = `
                <div class="news-date">${formatDate(news.date)}</div>
                <h3>${news.title}</h3>
                <p>${news.description}</p>
                ${readMoreButton}
            `;
            
            grid.appendChild(card);
        });
    } catch (error) {
        console.error('Failed to load news preview:', error);
    }
}

// Load news preview when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadNewsPreview);
} else {
    loadNewsPreview();
}


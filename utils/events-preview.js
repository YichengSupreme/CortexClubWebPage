// Events Preview Loader for Homepage
// Loads and displays the 2 most recent upcoming events (or past events if no upcoming exist)

// Format date from YYYY-MM-DD to "MON DD"
function formatEventDate(dateString) {
    const date = new Date(dateString);
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    return { month, day };
}

// Load and display 2 most recent upcoming events (or past if no upcoming)
async function loadEventsPreview() {
    try {
        // Load the index.json to get list of all event files
        const indexResponse = await fetch('events/index.json');
        const indexData = await indexResponse.json();
        
        // Load all event files listed in index.json
        const promises = indexData.events.map(filename => 
            fetch(`events/${filename}`)
                .then(response => response.json())
                .catch(error => console.error(`Failed to load ${filename}:`, error))
        );

        const results = await Promise.all(promises);
        let allEvents = results.filter(event => event !== undefined);
        
        // Get today's date without time for accurate comparison
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Separate upcoming and past events
        const upcomingEvents = [];
        const pastEvents = [];
        
        allEvents.forEach(event => {
            const eventDate = new Date(event.date);
            eventDate.setHours(0, 0, 0, 0);
            
            if (eventDate >= today) {
                upcomingEvents.push(event);
            } else {
                pastEvents.push(event);
            }
        });
        
        // Sort upcoming events by date (ascending - nearest first)
        upcomingEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
        // Sort past events by date (descending - most recent first)
        pastEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Select 2 events: prioritize upcoming, fill with past if needed
        let selectedEvents = [];
        if (upcomingEvents.length >= 2) {
            selectedEvents = upcomingEvents.slice(0, 2);
        } else if (upcomingEvents.length === 1) {
            selectedEvents = [upcomingEvents[0], pastEvents[0]].filter(Boolean);
        } else {
            // No upcoming events, use 2 most recent past events
            selectedEvents = pastEvents.slice(0, 2);
        }
        
        // Render the events preview
        const grid = document.querySelector('.events-grid');
        if (!grid) return;

        grid.innerHTML = '';

        selectedEvents.forEach(event => {
            const { month, day } = formatEventDate(event.date);
            
            const card = document.createElement('div');
            card.className = 'event-card';
            
            card.innerHTML = `
                <div class="event-date">
                    <span class="date-day">${day}</span>
                    <span class="date-month">${month}</span>
                </div>
                <h3>${event.title}</h3>
                <p>${event.description}</p>
            `;
            
            grid.appendChild(card);
        });
    } catch (error) {
        console.error('Failed to load events preview:', error);
    }
}

// Load events preview when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadEventsPreview);
} else {
    loadEventsPreview();
}


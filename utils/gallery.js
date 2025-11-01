// Gallery image loading and rendering

document.addEventListener('DOMContentLoaded', function() {
    const galleryGrid = document.getElementById('galleryGrid');
    const galleryFilters = document.getElementById('galleryFilters');
    if (!galleryGrid) return;

    let allImages = [];
    let currentCategory = 'all';

    async function loadGallery() {
        try {
            // Load index.json to get list of all gallery images
            const indexResponse = await fetch('../gallery/index.json');
            const indexData = await indexResponse.json();
            
            // Load all image files listed in index.json
            const promises = indexData.images.map(filename => 
                fetch(`../gallery/${filename}`)
                    .then(response => response.json())
                    .catch(error => console.error(`Failed to load ${filename}:`, error))
            );

            const results = await Promise.all(promises);
            allImages = results.filter(img => img !== undefined);
            
            // Sort images by date (newest first, oldest at bottom)
            allImages.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            setupFilters();
            filterGallery(currentCategory);
        } catch (error) {
            console.error('Failed to load gallery index:', error);
            galleryGrid.innerHTML = '<p>Unable to load gallery images.</p>';
        }
    }

    function setupFilters() {
        const filterButtons = galleryFilters.querySelectorAll('.gallery-filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Update active state
                filterButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Get category from data attribute
                currentCategory = this.getAttribute('data-category');
                filterGallery(currentCategory);
            });
        });
    }

    function filterGallery(category) {
        let filteredImages = allImages;
        
        if (category !== 'all') {
            // Normalize category to lowercase for comparison
            filteredImages = allImages.filter(image => {
                const imageCategory = (image.category || '').toLowerCase();
                return imageCategory === category.toLowerCase();
            });
        }
        
        renderGallery(filteredImages);
    }

    function renderGallery(images) {
        galleryGrid.innerHTML = '';

        if (images.length === 0) {
            galleryGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--black); opacity: 0.6;">No images in this category.</p>';
            return;
        }

        images.forEach(image => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            
            // Format date from YYYY-MM-DD to "MON DD, YYYY"
            function formatDate(dateString) {
                const date = new Date(dateString);
                const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
                const month = months[date.getMonth()];
                const day = date.getDate();
                const year = date.getFullYear();
                return `${month} ${day}, ${year}`;
            }

            galleryItem.innerHTML = `
                <div class="gallery-image-wrapper">
                    <img src="../${image.image}" alt="${image.title}" class="gallery-image" loading="lazy">
                    <div class="gallery-overlay">
                        <div class="gallery-info">
                            <h3 class="gallery-title">${image.title}</h3>
                            <div class="gallery-date">${formatDate(image.date)}</div>
                        </div>
                    </div>
                </div>
            `;
            
            galleryGrid.appendChild(galleryItem);
        });
    }

    loadGallery();
});


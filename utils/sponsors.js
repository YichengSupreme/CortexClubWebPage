// Simple sponsors display - clean layout with alternating text/image positions

document.addEventListener('DOMContentLoaded', function() {
  const sponsorsList = document.getElementById('sponsors-list');
  if (!sponsorsList) return;

  async function loadSponsors() {
    try {
      const response = await fetch('sponsors/input.json');
      const data = await response.json();
      const sponsors = data.sponsors || [];

      // Group sponsors by tier
      const tierGroups = {
        gold: [],
        silver: [],
        bronze: []
      };

      sponsors.forEach(sponsor => {
        const tier = sponsor.tier || 'bronze';
        if (tierGroups[tier]) {
          tierGroups[tier].push(sponsor);
        }
      });

      // Render sponsors by tier (gold, silver, bronze)
      const tierOrder = ['gold', 'silver', 'bronze'];
      const tierTitles = {
        gold: 'Gold Sponsors',
        silver: 'Silver Sponsors',
        bronze: 'Bronze Sponsors'
      };

      tierOrder.forEach(tier => {
        if (tierGroups[tier].length === 0) return;

        // Create tier group with tier-specific class
        const tierGroup = document.createElement('section');
        tierGroup.className = `sponsor-tier-group ${tier}-group section-${tier}`;

        // Tier title
        const tierTitle = document.createElement('h3');
        tierTitle.className = 'sponsor-tier-title';
        tierTitle.textContent = tierTitles[tier];
        tierGroup.appendChild(tierTitle);

        // Create grid container for sponsors (below title)
        const sponsorGrid = document.createElement('div');
        sponsorGrid.className = 'sponsor-grid';

        // Add sponsors with tier-specific layout
        tierGroups[tier].forEach((sponsor, index) => {
          const sponsorItem = document.createElement('div');
          sponsorItem.className = `sponsor-item sponsor-${tier}`;

          // Logo on top
          const logoSide = document.createElement('div');
          logoSide.className = 'sponsor-logo-wrapper';
          const logoImg = document.createElement('img');
          logoImg.src = sponsor.logo;
          logoImg.alt = sponsor.id;
          logoSide.appendChild(logoImg);
          sponsorItem.appendChild(logoSide);

          // Text below logo
          const textSide = document.createElement('div');
          textSide.className = 'sponsor-text';
          const sponsorName = document.createElement('div');
          sponsorName.className = 'sponsor-name';
          sponsorName.textContent = sponsor.description || sponsor.id.toUpperCase().replace(/-/g, ' ');
          textSide.appendChild(sponsorName);
          sponsorItem.appendChild(textSide);

          sponsorGrid.appendChild(sponsorItem);
        });

        // Add grid after title
        tierGroup.appendChild(sponsorGrid);

        sponsorsList.appendChild(tierGroup);
      });

    } catch (error) {
      console.error('Error loading sponsors:', error);
      sponsorsList.innerHTML = '<p>Unable to load sponsors.</p>';
    }
  }

  loadSponsors();
});


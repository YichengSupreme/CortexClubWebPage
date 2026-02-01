// Simple sponsors display - clean layout with alternating text/image positions

document.addEventListener('DOMContentLoaded', function() {
  const sponsorsList = document.getElementById('sponsors-list');
  if (!sponsorsList) return;

  async function loadSponsors() {
    try {
      const response = await fetch('sponsors/input.json');
      const data = await response.json();
      const sponsors = data.sponsors || [];

      // Sort sponsors by tier: gold first, then silver, then bronze
      const tierOrder = { gold: 1, silver: 2, bronze: 3 };
      const sortedSponsors = sponsors.sort((a, b) => {
        const tierA = tierOrder[a.tier] || 3;
        const tierB = tierOrder[b.tier] || 3;
        return tierA - tierB;
      });

      // Create single grid container for all sponsors
      const tierGroup = document.createElement('section');
      tierGroup.className = 'sponsor-tier-group';

      const sponsorGrid = document.createElement('div');
      sponsorGrid.className = 'sponsor-grid';

      // Add all sponsors to the same grid
      sortedSponsors.forEach((sponsor) => {
        const tier = sponsor.tier || 'bronze';
        const sponsorItem = document.createElement('div');
        sponsorItem.className = `sponsor-item sponsor-${tier}`;

        // Tier badge in top left
        const tierBadge = document.createElement('div');
        tierBadge.className = 'sponsor-tier-badge';
        tierBadge.textContent = tier.toUpperCase();
        sponsorItem.appendChild(tierBadge);

        // Logo wrapper with uniform card
        const logoSide = document.createElement('div');
        logoSide.className = 'sponsor-logo-wrapper';
        const logoImg = document.createElement('img');
        logoImg.src = sponsor.logo;
        logoImg.alt = sponsor.id;
        logoSide.appendChild(logoImg);
        sponsorItem.appendChild(logoSide);

        sponsorGrid.appendChild(sponsorItem);
      });

      tierGroup.appendChild(sponsorGrid);
      sponsorsList.appendChild(tierGroup);

    } catch (error) {
      console.error('Error loading sponsors:', error);
      sponsorsList.innerHTML = '<p>Unable to load sponsors.</p>';
    }
  }

  loadSponsors();
});


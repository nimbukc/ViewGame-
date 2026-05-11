let currentTeam = null;
let statsChart = null;

window.onload = function() {
  loadMatches();
  loadFavorites();
};

function searchTeam() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  if (!input) return alert('Please enter a team name');

  fetch('/api/standings')
    .then(res => res.json())
    .then(data => {
      const team = data.find(t => t.teamName.toLowerCase().includes(input));
      if (!team) return alert('Team not found. Try Bayern or Dortmund');
      currentTeam = team;
      displayTeamStats(team);
    });
}

function displayTeamStats(team) {
  document.getElementById('teamName').textContent = team.teamName;
  document.getElementById('teamPoints').textContent = team.points;
  document.getElementById('teamWins').textContent = team.won;
  document.getElementById('teamLosses').textContent = team.lost;
  document.getElementById('teamDraws').textContent = team.draw;
  document.getElementById('teamGoals').textContent = team.goals;
  document.getElementById('teamConceded').textContent = team.opponentGoals;
  document.getElementById('teamStats').classList.remove('hidden');
  drawChart(team);
}

function drawChart(team) {
  const ctx = document.getElementById('statsChart').getContext('2d');
  if (statsChart) statsChart.destroy();
  statsChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Wins', 'Losses', 'Draws', 'Goals', 'Conceded'],
      datasets: [{
        label: team.teamName,
        data: [team.won, team.lost, team.draw, team.goals, team.opponentGoals],
        backgroundColor: ['#1a1a2e', '#e74c3c', '#f0a500', '#2ecc71', '#e67e22']
      }]
    }
  });
}

function loadMatches() {
  fetch('/api/matches')
    .then(res => res.json())
    .then(data => {
      const slider = document.getElementById('matchSlider');
      const recent = data.slice(-10).reverse();

      recent.forEach(match => {
        const score = match.matchResults.length > 0
          ? `${match.matchResults[0].pointsTeam1} - ${match.matchResults[0].pointsTeam2}`
          : 'TBD';

        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.innerHTML = `
          <p><strong>${match.team1.teamName}</strong> vs <strong>${match.team2.teamName}</strong></p>
          <p>Score: ${score}</p>
        `;

        /* Click on match card to search that team */
        slide.onclick = function() {
          document.getElementById('searchInput').value = match.team1.teamName;
          searchTeam();
          window.scrollTo(0, 0);
        };

        slider.appendChild(slide);
      });

      new Swiper('.swiper', {
        slidesPerView: 3,
        spaceBetween: 20,
        pagination: { el: '.swiper-pagination', clickable: true }
      });
    });
}

function saveFavorite() {
  if (!currentTeam) return;
  fetch('/api/favorites', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ team_name: currentTeam.teamName })
  })
  .then(res => res.json())
  .then(() => loadFavorites());
}

function loadFavorites() {
  fetch('/api/favorites')
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById('favoritesList');
      list.innerHTML = '';
      data.forEach(fav => {
        const tag = document.createElement('div');
        tag.className = 'favorite-tag';
        tag.textContent = fav.team_name;
        list.appendChild(tag);
      });
    });
}
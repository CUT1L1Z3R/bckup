// TMDB API configuration
const TMDB_API_KEY = 'e79515e88dfd7d9f6eeca36e49101ac2';
const TV_SHOW_ID = 60735; // The Flash

// DOM Elements
const seasonSelect = document.getElementById('season-select');
const seasonEpCount = document.getElementById('season-ep-count');
const episodeList = document.getElementById('episode-list');
const playerIframe = document.getElementById('player-iframe');
const playBtn = document.getElementById('play-btn');
const seasonDropdown = document.getElementById('season-dropdown');
const seasonDropdownBtn = document.getElementById('season-dropdown-btn');

// State
let selectedSeason = 1;
let selectedEpisode = 1;
let seasons = [];

// Initialize the application
async function initApp() {
  try {
    // Get TV show details including seasons
    await fetchShowDetails();

    // Set up event listeners
    setupEventListeners();

    // Load the first season episodes by default
    await loadEpisodesForSeason(selectedSeason);

    // Update the player to start with first episode
    updatePlayer();
  } catch (error) {
    console.error('Error initializing the app:', error);
    episodeList.innerHTML = '<div class="error-message">Error loading data. Please try again later.</div>';
  }
}

// Fetch show details including seasons
async function fetchShowDetails() {
  const response = await fetch(`https://api.themoviedb.org/3/tv/${TV_SHOW_ID}?api_key=${TMDB_API_KEY}&language=en-US`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`TMDB API error: ${data.status_message}`);
  }

  seasons = data.seasons.filter(season => season.season_number > 0);
  renderSeasonDropdown();
}

// Fetch episodes for a specific season
async function fetchEpisodesForSeason(seasonNumber) {
  const response = await fetch(`https://api.themoviedb.org/3/tv/${TV_SHOW_ID}/season/${seasonNumber}?api_key=${TMDB_API_KEY}&language=en-US`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`TMDB API error: ${data.status_message}`);
  }

  return data.episodes;
}

// Render season dropdown menu
function renderSeasonDropdown() {
  if (!seasonDropdown) return;

  // Create the dropdown button content
  const selectedSeasonInfo = seasons.find(s => s.season_number === selectedSeason);
  const episodeCount = selectedSeasonInfo ? selectedSeasonInfo.episode_count : 0;
  const btnText = `Season ${selectedSeason} (${episodeCount} Episodes)`;

  if (seasonDropdownBtn) {
    seasonDropdownBtn.textContent = btnText;
  }

  // Create the dropdown content
  let dropdownHTML = '';
  seasons.forEach(season => {
    const isSelected = season.season_number === selectedSeason;
    dropdownHTML += `
      <div class="season-option ${isSelected ? 'selected' : ''}"
           data-season="${season.season_number}">
        Season ${season.season_number} (${season.episode_count} Episodes)
      </div>
    `;
  });

  seasonDropdown.innerHTML = dropdownHTML;
}

// Load episodes for a specific season
async function loadEpisodesForSeason(seasonNumber) {
  try {
    episodeList.innerHTML = '<div class="loading">Loading episodes...</div>';

    const episodes = await fetchEpisodesForSeason(seasonNumber);
    selectedSeason = seasonNumber;
    selectedEpisode = 1; // Reset to first episode when changing seasons

    renderSeasonDropdown();
    renderEpisodes(episodes);
  } catch (error) {
    console.error('Error loading episodes:', error);
    episodeList.innerHTML = '<div class="error-message">Error loading episodes. Please try again later.</div>';
  }
}

// Render episodes list
function renderEpisodes(episodes) {
  if (!episodeList) return;

  episodeList.innerHTML = '';

  episodes.forEach(ep => {
    const isSelected = ep.episode_number === selectedEpisode;
    const imgPath = ep.still_path
      ? `https://image.tmdb.org/t/p/w300${ep.still_path}`
      : 'https://via.placeholder.com/300x170?text=No+Image';

    const card = document.createElement('div');
    card.className = `episode-card ${isSelected ? 'selected' : ''}`;
    card.dataset.episode = ep.episode_number;
    card.tabIndex = 0;

    card.innerHTML = `
      <div class="episode-number">${ep.episode_number}</div>
      <img class="episode-thumb" src="${imgPath}" alt="Episode ${ep.episode_number}">
      <div class="episode-info">
        <div class="episode-title">${ep.name}</div>
        <div class="episode-desc">${ep.overview || 'No description available.'}</div>
      </div>
    `;

    card.addEventListener('click', () => selectEpisode(ep.episode_number));
    card.addEventListener('keypress', e => {
      if (e.key === 'Enter') selectEpisode(ep.episode_number);
    });

    episodeList.appendChild(card);
  });

  // Update the season episodes count display
  if (seasonEpCount) {
    seasonEpCount.textContent = `(${episodes.length} Episodes)`;
  }
}

// Select an episode
function selectEpisode(episodeNumber) {
  selectedEpisode = episodeNumber;
  updatePlayer();

  // Update the UI to show the selected episode
  const cards = episodeList.querySelectorAll('.episode-card');
  cards.forEach(card => {
    if (parseInt(card.dataset.episode) === episodeNumber) {
      card.classList.add('selected');
    } else {
      card.classList.remove('selected');
    }
  });
}

// Select a season
async function selectSeason(seasonNumber) {
  if (seasonNumber === selectedSeason) return;

  await loadEpisodesForSeason(seasonNumber);
  updatePlayer();

  // Close the dropdown after selection
  if (seasonDropdown) {
    seasonDropdown.classList.remove('open');
  }
}

// Update the video player
function updatePlayer() {
  if (!playerIframe) return;

  // Update the iframe source to match the selected season and episode
  playerIframe.src = `https://vidsrc.cc/v2/embed/tv/${TV_SHOW_ID}/${selectedSeason}-${selectedEpisode}`;

  // Update the play button text
  if (playBtn) {
    playBtn.textContent = `► Play S${selectedSeason}E${selectedEpisode}`;
  }
}

// Toggle the season dropdown visibility
function toggleSeasonDropdown() {
  if (!seasonDropdown) return;
  seasonDropdown.classList.toggle('open');
}

// Setup event listeners
function setupEventListeners() {
  // Season dropdown button click
  if (seasonDropdownBtn) {
    seasonDropdownBtn.addEventListener('click', toggleSeasonDropdown);
  }

  // Season option click
  if (seasonDropdown) {
    seasonDropdown.addEventListener('click', event => {
      const option = event.target.closest('.season-option');
      if (option) {
        const seasonNumber = parseInt(option.dataset.season);
        selectSeason(seasonNumber);
      }
    });
  }

  // Legacy season select (if used)
  if (seasonSelect) {
    seasonSelect.addEventListener('change', e => {
      selectSeason(Number(e.target.value));
    });
  }

  // Play button click
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      document.getElementById('video-player-container').scrollIntoView({ behavior: 'smooth' });
      updatePlayer();
    });
  }

  // Close dropdown when clicking outside
  document.addEventListener('click', event => {
    if (seasonDropdown && seasonDropdown.classList.contains('open') &&
        !event.target.closest('#season-dropdown') &&
        !event.target.closest('#season-dropdown-btn')) {
      seasonDropdown.classList.remove('open');
    }
  });
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

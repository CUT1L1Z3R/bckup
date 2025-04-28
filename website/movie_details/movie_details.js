// Selecting the logo element and adding a click event listener to navigate to the homepage
const logo = document.querySelector('.logo');
logo.addEventListener('click', () => {
    window.location.href = '../index.html';
});

// Selecting various elements on the page for displaying movie details
const movieTitle = document.getElementById('movieTitle');
const moviePoster = document.getElementById('moviePoster');
const movieYear = document.getElementById('movieYear');
const rating = document.getElementById('rating');
const genre = document.getElementById('genre');
const plot = document.getElementById("plot");
const language = document.getElementById("language");
const iframe = document.getElementById("iframe");
const watchListBtn = document.querySelector('.watchListBtn');
const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

// API key for TMDB API
const api_Key = 'e79515e88dfd7d9f6eeca36e49101ac2';

// DOM Elements
const seasonSelect = document.getElementById('season-select');
const seasonEpCount = document.getElementById('season-ep-count');
const episodeList = document.getElementById('episode-list');
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

  // Update the iframe source to match the selected season and episode
  playerIframe.src = `https://vidsrc.cc/v2/embed/tv/${TV_SHOW_ID}/${selectedSeason}-${selectedEpisode}`;

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

// Retrieve the TMDb ID and Media from the URL parameter
const params = new URLSearchParams(window.location.search);
const id = params.get('id');
const media = params.get("media");

// Function to fetch detailed information using its TMDb ID
async function fetchMovieDetails(id) {
    const response = await fetch(`https://api.themoviedb.org/3/${media}/${id}?api_key=${api_Key}`);
    const data = await response.json();
    return data;
}

// Function to fetch video details (trailers) for a movie or TV show
async function fetchVideoDetails(id) {
    const response = await fetch(`https://api.themoviedb.org/3/${media}/${id}/videos?api_key=${api_Key}`);
    const data = await response.json();
    return data.results;
}

document.getElementById('change-server-btn').addEventListener('click', () => {
    const serverSelector = document.getElementById('server-selector');
    serverSelector.style.display = (serverSelector.style.display === 'block') ? 'none' : 'block';
});

document.getElementById('server-selector').addEventListener('click', (e) => {
  if (e.target !== document.getElementById('server')) {
    document.getElementById('server-selector').style.display = 'none';
  }
});

document.getElementById('server').addEventListener('change', () => {
    changeServer();
    document.getElementById('server-selector').style.display = 'none'; // Hide dropdown after selection
});

// Function to handle video source change based on selected server
async function changeServer() {
    const server = document.getElementById('server').value; // Get the selected server
    const type = media === "movie" ? "movie" : "tv"; // Movie or TV type
    let embedURL = "";  // URL to embed video from the selected server

    // Set the video URL depending on the selected server
    switch (server) {
        case "vidsrc.cc":
            embedURL = `https://vidsrc.cc/v2/embed/${type}/${id}`;
            break;
        case "vidsrc.me":
            embedURL = `https://vidsrc.net/embed/${type}/?tmdb=${id}`;
            break;
        case "player.videasy.net":
            embedURL = `https://player.videasy.net/${type}/${id}`;
            break;
        case "2embed":
            embedURL = `https://www.2embed.cc/embed/${id}`;
            break;
        default:
            console.error("Selected server is not supported.");
            break;
    }
    
    // If no URL was created, fallback to a default one
    if (!embedURL) {
        embedURL = "https://defaultserver.com/defaultEmbedUrl";  // Example fallback
    }

    // Update the iframe source with the correct video URL
    iframe.src = embedURL;

    // Ensure iframe is visible and correctly sized
    iframe.style.display = "block";  // Show the iframe
    iframe.style.width = "95%"; // or adjust to a fixed size
    iframe.style.height = "300px"; // or adjust height as needed
    
    // Hide the movie poster when the video is playing
    moviePoster.style.display = "none";  // Hide the movie poster image
}

// Function to display movie details on the page
async function displayMovieDetails() {
    try {
        const movieDetails = await fetchMovieDetails(id);

        var spokenlanguage = movieDetails.spoken_languages.map(language => language.english_name);
        language.textContent = spokenlanguage.join(', ');

        var genreNames = movieDetails.genres.map(genre => genre.name);
        genre.innerText = genreNames.join(', ');

        movieDetails.overview.length > 290
            ? plot.textContent = `${movieDetails.overview.substring(0, 290)}...`
            : plot.textContent = movieDetails.overview;

        movieTitle.textContent = movieDetails.name || movieDetails.title;
        moviePoster.src = `https://image.tmdb.org/t/p/w500${movieDetails.backdrop_path}`;
        movieYear.textContent = `${movieDetails.release_date || movieDetails.first_air_date}`;
        rating.textContent = movieDetails.vote_average;

        // Call the changeServer function to update the video source
        changeServer();

        // Updating the favorite button text and adding a click event listener to toggle favorites
        if (watchlist.some(favoriteMovie => favoriteMovie.id === movieDetails.id)) {
            watchListBtn.textContent = "Remove From WatchList";
        } else {
            watchListBtn.textContent = "Add To WatchList";
        }

        watchListBtn.addEventListener('click', () => toggleFavorite(movieDetails));

    } catch (error) {
        movieTitle.textContent = "Details are not available right now! Please try after some time.";
    }
}

// Function to toggle adding/removing from favorites
function toggleFavorite(movieDetails) {
    const index = watchlist.findIndex(movie => movie.id === movieDetails.id);
    if (index !== -1) {
        watchlist.splice(index, 1);
        watchListBtn.textContent = "Add To WatchList";
    } else {
        watchlist.push(movieDetails);
        watchListBtn.textContent = "Remove From WatchList";
    }
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
}

// Call the function to display movie details when the page loads
window.addEventListener('load', () => {
    displayMovieDetails();
});

// Function to handle changes when server selection is made
document.getElementById('server').addEventListener('change', () => {
    changeServer();
});

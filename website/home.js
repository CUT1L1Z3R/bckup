const API_KEY = 'a1e72fd93ed59f56e6332813b9f8dcae';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

// Show loader while fetching data
function showLoader() {
  document.getElementById('loader').style.display = 'block';
}
function hideLoader() {
  document.getElementById('loader').style.display = 'none';
}

// Fetch trending movies or TV shows
async function fetchTrending(type, genre = null) {
  try {
    let url = `${BASE_URL}/trending/${type}/week?api_key=${API_KEY}`;
    if (genre) url += `&with_genres=${genre}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Network/Server error');
    const data = await res.json();
    return data.results;
  } catch (err) {
    console.error('Error:', err);
    return [];
  }
}

// Fetch trending anime: must be Animation (genre 16) AND Japanese
async function fetchTrendingAnime() {
  let allResults = [];
  
  // Fetch from multiple pages to get more anime (max 3 pages for demo)
  for (let page = 1; page <= 3; page++) {
    const res = await fetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}&page=${page}`);
    const data = await res.json();
    const filtered = data.results.filter(item =>
      item.original_language === 'ja' && item.genre_ids.includes(16)
    );
    allResults = allResults.concat(filtered);
  }

  return allResults;
}

function truncate(str, n) {
  return str?.length > n ? str.substr(0, n - 1) + "..." : str;
}

function showErrorMessage(containerId, message) {
  document.getElementById(containerId).innerHTML = `<div style="color:#e62429; padding:10px;">${message}</div>`;
}

function displayList(items, containerId) {
  const container = document.getElementById(containerId);
  if (!items || items.length === 0) {
    showErrorMessage(containerId, 'No results found. Try again later.');
    return;
  }
  container.innerHTML = '';
  items.forEach(item => {
    if (item.poster_path) {
      const img = document.createElement('img');
      img.src = `${IMG_URL}${item.poster_path}`;
      img.alt = item.title || item.name;
      img.title = item.title || item.name;
      img.addEventListener('click', () => showDetails(item));
      container.appendChild(img);
    }
  });
}

// Banner feature
function displayBanner(movies) {
  if (!movies || movies.length === 0) return;
  const pick = movies[Math.floor(Math.random() * movies.length)];
  const banner = document.querySelector('.banner');
  if (pick && pick.backdrop_path) {
    banner.style.backgroundImage = `linear-gradient(120deg, #2c3e50bb 60%, #e62429cc 100%), url('${IMG_URL}${pick.backdrop_path}')`;
    banner.querySelector('h1').textContent = pick.title || pick.name || 'Welcome to FreeFlixx';
    banner.querySelector('p').textContent = truncate(pick.overview, 150) || 'Stream trending movies, TV shows, and anime';
  }
}

let currentItem = null;
function showDetails(item) {
  currentItem = item;
  document.getElementById('modal-title').textContent = item.title || item.name;
  document.getElementById('modal-description').textContent = item.overview || 'No description available.';
  document.getElementById('modal-image').src = item.poster_path ? `${IMG_URL}${item.poster_path}` : '';
  document.getElementById('modal-rating').innerHTML = '★'.repeat(Math.round(((item.vote_average || 0) / 2))) || '';
  changeServer();
  document.getElementById('modal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
  document.getElementById('modal-video').src = '';
}

document.getElementById('modal-close').onclick = closeModal;
window.onclick = function(event) {
  if (event.target === document.getElementById('modal')) closeModal();
}

// Server toggle for video source
function changeServer() {
  if (!currentItem) return;
  const server = document.getElementById('server').value;
  const type = currentItem.media_type === 'tv' ? 'tv' : 'movie';
  let embedURL = '';
  if (server === 'vidsrc.cc') {
    embedURL = `https://vidsrc.cc/v2/embed/${type}/${currentItem.id}`;
  } else if (server === 'vidsrc.me') {
    embedURL = `https://vidsrc.net/embed/${type}/?tmdb=${currentItem.id}`;
  } else if (server === 'player.videasy.net') {
    embedURL = `https://player.videasy.net/${type}/${currentItem.id}`;
  }
  document.getElementById('modal-video').src = embedURL;
}
document.getElementById('server').onchange = changeServer;

// Back to Top
const backToTopBtn = document.getElementById('backToTop');
window.onscroll = function() {
  backToTopBtn.classList.toggle('show', window.scrollY > 300);
};
backToTopBtn.onclick = function() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Initialize app
async function init() {
  showLoader();
  const [movies, tvShows] = await Promise.all([
    fetchTrending('movie'),
    fetchTrending('tv')
  ]);
  hideLoader();
  displayBanner(movies);
  displayList(movies, 'movies-list');
  displayList(tvShows, 'tvshows-list');

  // Corrected Anime section!
  const anime = await fetchTrendingAnime();
  displayList(anime, 'anime-list');
}
init();

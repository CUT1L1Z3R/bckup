// Get references to HTML elements
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const goToWatchlistBtn = document.getElementById('goToWatchlist');

// Event listener to navigate to WatchList page
goToWatchlistBtn.addEventListener('click', () => {
    window.location.href = 'watchList/watchlist.html';
});

const scrollDistance = 900;

// Get references to the header and other elements
const header = document.querySelector('.header');
let lastScrollTop = 0; // Keep track of the last scroll position

// Function to handle scroll events
window.addEventListener('scroll', () => {
    let currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (currentScrollTop > lastScrollTop) {
        // Scrolling down: hide the header
        header.style.top = "-120px"; // Move the header out of view (assuming the header height is 70px)
    } else {
        // Scrolling up: show the header
        header.style.top = "0px"; // Reset the header position to the top
    }
    
    lastScrollTop = currentScrollTop <= 0 ? 0 currentScrollTop; // Prevent negative scroll value
});

// Define a function to handle scrolling
function setupScroll(containerClass, previousButtonClass, nextButtonClass) {
    const previousButtons = document.querySelectorAll(`.${previousButtonClass}`);
    const nextButtons = document.querySelectorAll(`.${nextButtonClass}`);
    const containers = document.querySelectorAll(`.${containerClass}`);

    containers.forEach((container, index) => {
        const previousButton = previousButtons[index];
        const nextButton = nextButtons[index];
        nextButton.addEventListener('click', () => {
            container.scrollBy({
                left: scrollDistance,
                behavior: 'smooth',
            });
        });
        previousButton.addEventListener('click', () => {
            container.scrollBy({
                left: -scrollDistance,
                behavior: 'smooth',
            });
        });
    });
}

// SetupScroll function called for each section
setupScroll('trending-container', 'trending-previous', 'trending-next');
setupScroll('netflix-container', 'netflix-previous', 'netflix-next');
setupScroll('netflixShows-container', 'netflixShows-previous', 'netflixShows-next');
setupScroll('top-container', 'top-previous', 'top-next');
setupScroll('horror-container', 'horror-previous', 'horror-next');
setupScroll('comedy-container', 'comedy-previous', 'comedy-next');
setupScroll('action-container', 'action-previous', 'action-next');
setupScroll('romantic-container', 'romanticprevious', 'romantic-next');

// TMDB API key
const api_Key = 'e79515e88dfd7d9f6eeca36e01ac2';

// Function to fetch and display movies or TV shows
function fetchMedia(containerClass, endpoint, mediaType) {
    const containers = document.querySelectorAll(`.${containerClass}`);
    containers.forEach((container) => {
        fetch(`https://api.themoviedb.org/3/${endpoint}&api_key=${api_Key}`)
            .then(response => response.json())
            .then(data => {
                const fetchResults = data.results;
                fetchResults.forEach(item => {
                    const itemElement = document.createElement('div');
                    const imageUrl = containerClass === 'netflix-container' ? item.poster_path : item.backdrop_path;
                    const logo = images?.logos?.find((logo: any) => logo.iso_639_1 === "en")?.file_path || null;

                    itemElement.innerHTML = `
                        <div class="movie-poster">
                            <img src="${imageUrl}" alt="${item.title || item.name}">
                            <img src="${logo}" alt="Main Logo">
                        </div>
                    `;
                    container.appendChild(itemElement);

                    itemElement.addEventListener('click', () => {
                        const media_Type = item.media_type || mediaType
                        window.location.href = `movie_details/movie_details.html?media=${media_Type}&id=${item.id}`;
                    });
                });
            })
            .catch(error => {
                console.error(error);

            });
    })
}

// Initial fetch of trending, Netflix, top rated, horror, comedy, action, and romantic on page load
fetchMedia('trending-container', 'trending/all/week?');
fetchMedia('netflix-container', 'discover/tv?with_networks=213', 'tv');
fetchMedia('netflixShows-container', 'discover/tv?', 'tv');
fetchMedia('top-container', 'movie/top_rated?', 'movie');
fetchMedia('horror-container', 'discover/movie?with_genres=27', 'movie');
fetchMedia('comedy-container', 'discover/movie?with_genres=35', 'movie');
fetchMedia('action-container', 'discover/movie?with_genres=28', 'movie');
fetchMedia('romantic-container', 'discover/movie?with_genres=10749', 'movie');

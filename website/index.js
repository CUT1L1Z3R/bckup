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

    lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop; // Prevent negative scroll value
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
setupScroll('romantic-container', 'romantic-previous', 'romantic-next');

// TMDB API key
const api_Key = '84259f99204eeb7d45c7e3d8e36c6123';

// Function to get appropriate star color based on rating
function getRatingColor(rating) {
    if (rating >= 8) return '#4CAF50'; // Green for high ratings
    if (rating >= 6) return '#8d16c9'; // Purple (main theme color) for good ratings
    if (rating >= 4) return '#FFC107'; // Amber for average ratings
    return '#F44336'; // Red for low ratings
}

// Function to create the movie overlay with title and rating
function createMovieOverlay(item) {
    const overlay = document.createElement('div');
    overlay.className = 'movie-overlay';

    // Create title element
    const title = document.createElement('div');
    title.className = 'movie-title';
    title.textContent = item.title || item.name || 'Unknown Title';

    // Create rating element with star icon
    const rating = document.createElement('div');
    rating.className = 'movie-rating';

    const star = document.createElement('span');
    star.className = 'rating-star';
    star.innerHTML = '★';

    const ratingValue = document.createElement('span');
    ratingValue.className = 'rating-value';

    // Format the rating to show only one decimal place
    const voteAverage = item.vote_average || 0;
    const formattedRating = voteAverage !== 0 ? voteAverage.toFixed(1) : 'N/A';
    ratingValue.textContent = formattedRating;

    // Set color based on rating
    if (formattedRating !== 'N/A') {
        star.style.color = getRatingColor(voteAverage);
    }

    // Append elements
    rating.appendChild(star);
    rating.appendChild(ratingValue);
    overlay.appendChild(title);
    overlay.appendChild(rating);

    return overlay;
}

// Function to fetch and display movies or TV shows
function fetchMedia(containerClass, endpoint, mediaType) {
    const containers = document.querySelectorAll(`.${containerClass}`);
    containers.forEach((container) => {
        fetch(`https://api.themoviedb.org/3/${endpoint}&api_key=${api_Key}`)
            .then(response => response.json())
            .then(data => {
                const fetchResults = data.results;
                fetchResults.forEach(item => {
                    // Skip items without images
                    const imageUrl = containerClass === 'netflix-container' ? item.poster_path : item.backdrop_path;
                    if (!imageUrl) return;

                    const itemElement = document.createElement('div');

                    // Using a higher quality image (w780) for better resolution on all devices
                    itemElement.innerHTML = ` <img src="https://image.tmdb.org/t/p/w780${imageUrl}" alt="${item.title || item.name || 'Movie poster'}"> `;

                    // Add the movie overlay with title and rating
                    const overlay = createMovieOverlay(item);
                    itemElement.appendChild(overlay);

                    container.appendChild(itemElement);

                    itemElement.addEventListener('click', () => {
                        const media_Type = item.media_type || mediaType;
                        window.location.href = `movie_details/movie_details.html?media=${media_Type}&id=${item.id}`;
                    });
                });

                if (containerClass === 'trending-container') {
    const banner = document.getElementById('banner');
    const play = document.getElementById('play-button');
    const info = document.getElementById('more-info');
    const title = document.getElementById('banner-title');

    // Get all trending movies
    const bannerMovies = fetchResults.filter(movie => movie.backdrop_path).slice(0, 10); // Take first 10 trending movies with backdrop images

    let currentBannerIndex = 0;

    function displayBanner(index) {
        const movie = bannerMovies[index];
        banner.src = `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`;
        title.textContent = movie.title || movie.name || 'Unknown Title';

        // Update button click events
        function redirectToMovieDetails() {
            const media_Type = movie.media_type || 'movie'; // fallback to movie
            window.location.href = `movie_details/movie_details.html?media=${media_Type}&id=${movie.id}`;
        }
        play.onclick = redirectToMovieDetails;
        info.onclick = redirectToMovieDetails;
    }

    // Show first banner
    if (bannerMovies.length > 0) {
        displayBanner(currentBannerIndex);

        // Change banner every 5 seconds
        setInterval(() => {
            currentBannerIndex = (currentBannerIndex + 1) % bannerMovies.length;
            displayBanner(currentBannerIndex);
        }, 5000);
    }
}
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    });
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

// Retrieve watchlist from local storage or create an empty array if it doesn't exist
const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];


// Function to handle search input changes
async function handleSearchInput() {
    const query = searchInput.value;
    if (query.length > 2) {
        const results = await fetchSearchResults(query);
        if (results.length !== 0) {
            searchResults.style.visibility = "visible";
        }
        displaySearchResults(results);
    } else {
        searchResults.innerHTML = '';
        searchResults.style.visibility = "hidden";
    }
}

// Event listener for search input changes
searchInput.addEventListener('input', handleSearchInput);

// Event listener for Enter key press in search input
searchInput.addEventListener('keyup', async event => {
    if (event.key === 'Enter') {
        handleSearchInput();
    }
});

// Function to fetch search results from TMDB API
async function fetchSearchResults(query) {
    const response = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${api_Key}&query=${query}`);
    const data = await response.json();
    return data.results || [];
}

// Function to display search results
function displaySearchResults(results) {
    searchResults.innerHTML = '';
    results.map(movie => {
        // Skip items without poster images
        if (!movie.poster_path) return;

        const shortenedTitle = movie.title || movie.name || 'Unknown Title';
        const date = movie.release_date || movie.first_air_date || '';

        let buttonText = "Add to WatchList"; // Set default button text

        // Check if the movie is already in WatchList
        if (watchlist.find(watchlistItem => watchlistItem.id === movie.id)) {
            buttonText = "Go to WatchList"; // Change button text
        }

        const movieItem = document.createElement('div');
        // Create HTML structure for each movie
        movieItem.innerHTML = `<div class = "search-item-thumbnail">
                                    <img src ="https://image.tmdb.org/t/p/w780${movie.poster_path}">
                                </div>
                                <div class ="search-item-info">
                                    <h3>${shortenedTitle}</h3>
                                    <p>${movie.media_type || 'unknown'} <span> &nbsp; ${date}</span></p>
                                </div>
                                <button class="watchListBtn" id="${movie.id}">${buttonText}</button>`;

        const watchListBtn = movieItem.querySelector('.watchListBtn');

        // Add event listener to WatchList button
        watchListBtn.addEventListener('click', () => {
            if (buttonText === "Add to WatchList") {
                addToWatchList(movie);
            } else {
                window.location.href = 'watchList/watchlist.html'; // Navigate to the WatchList page
            }
        });

        const thumbnail = movieItem.querySelector('.search-item-thumbnail');
        const info = movieItem.querySelector('.search-item-info');

        // Add event listener to navigate to movie details page
        thumbnail.addEventListener('click', () => {
            window.location.href = `movie_details/movie_details.html?media=${movie.media_type}&id=${movie.id}`;
        });

        info.addEventListener('click', () => {
            window.location.href = `movie_details/movie_details.html?media=${movie.media_type}&id=${movie.id}`;
        });

        movieItem.setAttribute('class', 'movie-list');

        // Append movie item to search results
        searchResults.appendChild(movieItem);
    });
}

// Function to add a movie to WatchList
function addToWatchList(movie) {
    // Check if the movie is not already in the WatchList list
    if (!watchlist.find(watchlistItem => watchlistItem.id === movie.id)) {
        watchlist.push(movie);
        localStorage.setItem('watchlist', JSON.stringify(watchlist)); // Store in Local Storage
        const watchListBtn = document.querySelector(`[id="${movie.id}"]`);
        if (watchListBtn) {
            watchListBtn.textContent = "Go to WatchList";
            watchListBtn.addEventListener('click', () => {
                window.location.href = 'watchList/watchlist.html'; // Navigate to the WatchList page
            });
        }
    }
}

// Event listener to close search results when clicking outside
document.addEventListener('click', event => {
    if (!searchResults.contains(event.target)) {
        searchResults.innerHTML = '';
        searchResults.style.visibility = "hidden";
    }
});

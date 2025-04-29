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

// Function to generate a logo path from the title (xprime.tv style)
function generateLogoFromTitle(title, containerClass) {
    // Different styling for different categories
    let fontColor, shadowColor, titleStyle, backgroundColor;

    switch(containerClass) {
        case 'trending-container':
            fontColor = '#FFFFFF';
            shadowColor = 'rgba(255, 98, 0, 0.8)';
            backgroundColor = 'linear-gradient(135deg, rgba(255, 98, 0, 0.9), rgba(200, 32, 0, 0.9))';
            titleStyle = 'font-size: 1.3em; font-weight: 900; text-transform: uppercase; letter-spacing: 1px;';
            break;
        case 'netflix-container':
            fontColor = '#FFFFFF';
            shadowColor = 'rgba(229, 9, 20, 0.8)';
            backgroundColor = 'linear-gradient(135deg, rgba(229, 9, 20, 0.9), rgba(180, 0, 0, 0.9))';
            titleStyle = 'font-family: "Arial", sans-serif; font-weight: 900; text-transform: uppercase; letter-spacing: 1px;';
            break;
        case 'top-container':
            fontColor = '#FFFFFF';
            shadowColor = 'rgba(255, 215, 0, 0.8)';
            backgroundColor = 'linear-gradient(135deg, rgba(255, 215, 0, 0.9), rgba(218, 165, 32, 0.9))';
            titleStyle = 'font-style: italic; font-weight: 800; letter-spacing: 1px;';
            break;
        case 'horror-container':
            fontColor = '#FFFFFF';
            shadowColor = 'rgba(139, 0, 0, 0.8)';
            backgroundColor = 'linear-gradient(135deg, rgba(139, 0, 0, 0.9), rgba(80, 0, 0, 0.9))';
            titleStyle = 'font-family: "Arial", sans-serif; letter-spacing: 2px; font-weight: 700;';
            break;
        case 'comedy-container':
            fontColor = '#FFFFFF';
            shadowColor = 'rgba(255, 193, 7, 0.8)';
            backgroundColor = 'linear-gradient(135deg, rgba(255, 193, 7, 0.9), rgba(255, 160, 0, 0.9))';
            titleStyle = 'font-family: "Arial", sans-serif; font-weight: bold; letter-spacing: 1px;';
            break;
        case 'action-container':
            fontColor = '#FFFFFF';
            shadowColor = 'rgba(0, 119, 182, 0.8)';
            backgroundColor = 'linear-gradient(135deg, rgba(0, 119, 182, 0.9), rgba(0, 80, 157, 0.9))';
            titleStyle = 'text-transform: uppercase; font-weight: 900; letter-spacing: 1px;';
            break;
        default:
            fontColor = '#FFFFFF';
            shadowColor = 'rgba(0, 0, 0, 0.8)';
            backgroundColor = 'linear-gradient(135deg, rgba(70, 70, 70, 0.9), rgba(30, 30, 30, 0.9))';
            titleStyle = 'font-weight: bold; letter-spacing: 0.5px;';
    }

    // Format the title (limit to 20 characters with ellipsis if needed)
    const shortTitle = title.length > 20 ? title.substring(0, 18) + '...' : title;

    // Create the HTML for a styled logo with text in a pill/capsule background
    const logoHTML = `
        <div class="movie-logo" style="
            color: ${fontColor};
            text-shadow: 1px 1px 3px ${shadowColor};
            background: ${backgroundColor};
            ${titleStyle}
            padding: 4px 10px;
            border-radius: 4px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
            display: inline-block;
            max-width: 85%;
            text-align: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        ">${shortTitle}</div>
    `;

    return logoHTML;
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
                    const itemElement = document.createElement('div');
                    itemElement.className = 'movie-item';
                    const imageUrl = containerClass === 'netflix-container' ? item.poster_path : item.backdrop_path;

                    // Create the movie title
                    const title = item.title || item.name;

                    // Using a higher quality image (w780) for better resolution on all devices
                    itemElement.innerHTML = `
                        <img src="https://image.tmdb.org/t/p/w780${imageUrl}" alt="${title}">
                        ${generateLogoFromTitle(title, containerClass)}
                    `;

                    container.appendChild(itemElement);

                    itemElement.addEventListener('click', () => {
                        const media_Type = item.media_type || mediaType
                        window.location.href = `movie_details/movie_details.html?media=${media_Type}&id=${item.id}`;
                    });
                });

                if (containerClass === 'trending-container') {
                    const banner = document.getElementById('banner');
                    const play = document.getElementById('play-button');
                    const info = document.getElementById('more-info');
                    const title = document.getElementById('banner-title');

                    // Get all trending movies
                    const bannerMovies = fetchResults.slice(0, 10); // Take first 10 trending movies

                    let currentBannerIndex = 0;

                    function displayBanner(index) {
                        const movie = bannerMovies[index];
                        banner.src = `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`;
                        title.textContent = movie.title || movie.name;

                        // Update button click events
                        function redirectToMovieDetails() {
                            const media_Type = movie.media_type || 'movie'; // fallback to movie
                            window.location.href = `movie_details/movie_details.html?media=${media_Type}&id=${movie.id}`;
                        }
                        play.onclick = redirectToMovieDetails;
                        info.onclick = redirectToMovieDetails;
                    }

                    // Show first banner
                    displayBanner(currentBannerIndex);

                    // Change banner every 5 seconds
                    setInterval(() => {
                        currentBannerIndex = (currentBannerIndex + 1) % bannerMovies.length;
                        displayBanner(currentBannerIndex);
                    }, 5000);
                }
            })
            .catch(error => {
                console.error(error);
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
        const shortenedTitle = movie.title || movie.name;
        const date = movie.release_date || movie.first_air_date;

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
                                    <p>${movie.media_type} <span> &nbsp; ${date}</span></p>
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
        (thumbnail && info).addEventListener('click', () => {
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

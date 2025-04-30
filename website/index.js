/*
// Get references to HTML elements
*/
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const goToWatchlistBtn = document.getElementById('goToWatchlist');
const navItems = document.querySelectorAll('.nav-item');
const movieSections = document.querySelectorAll('.movie-section');
const animeSections = document.querySelectorAll('.anime-section');

// Event listener to navigate to WatchList page
goToWatchlistBtn.addEventListener('click', () => {
    window.location.href = 'watchList/watchlist.html';
});

// Navigation menu functionality
navItems.forEach(item => {
    item.addEventListener('click', () => {
        // Remove active class from all items
        navItems.forEach(navItem => navItem.classList.remove('active'));

        // Add active class to clicked item
        item.classList.add('active');

        // Get the section to show
        const section = item.querySelector('a').getAttribute('data-section');

        // Show/hide sections based on selection
        if (section === 'all') {
            // Show all sections
            movieSections.forEach(section => section.style.display = 'block');
        } else if (section === 'anime') {
            // Show only anime sections
            movieSections.forEach(section => {
                if (section.classList.contains('anime-section')) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
        } else if (section === 'movies' || section === 'tv') {
            // Show only movie/tv sections
            movieSections.forEach(section => {
                if (section.classList.contains('anime-section')) {
                    section.style.display = 'none';
                } else {
                    section.style.display = 'block';
                }
            });
        }
    });
});

const scrollDistance = 1200;

// Get references to the header and other elements
const header = document.querySelector('.header');
let lastScrollTop = 0; // Keep track of the last scroll position

// Function to handle scroll events
window.addEventListener('scroll', () => {
    let currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScrollTop > lastScrollTop) {
        // Scrolling down: hide the header and nav
        header.style.top = "-120px"; // Move the header out of view
        document.querySelector('.nav-menu').style.top = "-50px"; // Move nav out of view
    } else {
        // Scrolling up: show the header and nav
        header.style.top = "0px"; // Reset the header position to the top
        document.querySelector('.nav-menu').style.top = "70px"; // Place nav under header
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
setupScroll('top-container', 'top-previous', 'top-next');
setupScroll('horror-container', 'horror-previous', 'horror-next');
setupScroll('comedy-container', 'comedy-previous', 'comedy-next');
setupScroll('action-container', 'action-previous', 'action-next');
setupScroll('anime-popular-container', 'anime-popular-previous', 'anime-popular-next');
setupScroll('anime-top-container', 'anime-top-previous', 'anime-top-next');
setupScroll('anime-upcoming-container', 'anime-upcoming-previous', 'anime-upcoming-next');

// TMDB API key
const api_Key = '84259f99204eeb7d45c7e3d8e36c6123';

// Function to get appropriate star color based on rating
function getRatingColor(rating) {
    if (rating >= 8) return '#4CAF50'; // Green for high ratings
    if (rating >= 6) return '#8d16c9'; // Purple (main theme color) for good ratings
    if (rating >= 4) return '#FFC107'; // Amber for average ratings
    return '#F44336'; // Red for low ratings
}

// Function to fetch and display movies or TV shows
function fetchMedia(containerClass, endpoint, mediaType, usePosterPath = false) {
    // ... existing code ...
}

// Function to fetch and display anime from Jikan API
function fetchAnime(containerClass, endpoint) {
    console.log(`Fetching anime for ${containerClass} with endpoint ${endpoint}`);
    const containers = document.querySelectorAll(`.${containerClass}`);

    containers.forEach((container) => {
        // Add delay to avoid rate limiting (Jikan API has a limit of 3 requests/sec)
        setTimeout(() => {
            fetch(`https://api.jikan.moe/v4/${endpoint}`)
                .then(response => response.json())
                .then(data => {
                    console.log(`Got anime data for ${containerClass}, found ${data.data.length} items`);
                    const animeResults = data.data;
                    container.innerHTML = ''; // Clear the container first to prevent duplicates

                    // Process each anime item
                    animeResults.forEach(anime => {
                        const imageUrl = anime.images.jpg.large_image_url || anime.images.jpg.image_url;
                        if (!imageUrl) return;

                        const title = anime.title || anime.title_english || 'Unknown Title';
                        console.log(`Processing anime: ${title}`);

                        // Create the main item element with fixed dimensions
                        const itemElement = document.createElement('div');
                        itemElement.className = 'movie-item'; // Add a specific class for styling

                        // Using poster style for anime
                        itemElement.style.width = '250px';
                        itemElement.style.height = '340px';
                        itemElement.style.flexShrink = '0'; // Prevent shrinking
                        itemElement.style.margin = '20px 0';

                        // Create a wrapper for the image to maintain aspect ratio
                        const imgWrapper = document.createElement('div');
                        imgWrapper.className = 'image-wrapper';
                        imgWrapper.style.width = '100%';
                        imgWrapper.style.height = '100%';
                        imgWrapper.style.overflow = 'hidden';
                        imgWrapper.style.borderRadius = '5px';
                        imgWrapper.style.position = 'relative';

                        // Create and add the image
                        const img = document.createElement('img');
                        img.src = imageUrl;
                        img.alt = title;
                        img.loading = 'lazy'; // Add lazy loading for better performance
                        img.style.width = '100%';
                        img.style.height = '100%';
                        img.style.objectFit = 'cover';
                        img.style.borderRadius = '5px';
                        img.style.transition = 'all 0.5s ease-in-out';

                        imgWrapper.appendChild(img);

                        // Add the image wrapper to the item element
                        itemElement.appendChild(imgWrapper);

                        // Add the item to the container
                        container.appendChild(itemElement);

                        // Add click event to navigate to anime details
                        itemElement.addEventListener('click', () => {
                            window.open(anime.url, '_blank');
                        });

                        // Create overlay with title and rating
                        const overlay = document.createElement('div');
                        overlay.className = 'movie-overlay';
                        overlay.style.position = 'absolute';
                        overlay.style.bottom = '0';
                        overlay.style.left = '0';
                        overlay.style.width = '100%';
                        overlay.style.background = 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 70%)';
                        overlay.style.borderTop = '2px solid rgba(141, 22, 201, 0.6)';
                        overlay.style.color = 'white';
                        overlay.style.padding = '10px 12px';
                        overlay.style.borderRadius = '0 0 5px 5px';
                        overlay.style.boxSizing = 'border-box';
                        overlay.style.zIndex = '10';
                        overlay.style.display = 'flex';
                        overlay.style.justifyContent = 'space-between';
                        overlay.style.alignItems = 'center';
                        overlay.style.pointerEvents = 'none';

                        // Create title element
                        const titleElement = document.createElement('div');
                        titleElement.className = 'movie-title';
                        titleElement.textContent = title;
                        titleElement.style.color = 'white';
                        titleElement.style.fontSize = '14px';
                        titleElement.style.fontWeight = 'bold';
                        titleElement.style.margin = '0';
                        titleElement.style.maxWidth = '70%';
                        titleElement.style.whiteSpace = 'nowrap';
                        titleElement.style.overflow = 'hidden';
                        titleElement.style.textOverflow = 'ellipsis';
                        titleElement.style.textShadow = '1px 1px 3px rgba(0, 0, 0, 1)';
                        titleElement.style.letterSpacing = '0.5px';

                        // Enhanced star rating visibility
                        const rating = document.createElement('div');
                        rating.className = 'movie-rating';
                        rating.style.display = 'flex';
                        rating.style.alignItems = 'center';
                        rating.style.gap = '2px';
                        rating.style.marginLeft = 'auto';

                        const star = document.createElement('span');
                        star.className = 'rating-star';
                        star.innerHTML = '★';
                        star.style.fontSize = '15px';
                        star.style.textShadow = '0px 0px 3px rgba(0, 0, 0, 0.8)';

                        const ratingValue = document.createElement('span');
                        ratingValue.className = 'rating-value';
                        ratingValue.style.fontSize = '13px';
                        ratingValue.style.fontWeight = 'bold';
                        ratingValue.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 1)';
                        ratingValue.style.color = 'white';

                        // Format the rating to show only one decimal place
                        const voteAverage = anime.score || 0;
                        const formattedRating = voteAverage !== 0 ? voteAverage.toFixed(1) : 'N/A';
                        ratingValue.textContent = formattedRating;

                        // Set color based on rating
                        if (formattedRating !== 'N/A') {
                            star.style.color = getRatingColor(voteAverage);
                        }

                        // Build the overlay structure
                        rating.appendChild(star);
                        rating.appendChild(ratingValue);
                        overlay.appendChild(titleElement);
                        overlay.appendChild(rating);

                        // Add overlay to the image wrapper
                        imgWrapper.appendChild(overlay);
                        console.log(`Added overlay for ${title}`);
                    });

                    // If first anime section and banner image not loaded from movies yet, use the first anime
                    if (containerClass === 'anime-popular-container') {
                        const banner = document.getElementById('banner');
                        if (!banner.src && animeResults.length > 0) {
                            const anime = animeResults[0];
                            banner.src = anime.images.jpg.large_image_url;
                            document.getElementById('banner-title').textContent = anime.title;

                            // Update button click events
                            document.getElementById('play-button').onclick = () => {
                                window.open(anime.url, '_blank');
                            };
                            document.getElementById('more-info').onclick = () => {
                                window.open(anime.url, '_blank');
                            };
                        }
                    }
                })
                .catch(error => {
                    console.error('Error fetching anime data:', error);
                });
        }, containerClass.includes('popular') ? 0 : containerClass.includes('top') ? 1000 : 2000); // Stagger requests to avoid rate limiting
    });
}

// Initial fetch of movies
fetchMedia('netflix-container', 'discover/tv?with_networks=213', 'tv', true); // Netflix originals with poster_path
fetchMedia('trending-container', 'trending/all/week?');
fetchMedia('top-container', 'movie/top_rated?', 'movie');
fetchMedia('horror-container', 'discover/movie?with_genres=27', 'movie');
fetchMedia('comedy-container', 'discover/movie?with_genres=35', 'movie');
fetchMedia('action-container', 'discover/movie?with_genres=28', 'movie');

// Initial fetch of anime
fetchAnime('anime-popular-container', 'anime?order_by=popularity&limit=20');
fetchAnime('anime-top-container', 'top/anime?limit=20');
fetchAnime('anime-upcoming-container', 'seasons/upcoming?limit=20');

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

// Function to fetch search results from TMDB API
async function fetchSearchResults(query) {
    // Try to fetch both movie/TV and anime results
    try {
        const [tmdbResponse, animeResponse] = await Promise.all([
            fetch(`https://api.themoviedb.org/3/search/multi?api_key=${api_Key}&query=${query}`),
            fetch(`https://api.jikan.moe/v4/anime?q=${query}&limit=5`)
        ]);

        const tmdbData = await tmdbResponse.json();
        const animeData = await animeResponse.json();

        // Combine and format results
        let combinedResults = [];

        // Format TMDB results
        if (tmdbData.results) {
            tmdbData.results.forEach(item => {
                if (item.poster_path) {
                    combinedResults.push({
                        id: item.id,
                        title: item.title || item.name,
                        poster_path: `https://image.tmdb.org/t/p/w780${item.poster_path}`,
                        media_type: item.media_type,
                        release_date: item.release_date || item.first_air_date,
                        isAnime: false,
                        url: null
                    });
                }
            });
        }

        // Format anime results
        if (animeData.data) {
            animeData.data.forEach(item => {
                combinedResults.push({
                    id: item.mal_id,
                    title: item.title,
                    poster_path: item.images.jpg.image_url,
                    media_type: 'anime',
                    release_date: item.aired ? item.aired.from?.substring(0, 4) : '',
                    isAnime: true,
                    url: item.url
                });
            });
        }

        return combinedResults;
    } catch (error) {
        console.error('Error fetching search results:', error);
        return [];
    }
}

// Function to display search results
function displaySearchResults(results) {
    searchResults.innerHTML = '';
    results.map(item => {
        const shortenedTitle = item.title || 'Unknown Title';
        const date = item.release_date || '';

        let buttonText = "Add to WatchList"; // Set default button text

        // Check if the movie is already in WatchList
        if (watchlist.find(watchlistItem => watchlistItem.id === item.id)) {
            buttonText = "Go to WatchList"; // Change button text
        }

        const movieItem = document.createElement('div');
        // Create HTML structure for each item
        movieItem.innerHTML = `<div class = "search-item-thumbnail">
                                    <img src ="${item.poster_path}">
                                </div>
                                <div class ="search-item-info">
                                    <h3>${shortenedTitle}</h3>
                                    <p>${item.media_type || 'unknown'} <span> &nbsp; ${date}</span></p>
                                </div>
                                <button class="watchListBtn" id="${item.id}">${buttonText}</button>`;

        const watchListBtn = movieItem.querySelector('.watchListBtn');

        // Add event listener to WatchList button
        watchListBtn.addEventListener('click', () => {
            if (buttonText === "Add to WatchList") {
                addToWatchList(item);
            } else {
                window.location.href = 'watchList/watchlist.html'; // Navigate to the WatchList page
            }
        });

        const thumbnail = movieItem.querySelector('.search-item-thumbnail');
        const info = movieItem.querySelector('.search-item-info');

        // Add event listener to navigate to details page
        thumbnail.addEventListener('click', () => {
            if (item.isAnime && item.url) {
                window.open(item.url, '_blank');
            } else {
                window.location.href = `movie_details/movie_details.html?media=${item.media_type}&id=${item.id}`;
            }
        });

        info.addEventListener('click', () => {
            if (item.isAnime && item.url) {
                window.open(item.url, '_blank');
            } else {
                window.location.href = `movie_details/movie_details.html?media=${item.media_type}&id=${item.id}`;
            }
        });

        movieItem.setAttribute('class', 'movie-list');

        // Append movie item to search results
        searchResults.appendChild(movieItem);
    });
}

// Retrieve watchlist from local storage or create an empty array if it doesn't exist
const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

// Event listener for search input changes
searchInput.addEventListener('input', handleSearchInput);

// Event listener for Enter key press in search input
searchInput.addEventListener('keyup', async event => {
    if (event.key === 'Enter') {
        handleSearchInput();
    }
});

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

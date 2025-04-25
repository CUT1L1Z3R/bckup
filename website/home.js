<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>FreeFlixx - Stream Trending Movies & TV Shows</title>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="home.css">
</head>
<body>
  <nav class="navbar">
    <div class="navbar-logo">FreeFlixx</div>
    <button class="navbar-toggle" id="navbar-toggle">≡</button>
  </nav>
  <div class="banner">
    <h1>Welcome to FreeFlixx</h1>
    <p>Stream trending movies, TV shows, and anime</p>
  </div>

  <div id="loader" class="loader"></div>
  <main>
    <section id="movies">
      <h2>Trending Movies</h2>
      <div class="list" id="movies-list"></div>
    </section>
    <section id="tvshows">
      <h2>Trending TV Shows</h2>
      <div class="list" id="tvshows-list"></div>
    </section>
    <section id="anime">
      <h2>Trending Anime</h2>
      <div class="list" id="anime-list"></div>
    </section>
  </main>

  <div id="modal" class="modal">
    <div class="modal-content">
      <span class="close" id="modal-close">&times;</span>
      <div class="modal-body">
        <img id="modal-image" src="" alt="Poster">
        <div class="modal-text">
          <h3 id="modal-title"></h3>
          <p id="modal-description"></p>
          <div id="modal-rating"></div>
          <select id="server">
            <option value="vidsrc.cc">Vidsrc.cc</option>
            <option value="vidsrc.me">Vidsrc.me</option>
            <option value="player.videasy.net">videasy.net</option>
          </select>
          <div id="video-container">
            <iframe id="modal-video" width="270" height="150" frameborder="0" allowfullscreen></iframe>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <button id="backToTop" title="Go to top">↑</button>
  
  <footer class="footer" id="contact">
    <div class="footer-content">
      MADE WITH 💜 BY CUTILIZER
      <div class="footer-links">
        <a href="https://twitter.com">Twitter</a>
        <a href="mailto:contact@freeflixx.pages.dev">Contact</a>
        <a href="#about">About</a>
      </div>
    </div>
  </footer>
  <script src="home.js"></script>
</body>
</html>

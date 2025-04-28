<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>The Flash - Bun Clone</title>
  <link rel="stylesheet" href="style.css">
  <!-- Fonts -->
  <link rel="preload" href="https://ext.same-assets.com/4149994070/3164317937.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="https://ext.same-assets.com/4149994070/2730388244.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="https://ext.same-assets.com/4149994070/3161169678.woff2" as="font" type="font/woff2" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Poppins:wght@700&display=swap" rel="stylesheet">
</head>
<body>
  <header>
    <div class="logo">bun<span>movies</span></div>
    <nav>
      <a href="#">Home</a>
      <a href="#">TV Shows</a>
      <a href="#">Library</a>
    </nav>
    <div class="header-actions">
      <button title="Search" class="icon-btn">🔍</button>
      <button title="Account" class="icon-btn">👤</button>
    </div>
  </header>
  <main>
    <section class="main-content">
      <div class="video-section">
        <div class="video-backdrop">
          <img src="https://ext.same-assets.com/4149994070/469667432.jpeg" alt="Backdrop The Flash">
          <div class="video-player" id="video-player-container">
            <iframe id="player-iframe" src="https://vidsrc.cc/v2/embed/tv/60735/1-1" frameborder="0" allowfullscreen loading="lazy" title="The Flash Episode Player"></iframe>
          </div>
        </div>
        <div class="movie-info">
          <h1>The Flash</h1>
          <div class="meta">
            <span class="year">2014</span>
            <span class="genre">Drama</span>
            <span class="genre">Sci-Fi & Fantasy</span>
            <span class="seasons">Seasons: 9</span>
            <span class="status">Ended</span>
          </div>
          <div class="score-row">
            <span class="tmdb-score">7.8 TMDB</span>
            <span class="source">Source: Miya</span>
            <span class="qualities">Stable • Has 4K • HD</span>
          </div>
          <div class="actions">
            <button class="play-btn" id="play-btn">► Play S1E1</button>
            <button class="watchlist-btn">☆ Watchlist</button>
          </div>
          <div class="description">
            After being struck by lightning, CSI investigator Barry Allen awakens from a nine-month coma to discover he has been granted the gift of super speed. Teaming up with S.T.A.R. Labs, Barry takes on the persona of The Flash, the Fastest Man Alive, to protect his city.
          </div>
        </div>
        <div class="episode-section">
          <div class="season-picker">
            <label for="season-select">Season</label>
            <select id="season-select">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
            </select>
            <span id="season-ep-count">(23 Episodes)</span>
          </div>
          <div id="episode-list" class="episode-list"></div>
        </div>
      </div>
    </section>
    <aside class="sidebar">
      <h2>You Might Also Like</h2>
      <ul class="recommend-list">
        <li>
          <img src="https://ext.same-assets.com/4149994070/3359440644.svg" alt="Arrow poster">
          <div class="rec-info">
            <div class="rec-title">Arrow</div>
            <div class="rec-meta">2012 • 6.8</div>
          </div>
        </li>
        <li>
          <img src="https://ext.same-assets.com/4149994070/3043377484.svg" alt="Supergirl poster">
          <div class="rec-info">
            <div class="rec-title">Supergirl</div>
            <div class="rec-meta">2015 • 7.3</div>
          </div>
        </li>
        <li>
          <img src="https://ext.same-assets.com/4149994070/3446451376.svg" alt="DC's Legends of Tomorrow poster">
          <div class="rec-info">
            <div class="rec-title">DC's Legends of Tomorrow</div>
            <div class="rec-meta">2016 • 7.3</div>
          </div>
        </li>
        <li>
          <img src="https://ext.same-assets.com/4149994070/2308226153.svg" alt="The Flash 1990 poster">
          <div class="rec-info">
            <div class="rec-title">The Flash (1990)</div>
            <div class="rec-meta">1990 • 7.4</div>
          </div>
        </li>
        <li>
          <img src="https://ext.same-assets.com/4149994070/3204722232.svg" alt="Gotham poster">
          <div class="rec-info">
            <div class="rec-title">Gotham</div>
            <div class="rec-meta">2014 • 7.6</div>
          </div>
        </li>
        <li>
          <img src="https://ext.same-assets.com/4149994070/748785669.svg" alt="Marvel's Agents of S.H.I.E.L.D. poster">
          <div class="rec-info">
            <div class="rec-title">Marvel's Agents of S.H.I.E.L.D.</div>
            <div class="rec-meta">2013 • 7.5</div>
          </div>
        </li>
        <li>
          <img src="https://ext.same-assets.com/4149994070/243881076.svg" alt="Marvel's Daredevil poster">
          <div class="rec-info">
            <div class="rec-title">Marvel's Daredevil</div>
            <div class="rec-meta">2015 • 8.2</div>
          </div>
        </li>
        <li>
          <img src="https://ext.same-assets.com/4149994070/1621887225.svg" alt="Supernatural poster">
          <div class="rec-info">
            <div class="rec-title">Supernatural</div>
            <div class="rec-meta">2005 • 8.3</div>
          </div>
        </li>
        <!-- More recommendations... -->
      </ul>
    </aside>
  </main>
  <footer>
    <div class="footer-text">This site displays advertisements to support its operation. By continuing to use the site, you acknowledge that you may encounter ads.</div>
  </footer>
  <script src="script.js"></script>
</body>
</html>

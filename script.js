// Contoh data episode untuk setiap anime (berdasarkan anime.id)
// Data ini seharusnya berasal dari API atau database Anda
const dataEpisode = {
    // Contoh: Anime dengan id 16498 memiliki 12 episode
    16498: [
      { episode: 1, embedUrl: "https://www.youtube.com/embed/Utwqz9iVWOc?si=mwj-Rk3AvsboMXE6" },
      { episode: 2, embedUrl: "https://www.youtube.com/embed/linkEpisode2" },
      { episode: 3, embedUrl: "https://www.youtube.com/embed/linkEpisode3" },
      { episode: 4, embedUrl: "https://www.youtube.com/embed/linkEpisode4" },
      { episode: 5, embedUrl: "https://www.youtube.com/embed/linkEpisode5" },
      { episode: 6, embedUrl: "https://www.youtube.com/embed/linkEpisode6" },
      { episode: 7, embedUrl: "https://www.youtube.com/embed/linkEpisode7" },
      { episode: 8, embedUrl: "https://www.youtube.com/embed/linkEpisode8" },
      { episode: 9, embedUrl: "https://www.youtube.com/embed/linkEpisode9" },
      { episode: 10, embedUrl: "https://www.youtube.com/embed/linkEpisode10" },
      { episode: 11, embedUrl: "https://www.youtube.com/embed/linkEpisode11" },
      { episode: 12, embedUrl: "https://www.youtube.com/embed/linkEpisode12" },
    ],
    // Tambahkan data episode untuk anime lain sesuai kebutuhan
  };
  
  // Fungsi untuk mengambil anime populer
  async function fetchPopularAnime() {
    const query = `
      query {
        Page(page: 1, perPage: 10) {
          media(type: ANIME, sort: POPULARITY_DESC) {
            id
            title {
              romaji
              english
              native
            }
            coverImage {
              large
            }
            description
            genres
            averageScore
            siteUrl
            trailer {
              id
              site
            }
          }
        }
      }
    `;
  
    try {
      const response = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ query })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Data dari API (Populer):', data);
      return data.data.Page.media;
    } catch (error) {
      console.error('Error fetching popular anime:', error);
      return [];
    }
  }
  
  // Fungsi untuk mengambil anime terbaru
  async function fetchRecentAnime() {
    const query = `
      query {
        Page(page: 1, perPage: 10) {
          media(type: ANIME, sort: START_DATE_DESC) {
            id
            title {
              romaji
              english
              native
            }
            coverImage {
              large
            }
            description
            genres
            averageScore
            siteUrl
            trailer {
              id
              site
            }
          }
        }
      }
    `;
  
    try {
      const response = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ query })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Data dari API (Terbaru):', data);
      return data.data.Page.media;
    } catch (error) {
      console.error('Error fetching recent anime:', error);
      return [];
    }
  }
  
  // Fungsi untuk menampilkan daftar anime
  function displayAnime(animeList, containerId) {
    const animeListContainer = document.getElementById(containerId);
    animeListContainer.innerHTML = ''; // Bersihkan kontainer
  
    if (animeList.length === 0) {
      animeListContainer.innerHTML = '<p>Tidak ada anime yang ditemukan.</p>';
      return;
    }
  
    animeList.forEach(anime => {
      const animeCard = document.createElement('div');
      animeCard.classList.add('anime-card');
  
      animeCard.innerHTML = `
        <img src="${anime.coverImage.large}" alt="${anime.title.romaji}">
        <h3>${anime.title.romaji}</h3>
      `;
  
      // Saat animeCard diklik, tampilkan detail anime
      animeCard.addEventListener('click', () => {
        showAnimeDetail(anime);
      });
  
      animeListContainer.appendChild(animeCard);
    });
  }
  
  // Fungsi untuk menampilkan detail anime dalam bahasa Indonesia beserta pilihan episode streaming
  function showAnimeDetail(anime) {
    console.log('Menampilkan detail anime:', anime);
  
    const animeDetailSection = document.getElementById('anime-detail');
    const animeListSection = document.getElementById('anime-list');
    const detailContent = document.getElementById('detail-content');
  
    if (!animeDetailSection || !animeListSection || !detailContent) {
      console.error('Elemen yang dibutuhkan tidak ditemukan di DOM');
      return;
    }
  
    // Sembunyikan daftar anime dan tampilkan detail anime
    animeListSection.classList.add('hidden');
    animeDetailSection.classList.remove('hidden');
  
    // Buat konten detail anime dalam bahasa Indonesia
    let episodeContent = '';
    if (anime.trailer && anime.trailer.site === 'youtube' && dataEpisode[anime.id] && dataEpisode[anime.id].length) {
      episodeContent = `<div id="episode-section">
        <h3>Pilih Episode untuk Streaming</h3>
        <div class="episode-list" id="episode-list">`;
      // Buat tombol untuk setiap episode yang ada
      dataEpisode[anime.id].forEach(ep => {
        episodeContent += `<button class="episode-button" data-embed="${ep.embedUrl}">
          Episode ${ep.episode}
        </button>`;
      });
      episodeContent += `</div>
        <iframe id="episode-iframe" src="${dataEpisode[anime.id][0].embedUrl}" allowfullscreen></iframe>
      </div>`;
    } else {
      episodeContent = '<p>Data episode tidak tersedia.</p>';
    }
  
    // Tampilkan detail anime
    detailContent.innerHTML = `
      <img src="${anime.coverImage.large}" alt="${anime.title.romaji}">
      <h2>${anime.title.romaji}</h2>
      <p><strong>Genre:</strong> ${anime.genres.join(', ')}</p>
      <p><strong>Rating:</strong> ${anime.averageScore}/100</p>
      <p>${anime.description || 'Deskripsi tidak tersedia.'}</p>
      ${episodeContent}
      <button onclick="addToFavorites(${anime.id})">Tambahkan ke Favorit</button>
    `;
  
    // Tambahkan event listener ke tombol episode
    document.querySelectorAll('.episode-button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.getElementById('episode-iframe').src = btn.getAttribute('data-embed');
      });
    });
  }
  
  // Event listener untuk tombol kembali (back)
  document.getElementById('back-button').addEventListener('click', () => {
    const animeDetailSection = document.getElementById('anime-detail');
    const animeListSection = document.getElementById('anime-list');
  
    animeDetailSection.classList.add('hidden');
    animeListSection.classList.remove('hidden');
  });
  
  // Fungsi untuk menambahkan anime ke favorit
  function addToFavorites(animeId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.includes(animeId)) {
      favorites.push(animeId);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      alert('Anime ditambahkan ke favorit!');
    } else {
      alert('Anime sudah ada di favorit!');
    }
  }
  
  // Fungsi untuk mencari anime
  document.getElementById('search').addEventListener('input', async (e) => {
    const searchQuery = e.target.value;
    const query = `
      query ($search: String) {
        Page(page: 1, perPage: 10) {
          media(type: ANIME, search: $search) {
            id
            title {
              romaji
              english
              native
            }
            coverImage {
              large
            }
            description
            genres
            averageScore
            siteUrl
            trailer {
              id
              site
            }
          }
        }
      }
    `;
    const variables = { search: searchQuery };
  
    try {
      const response = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ query, variables })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Data dari API (Pencarian):', data);
      // Tampilkan hasil pencarian pada section populer (atau sesuaikan penempatan)
      displayAnime(data.data.Page.media, 'popular-anime-list');
    } catch (error) {
      console.error('Error searching anime:', error);
    }
  }, { passive: true });
  
  // Fungsi utama untuk menjalankan aplikasi
  async function main() {
    try {
      // Ambil dan tampilkan anime populer
      const popularAnime = await fetchPopularAnime();
      if (popularAnime.length > 0) {
        displayAnime(popularAnime, 'popular-anime-list');
      } else {
        console.warn('Tidak ada anime populer yang ditemukan.');
      }
  
      // Ambil dan tampilkan anime terbaru
      const recentAnime = await fetchRecentAnime();
      if (recentAnime.length > 0) {
        displayAnime(recentAnime, 'recent-anime-list');
      } else {
        console.warn('Tidak ada anime terbaru yang ditemukan.');
      }
    } catch (error) {
      console.error('Error in main function:', error);
    }
  }
  
  // Jalankan aplikasi
  main();
  
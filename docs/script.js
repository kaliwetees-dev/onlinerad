// A global array to hold the radio station data
let radioStations = [];

// Hardcoded fallback data in case fetching the JSON file fails.
// This ensures the application can still function.
const fallbackStations = [
    {
        "id": "1",
        "name": "Love Radio",
        "currentSong": "",
        "logoUrl": "https://upload.wikimedia.org/wikipedia/en/3/32/Love_Radio_2021_logo.png",
        "streamingUrl": "https://azura.loveradio.com.ph/listen/love_radio_manila/radio.mp3",
        "genre": "Pop"
    },
    {
        "id": "2",
        "name": "Easy Rock Manila",
        "currentSong": "",
        "logoUrl": "https://static.mytuner.mobi/media/tvos_radios/j32PnqrN5L.jpg",
        "streamingUrl": "https://azura.easyrock.com.ph/listen/easy_rock_manila/radio.mp3",
        "genre": "Chill Out"
    },
    {
        "id": "3",
        "name": "Easy Rock Boracay",
        "currentSong": "",
        "logoUrl": "https://static.mytuner.mobi/media/tvos_radios/j32PnqrN5L.jpg",
        "streamingUrl": "https://easyrockboracay.radioca.st/;",
        "genre": "Pop"
    },
    {
        "id": "4",
        "name": "Energy FM Manila",
        "currentSong": "",
        "logoUrl": "https://upload.wikimedia.org/wikipedia/commons/a/ac/Energy_FM_logo.png",
        "streamingUrl": "http://ph-icecast.eradioportal.com:8000/energyfm_manila",
        "genre": "Rock"
    },
    {
        "id": "5",
        "name": "W Rock Cebu",
        "currentSong": "",
        "logoUrl": "https://i1.sndcdn.com/artworks-LMzzdCF2XHfGMy9U-LRss5A-t1080x1080.jpg",
        "streamingUrl": "https://wrockceb-iradioph.radioca.st/;",
        "genre": "Dance"
    },
    {
        "id": "6",
        "name": "Yes FM Manila",
        "currentSong": "",
        "logoUrl": "https://upload.wikimedia.org/wikipedia/en/thumb/6/64/YesFMManila2024.png/250px-YesFMManila2024.png",
        "streamingUrl": "https://azura.yesfm.com.ph/listen/yes_fm_manila/radio.mp3",
        "genre": "Top 40"
    },
    {
        "id": "7",
        "name": "Yes FM CDO",
        "currentSong": "",
        "logoUrl": "https://static.mytuner.mobi/media/tvos_radios/702/yes-fm-cagayan-de-oro-1047.ae3600e7.jpg",
        "streamingUrl": "https://yesfmcdo.radioca.st/;",
        "genre": "Classic"
    },
    {
        "id": "8",
        "name": "I FM",
        "currentSong": "",
        "logoUrl": "https://is1-ssl.mzstatic.com/image/thumb/Purple113/v4/54/dd/e4/54dde455-6922-650a-0785-6c9a844663e7/source/512x512bb.jpg",
        "streamingUrl": "https://magic.radioca.st/stream",
        "genre": "Pop"
    },
    {
        "id": "9",
        "name": "BRGY LS",
        "currentSong": "",
        "logoUrl": "https://upload.wikimedia.org/wikipedia/en/thumb/a/ad/Barangay_LS_97.1_logo_2023.png/420px-Barangay_LS_97.1_logo_2023.png",
        "streamingUrl": "https://stream.zeno.fm/dphe9050afhvv",
        "genre": "Chill Out"
    },
    {
        "id": "10",
        "name": "STAR FM",
        "currentSong": "",
        "logoUrl": "https://upload.wikimedia.org/wikipedia/en/6/60/1027starfm.png",
        "streamingUrl": "https://stream-144.zeno.fm/69b1kf7q0y5tv",
        "genre": "Pop"
    }
];

// Audio object
let audio = new Audio();
let currentStationIndex = -1; // -1 indicates no station is selected initially
let isPlaying = false;

// DOM Elements
const stationsContainer = document.getElementById('stations-container');
const mainLogo = document.getElementById('main-logo');
const mainName = document.getElementById('main-name');
const mainGenre = document.getElementById('main-genre');
const mainSong = document.getElementById('main-song');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const volumeSlider = document.getElementById('volume-slider');
const playingStatus = document.getElementById('playing-status');
const searchInput = document.querySelector('.search-bar input');

/**
 * Initializes the application.
 * This function is called after the window loads and the station data is fetched.
 */
function init() {
    renderStations();
    setupEventListeners();
    audio.volume = volumeSlider.value;
}

/**
 * Renders the radio station cards dynamically from the radioStations array.
 */
function renderStations() {
    stationsContainer.innerHTML = '';
    radioStations.forEach((station, index) => {
        const card = document.createElement('div');
        card.className = 'station-card';
        card.innerHTML = `
            <img class="card-logo" src="${station.logoUrl}" alt="${station.name}" onerror="this.src='https://placehold.co/150x150/252525/fff?text=Logo'">
            <div class="card-content">
                <h3 class="card-name">${station.name}</h3>
                <p class="card-genre">${station.genre}</p>
                <div class="card-controls">
                    <button class="card-btn" data-index="${index}">
                        <i class="fas fa-play"></i>
                    </button>
                    <div class="now-playing">
                        <div class="indicator"></div>
                        <span>Live</span>
                    </div>
                </div>
            </div>
        `;
        stationsContainer.appendChild(card);
    });
    updatePlayButtons();
}

/**
 * Sets up all the event listeners for user interactions.
 */
function setupEventListeners() {
    // Event listener for station card play buttons
    stationsContainer.addEventListener('click', function(event) {
        const button = event.target.closest('.card-btn');
        if (button) {
            const index = parseInt(button.getAttribute('data-index'));
            playStation(index);
        }
    });

    // Event listeners for main player controls
    playBtn.addEventListener('click', togglePlayPause);
    prevBtn.addEventListener('click', playPrevious);
    nextBtn.addEventListener('click', playNext);
    volumeSlider.addEventListener('input', () => {
        audio.volume = volumeSlider.value;
    });

    // Event listener for search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        document.querySelectorAll('.station-card').forEach((card, index) => {
            const stationName = radioStations[index].name.toLowerCase();
            if (stationName.includes(searchTerm)) {
                card.style.display = 'flex'; // Use flex to maintain layout
            } else {
                card.style.display = 'none';
            }
        });
    });
}

/**
 * Plays a specific radio station by index.
 * @param {number} index - The index of the station to play.
 */
function playStation(index) {
    // If the same station is clicked, just toggle play/pause
    if (index === currentStationIndex) {
        togglePlayPause();
        return;
    }

    currentStationIndex = index;
    const station = radioStations[index];

    // Update main player display
    mainLogo.src = station.logoUrl;
    mainName.textContent = station.name;
    mainGenre.textContent = station.genre;
    mainSong.textContent = station.currentSong || 'Loading stream...';

    // Stop current audio and play the new one
    audio.pause();
    audio.src = station.streamingUrl;

    audio.play()
        .then(() => {
            isPlaying = true;
            updatePlayButtons();
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            playingStatus.textContent = 'Now Playing';
        })
        .catch(error => {
            console.error('Error playing audio:', error);
            mainSong.textContent = 'Error: Could not load stream';
            isPlaying = false;
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            playingStatus.textContent = 'Paused';
        });
}

/**
 * Toggles the play/pause state of the current audio stream.
 */
function togglePlayPause() {
    if (audio.src === '') {
        // If no station is selected, play the first one.
        playStation(0);
        return;
    }

    if (isPlaying) {
        audio.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        playingStatus.textContent = 'Paused';
    } else {
        audio.play()
            .then(() => {
                playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                playingStatus.textContent = 'Now Playing';
            })
            .catch(error => {
                console.error('Error playing audio:', error);
                mainSong.textContent = 'Error: Could not load stream';
            });
    }
    isPlaying = !isPlaying;
    updatePlayButtons();
}

/**
 * Plays the previous station in the list.
 */
function playPrevious() {
    // Ensure a station is selected before trying to play a previous one
    if (currentStationIndex === -1) {
        playStation(radioStations.length - 1);
        return;
    }
    currentStationIndex = (currentStationIndex - 1 + radioStations.length) % radioStations.length;
    playStation(currentStationIndex);
}

/**
 * Plays the next station in the list.
 */
function playNext() {
    // Ensure a station is selected before trying to play a next one
    if (currentStationIndex === -1) {
        playStation(0);
        return;
    }
    currentStationIndex = (currentStationIndex + 1) % radioStations.length;
    playStation(currentStationIndex);
}

/**
 * Updates the play/pause icons on the station cards based on the current state.
 */
function updatePlayButtons() {
    document.querySelectorAll('.card-btn').forEach((button, index) => {
        const icon = button.querySelector('i');
        if (index === currentStationIndex && isPlaying) {
            icon.className = 'fas fa-pause';
            button.classList.add('playing');
        } else {
            icon.className = 'fas fa-play';
            button.classList.remove('playing');
        }
    });
    // Update the now playing indicator on the cards
    document.querySelectorAll('.now-playing').forEach((indicator, index) => {
        if (index === currentStationIndex && isPlaying) {
            indicator.style.display = 'flex';
        } else {
            indicator.style.display = 'none';
        }
    });
}

// Fetch the data and then initialize the app
fetch('stations.json')
    .then(response => {
        if (!response.ok) {
            // Throw an error if the network response is not OK (e.g., 404 Not Found)
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // If the fetch is successful, use the data from the JSON file
        radioStations = data;
        // The app can only be initialized after the data is loaded
        window.addEventListener('DOMContentLoaded', init);
    })
    .catch(error => {
        // If the fetch fails for any reason, use the fallback data
        console.error('Error loading stations data:', error);
        radioStations = fallbackStations;
        // The app can now be initialized with the fallback data
        window.addEventListener('DOMContentLoaded', init);

        // Display a message to the user if data loading fails
        const errorDiv = document.createElement('div');
        errorDiv.textContent = 'Failed to load radio stations. Using fallback data.';
        errorDiv.style.cssText = 'color: #f7b731; text-align: center; margin-top: 20px;';
        stationsContainer.innerHTML = ''; // Clear previous content
        stationsContainer.appendChild(errorDiv);
    });

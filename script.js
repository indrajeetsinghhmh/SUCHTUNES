console.log("Let's go Baby");

let currentAudio = null; // 🔴 Track the current playing audio
let lastInvertedDiv = null;
let songs = [];
let currentFolderIndex = 0;
let foldersList = [];

function formatTime(seconds) {
  let minutes = Math.floor(seconds / 60);
  let secs = Math.floor(seconds % 60);

  let formattedMinutes = String(minutes).padStart(2, "0");
  let formattedSeconds = String(secs).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function fetchSongs(artist) {
  let a = await fetch(`https://github.com/indrajeetsinghhmh/SUCHTUNES/tree/main/songs/${artist}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href);
    }
  }
  return songs;
}

function playAudio(url) {
  const result = decodeURIComponent(
    url.substring(url.lastIndexOf("/") + 1, url.indexOf(".mp3"))
  );

  const divs = document.querySelectorAll(".songNames");
  let targetDiv = null;

  divs.forEach((div) => {
    const h2 = div.querySelector("h2");
    if (h2 && h2.textContent === result) {
      targetDiv = div;
    }
  });

  const audio = new Audio(url);

  if (lastInvertedDiv && lastInvertedDiv !== targetDiv) {
    lastInvertedDiv.classList.remove("invert");
  }

  if (currentAudio && currentAudio !== audio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  if (audio.paused) {
    audio.play();
    currentAudio = audio;
    play.src = "/icons/pause.svg";
    if (targetDiv) targetDiv.classList.add("invert");
    lastInvertedDiv = targetDiv;
    document.querySelector(".songinfo").innerHTML = result;

    localStorage.setItem("lastPlayedSong", url);
    localStorage.setItem("lastPlayedName", result);

    currentAudio.addEventListener("timeupdate", () => {
      document.querySelector(".songtime").innerHTML = `${formatTime(
        currentAudio.currentTime
      )}/${formatTime(currentAudio.duration)}`;
      document.querySelector(".circle").style.left =
        (currentAudio.currentTime / currentAudio.duration) * 100 + "%";
    });

    // 🔥 Add auto play next song logic
    currentAudio.addEventListener("ended", async () => {
      let index = songs.indexOf(url);
      if (index + 1 < songs.length) {
        playAudio(songs[index + 1]); // Next song
      } else {
        // All songs in this playlist are played, load next folder
        if (currentFolderIndex + 1 < foldersList.length) {
          currentFolderIndex++;
          const nextFolder = foldersList[currentFolderIndex];
          await playSong(nextFolder); // Load next playlist
          playAudio(songs[0]); // Play first song of next playlist
        } else {
          console.log("All playlists finished.");
        }
      }
    });
  } else {
    audio.pause();
    if (targetDiv) targetDiv.classList.remove("invert");
    currentAudio = null;
    lastInvertedDiv = null;
  }
}

function attachSeekbarListener() {
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    if (!currentAudio) return;

    const percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentAudio.currentTime = (currentAudio.duration * percent) / 100;
  });
}

async function playSong(artist) {
  songs = await fetchSongs(artist);

  // Update currentFolderIndex
  currentFolderIndex = foldersList.findIndex((f) => f === artist);

  const songListContainer = document.querySelector(".songList");
  songListContainer.innerHTML = "";

  songs.forEach((url) => {
    const result = decodeURIComponent(
      url.substring(
        url.indexOf(`${artist}/`) + `${artist}/`.length,
        url.indexOf(".mp3")
      )
    );

    const div = document.createElement("div");
    div.classList.add("songNames");

    const h2 = document.createElement("h2");
    h2.textContent = result;

    const btn = document.createElement("button");
    btn.textContent = "Play";
    btn.classList.add("playBtn");

    div.append(h2, btn);
    songListContainer.appendChild(div);

    btn.addEventListener("click", () => playAudio(url));
  });

  attachSeekbarListener();
}

// attach an event listner to play, next, previous
play.addEventListener("click", (e) => {
  if (currentAudio) {
    if (currentAudio.paused) {
      currentAudio.play();
      play.src = "/icons/pause.svg";
    } else {
      currentAudio.pause();
      play.src = "/icons/play.svg";
    }
  }
});

previous.addEventListener("click", () => {
  console.log("previous song");
  let index = songs.indexOf(currentAudio.src);
  if (index - 1 >= 0) {
    playAudio(songs[index - 1]);
  }
});
next.addEventListener("click", () => {
  console.log("next song");
  let index = songs.indexOf(currentAudio.src);
  if (index + 1 < songs.length) {
    playAudio(songs[index + 1]);
  }
});

// add event listner to volume
document
  .querySelector(".range")
  .getElementsByTagName("input")[0]
  .addEventListener("mousemove", (e) => {
    currentAudio.volume = parseInt(e.target.value) / 100;
    let img = document.querySelector(".volicon");
    if (currentAudio.volume == 0) {
      img.src = "icons/mute.svg";
    } else {
      img.src = "icons/volume.svg";
    }
  });

document.querySelector(".volicon").addEventListener("click", (e) => {
  let img = document.querySelector(".volicon");
  if (currentAudio.volume) {
    currentAudio.volume = 0;
    img.src = "icons/mute.svg";
  } else {
    currentAudio.volume = 0.02;
    img.src = "icons/volume.svg";
  }
});

// searching the song
document.getElementById("searchSong").addEventListener("input", function () {
  const searchValue = this.value.toLowerCase();
  const songItems = document.querySelectorAll(".songNames");

  songItems.forEach((item) => {
    const songTitle = item.querySelector("h2").textContent.toLowerCase();
    if (songTitle.includes(searchValue)) {
      item.style.display = ""; // Show matching song
    } else {
      item.style.display = "none"; // Hide non-matching song
    }
  });
});


// get folders or playlists
async function getFolderNames() {
  let res = await fetch("https://github.com/indrajeetsinghhmh/SUCHTUNES/tree/main/songs");
  let html = await res.text();

  let container = document.createElement("div");
  container.innerHTML = html;

  let links = container.querySelectorAll("a");
  // console.log(links);
  let folders = [];

  links.forEach((link) => {
    let href = link.getAttribute("href");
    if (href.startsWith("/songs/")) {
      folders.push(href.replace("/songs/", ""));
    }
  });
  // console.log("Folders:", folders);
  return folders;
}

async function songsContainer() {
  foldersList = await getFolderNames(); // Store globally
  const folders = await getFolderNames();
  let firstSongPlayed = false;
  for (let i = 0; i < foldersList.length; i++) {
    let url = `https://github.com/indrajeetsinghhmh/SUCHTUNES/tree/main/songs/${folders[i]}/info.json`;
    const response = await fetch(url);
    const data = await response.json();
    // console.log(data);
    let div = document.createElement("div");
    div.classList.add("card");
    let img = document.createElement("img");
    img.src = data.image;
    let h2 = document.createElement("h2");
    h2.innerHTML = data.folder;
    let p = document.createElement("p");
    p.innerHTML = data.desc;
    div.appendChild(img);
    div.appendChild(h2);
    div.appendChild(p);

    let cardContainer = document.querySelector(".cardContainer");
    cardContainer.appendChild(div);

    div.addEventListener("click", async () => {
      let list = document.querySelector(".songList");
      list.innerHTML = "";
      currentFolderIndex = i; // Track current folder index
      await playSong(data.search);
    });
  }
}

// loading previously played song
function loadPreviousSong() {
  let url = localStorage.getItem("lastPlayedSong");
  let result = localStorage.getItem("lastPlayedName");

  if (url && result) {
    let audio = new Audio(url);
    currentAudio = audio;
    currentAudio.currentTime = 0; // Start from 0

    document.querySelector(".songinfo").innerHTML = result;
    play.src = "/icons/play.svg"; // Song is paused initially

    currentAudio.addEventListener("loadedmetadata", () => {
      // Ensure metadata (like duration) is loaded before accessing duration
      const duration = currentAudio.duration;

      // Reset UI
      document.querySelector(".songtime").innerHTML = `00:00/${formatTime(
        duration
      )}`;
      document.querySelector(".circle").style.left = "0%";

      // Optional: store duration if needed
      localStorage.setItem("lastPlayedTime", 0);
    });

    // Also listen for timeupdate to update UI if the user presses play later
    currentAudio.addEventListener("timeupdate", () => {
      const circle = document.querySelector(".circle");
      if (circle && currentAudio.duration) {
        circle.style.left = `${
          (currentAudio.currentTime / currentAudio.duration) * 100
        }%`;

        document.querySelector(".songtime").innerHTML = `${formatTime(
          currentAudio.currentTime
        )}/${formatTime(currentAudio.duration)}`;

        localStorage.setItem("lastPlayedTime", currentAudio.currentTime);
      }
    });
  }
}

playSong("arjitSingh");
songsContainer();
loadPreviousSong();
currentAudio.volume = 0.2;

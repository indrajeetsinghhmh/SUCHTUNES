# SUCHTUNES
Suchtunes is a sleek, responsive web music player where you can listen to the songs, search for any track instantly, and create dynamic playlists. Enjoy a smooth, personalized music experience across all devices—no app install needed, just press play and vibe.


# 🎵 Suchtunes – Tune In. Vibe Out.

**Suchtunes** is a dynamic, browser-based music player web app that allows users to stream songs, search for music, manage playlists, and enjoy responsive audio controls. It provides a clean and engaging UI for a modern music streaming experience.

---

## 🚀 Features

- 🎧 **Play Music Instantly** – Click and play any song from any playlist.
- 🔍 **Search Functionality** – Real-time search to find your favorite tracks.
- 🔁 **Auto Play** – Automatically plays the next song or the next playlist.
- 📁 **Dynamic Playlists** – Folders are treated as dynamic playlists using local JSON metadata.
- 💾 **Playback Persistence** – Last played song and its progress is saved in localStorage.
- 🎛️ **Volume & Seek Control** – Fully working seek bar and volume slider with mute/unmute toggle.
- 📱 **Responsive Design** – Looks great on all devices: mobile, tablet, and desktop.

---

## 🛠 Tech Stack

- **HTML5**
- **CSS3**
- **JavaScript (ES6)**
- **LocalStorage API**
- **Fetch API**

---

## 📁 Folder Structure

```
suchtunes/
│
├── index.html               # Main HTML file
├── style.css                # All styling
├── script.js                # App logic and functionality
│
├── /icons/                 # Icons for buttons, nav, volume, etc.
│   └── play.svg, pause.svg, volume.svg, etc.
│
├── /songs/                 # Song folders, each containing:
│   └── artistFolder/
│       ├── 128-SongName.mp3
│       └── info.json       # Contains image, folder name & description
```

---

## 🧠 How It Works

1. **Folder Fetching**: The app dynamically fetches all playlist folders from the `/songs/` directory.
2. **Metadata**: Each playlist contains an `info.json` file which includes the image, name, and description of the playlist.
3. **Song Fetching**: When a user clicks on a card, all `.mp3` files from that folder are listed.
4. **Search**: Filters the visible songs as the user types in the input box.
5. **Play Functionality**:
   - Automatically updates the UI (song name, time, circle progress).
   - Stores last played song and time in `localStorage`.
6. **Auto Play**:
   - After a song ends, the next one plays.
   - If the playlist ends, the next folder (playlist) auto-loads.
7. **Volume & Time Control**: Users can control volume and seek position manually.

---

## 🧪 Setup Instructions

1. Clone the repository or download the files:

```
git clone https://github.com/indrajeetsinghhmh/suchtunes.git
```

2. Run it using a local server:

```bash
# VS Code Live Server
# or Python HTTP Server
python -m http.server
```

3. Make sure your folder structure inside `/songs/` looks like:

```
songs/
└── arjitSingh/
    ├── 128-Naina.mp3
    └── info.json
```

**Example `info.json`:**

```json
{
  "image": "https://link-to-cover-image.jpg",
  "folder": "Arjit Singh",
  "desc": "Best of Arjit Singh's soulful tracks."
}
```

---

## 🔮 Future Improvements

- Add user login & playlist saving.
- Upload your own music files.
- Real-time lyrics integration.
- Dark mode toggle.
- Mobile app version using PWA or React Native.

---

## 📜 License

MIT License. Free to use, customize, and distribute.

---

## 🙌 Author

**Indrajeet Singh**  
Crafted with ❤️ for web and music lovers everywhere.

import { useState } from 'react';
import { open } from '@tauri-apps/plugin-dialog';
import './App.css';

const songs = [
  {
    title: 'Midnight City',
    artist: 'M83',
    album: "Hurry Up, We're Dreaming",
    duration: '4:03',
  },
  { title: 'Intro', artist: 'The xx', album: 'xx', duration: '2:07' },
  { title: 'A Walk', artist: 'Tycho', album: 'Dive', duration: '5:16' },
  {
    title: 'Instant Crush',
    artist: 'Daft Punk',
    album: 'Random Access Memories',
    duration: '5:37',
  },
  { title: 'Nightcall', artist: 'Kavinsky', album: 'OutRun', duration: '4:18' },
];

function App() {
  const [selected, setSelected] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [lyricsMode, setLyricsMode] = useState(false);
  const [section, setSection] = useState('Reproduciendo');
  const [localSongs, setLocalSongs] = useState<any[]>([]);

  const song = songs[selected];
  const allSongs = [...songs, ...localSongs];

  return (
    <main className="app">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">◉</span>
          <span>
            sonder<span className="brand-light">music</span>
          </span>
        </div>

        <div className="nav-section">
          <span className="nav-label">BIBLIOTECA</span>
          {['Reproduciendo', 'Canciones', 'Álbumes', 'Artistas'].map((item) => (
            <button
              key={item}
              className={`nav-item ${section === item ? 'active' : ''}`}
              onClick={() => setSection(item)}
            >
              <span className="nav-symbol">
                {item === 'Reproduciendo'
                  ? '◉'
                  : item === 'Canciones'
                    ? '♫'
                    : item === 'Álbumes'
                      ? '▦'
                      : '♙'}
              </span>
              {item}
            </button>
          ))}
        </div>

        <div className="nav-section">
          <span className="nav-label">COLECCIÓN</span>
          <button className="nav-item">
            <span className="nav-symbol">＋</span>
            Nueva lista
          </button>
        </div>

        <div className="sidebar-bottom">
          <span className="status-dot" />
          <span>Biblioteca local</span>
        </div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Biblioteca</span>
            <span className="separator">/</span>
            <strong>{lyricsMode ? 'Letras' : section}</strong>
          </div>
          <button className="icon-button" title="Configuración">
            ⚙
          </button>
        </header>

        <div className="content">
          <div className="now-playing">
            <div className="section-heading">
              <span className="eyebrow">ESCUCHANDO AHORA</span>
              <button
                className={`lyrics-toggle ${lyricsMode ? 'selected' : ''}`}
                onClick={() => setLyricsMode(!lyricsMode)}
              >
                ♫ <span>{lyricsMode ? 'Portada' : 'Ver letras'}</span>
              </button>
            </div>

            {lyricsMode ? (
              <div className="lyrics-view">
                <span className="eyebrow">
                  LETRAS · {song.title.toUpperCase()}
                </span>
                <div className="lyrics-lines">
                  <p className="lyric-muted">Let the night surround you</p>
                  <p className="lyric-active">Waiting for a sign</p>
                  <p className="lyric-muted">Somewhere in the distance</p>
                  <p className="lyric-muted">A light begins to shine</p>
                </div>
                <span className="lyrics-note">
                  Vista de demostración · Próximamente LRC sincronizado
                </span>
              </div>
            ) : (
              <>
                <div className="album-art">
                  <div className="art-orbit orbit-one" />
                  <div className="art-orbit orbit-two" />
                  <div className="art-sun" />
                  <div className="art-title">SONDER</div>
                  <div className="art-subtitle">A MOMENT IN TIME</div>
                  <div className="art-index">SM — 001</div>
                </div>

                <div className="track-info">
                  <div>
                    <h1>{song.title}</h1>
                    <p>
                      {song.artist} <span>·</span> {song.album}
                    </p>
                  </div>
                  <button className="favorite-button" title="Favorito">
                    ♡
                  </button>
                </div>
              </>
            )}
          </div>

          <aside className="queue">
            <div className="queue-heading">
              <div>
                <span className="eyebrow">A CONTINUACIÓN</span>
                <h2>Lista de reproducción</h2>
              </div>
              <span className="track-count">{songs.length} pistas</span>
            </div>

            <div className="queue-list">
              {songs.map((item, index) => (
                <button
                  key={item.title}
                  className={`queue-item ${selected === index ? 'current' : ''}`}
                  onClick={() => {
                    setSelected(index);
                    setPlaying(true);
                  }}
                >
                  <span className="track-number">
                    {selected === index && playing
                      ? '♫'
                      : String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="queue-track">
                    <strong>{item.title}</strong>
                    <small>{item.artist}</small>
                  </span>
                  <span className="track-duration">{item.duration}</span>
                </button>
              ))}
            </div>

            <button
              className="add-music"
              onClick={async () => {
                const files = await open({
                  multiple: true,
                  filters: [
                    {
                      name: 'Archivos de audio',
                      extensions: ['mp3', 'flac', 'wav', 'ogg', 'm4a'],
                    },
                  ],
                });

                if (files) {
                  console.log('Archivos seleccionados:', files);
                }
              }}
            >
              <span>＋</span> Añadir música
            </button>
          </aside>
        </div>

        <footer className="player">
          <div className="player-song">
            <div className="mini-art">S</div>
            <div>
              <strong>{song.title}</strong>
              <span>{song.artist}</span>
            </div>
          </div>

          <div className="playback">
            <div className="playback-buttons">
              <button
                onClick={() =>
                  setSelected((selected - 1 + songs.length) % songs.length)
                }
                title="Anterior"
              >
                |◀
              </button>
              <button
                className="play-button"
                onClick={() => setPlaying(!playing)}
                title={playing ? 'Pausar' : 'Reproducir'}
              >
                {playing ? 'Ⅱ' : '▶'}
              </button>
              <button
                onClick={() => setSelected((selected + 1) % songs.length)}
                title="Siguiente"
              >
                ▶|
              </button>
            </div>
            <div className="progress-row">
              <span>0:00</span>
              <div className="progress-track">
                <div className="progress-fill" />
              </div>
              <span>{song.duration}</span>
            </div>
          </div>

          <div className="player-options">
            <button title="Letras" onClick={() => setLyricsMode(!lyricsMode)}>
              ♫
            </button>
            <span className="volume-symbol">◖</span>
            <div className="volume-track">
              <div />
            </div>
          </div>
        </footer>
      </section>
    </main>
  );
}

export default App;

use lofty::prelude::*;
use lofty::probe::Probe;
use serde::Serialize;
use std::path::Path;

#[derive(Serialize)]
struct SongMetadata {
    title: String,
    artist: String,
    album: String,
    duration: String,
}

#[tauri::command]
fn read_mp3_metadata(path: String) -> Result<SongMetadata, String> {
    let tagged_file = Probe::open(&path)
        .map_err(|e| e.to_string())?
        .read()
        .map_err(|e| e.to_string())?;

    let properties = tagged_file.properties();

    let tag = tagged_file
        .primary_tag()
        .or_else(|| tagged_file.first_tag());

    let title = tag
        .and_then(|t| t.title())
        .map(|s| s.to_string())
        .unwrap_or_else(|| {
            Path::new(&path)
                .file_stem()
                .and_then(|s| s.to_str())
                .unwrap_or("Desconocido")
                .to_string()
        });

    let artist = tag
        .and_then(|t| t.artist())
        .map(|s| s.to_string())
        .unwrap_or_else(|| "Desconocido".to_string());

    let album = tag
        .and_then(|t| t.album())
        .map(|s| s.to_string())
        .unwrap_or_else(|| "Desconocido".to_string());

    let total_seconds = properties.duration().as_secs();

    let duration = format!(
        "{}:{:02}",
        total_seconds / 60,
        total_seconds % 60
    );

    Ok(SongMetadata {
        title,
        artist,
        album,
        duration,
    })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            read_mp3_metadata
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

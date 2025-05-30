// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use declarative_discord_rich_presence::activity::{Activity, Button, Timestamps};
use declarative_discord_rich_presence::DeclarativeDiscordIpcClient;
use sha2::{Digest, Sha256};
use std::env;
use std::fmt::{Display, Formatter};
use std::fs;
use std::fs::File;
use std::io::Read;
use std::io::Write;
use std::os::windows::process::CommandExt;
use std::path::Path;
use std::process::Command;
use sysinfo::{System, SystemExt};
use unrar::Archive;

const CREATE_NO_WINDOW: u32 = 0x08000000;

#[derive(Debug)]
enum RichPresenceError {
    SetActivityError(String),
}

impl Display for RichPresenceError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            RichPresenceError::SetActivityError(msg) => {
                write!(f, "Setting activity failed: {}", msg)
            }
        }
    }
}

impl std::error::Error for RichPresenceError {}

#[tauri::command]
fn rich_presence() {
    let client = DeclarativeDiscordIpcClient::new("1131105056603783249");

    client.enable();

    let buttons = vec![Button::new(
        String::from("Discord"),
        String::from("https://discord.gg/carbon-897532507048796210"),
    )];

    let timestamp = Timestamps::new();

    let _ = client
        .set_activity(
            Activity::new()
                .buttons(buttons)
                .timestamps(timestamp)
                .details("Cranium V1.7"),
        )
        .map_err(|e| RichPresenceError::SetActivityError(e.to_string()));
}

#[tauri::command]
async fn check_file_exists(path: &str, size: Option<u64>) -> Result<bool, String> {
    let file_path = std::path::PathBuf::from(path);

    if !file_path.exists() {
        return Ok(false);
    }

    let _file_size = match size {
        Some(expected_size) => {
            let actual_size = match file_path.metadata() {
                Ok(metadata) => metadata.len(),
                Err(err) => {
                    return Err(err.to_string());
                }
            };
            if actual_size == expected_size {
                Some(actual_size)
            } else {
                None
            }
        }
        None => None,
    };

    Ok(true)
}

#[tauri::command]
fn extract_rar(path: &str) -> Result<(), String> {
    let rar_file = std::path::Path::new(path);
    if !rar_file.exists() {
        return Err(format!("RAR file not found: {}", path));
    }

    let mut archive = Archive::new(path).open_for_processing().unwrap();
    while let Some(header) = archive.read_header().unwrap() {
        println!(
            "{} bytes: {}",
            header.entry().unpacked_size,
            header.entry().filename.to_string_lossy()
        );

        archive = if header.entry().is_file() {
            let path_file = std::path::Path::new(&path)
                .parent()
                .unwrap()
                .join(header.entry().filename.as_path());
            header
                .extract_to(path_file.as_path())
                .map_err(|e| format!("Failed to extract: {}", e))?
        } else {
            header
                .skip()
                .map_err(|e| format!("Failed to skip: {}", e))?
        };
    }
    std::fs::remove_file(rar_file).expect("Could not delete rar file");
    Ok(())
}

#[tauri::command]
fn exit_all() {
    let mut system = System::new_all();
    system.refresh_all();
    const CREATE_NO_WINDOW: u32 = 0x08000000;

    let processes = vec![
        "EpicGamesLauncher.exe",
        "FortniteLauncher.exe",
        "FortniteClient-Win64-Shipping_EAC.exe",
        "FortniteClient-Win64-Shipping.exe",
        "FortniteClient-Win64-Shipping_BE.exe",
        "EasyAntiCheat_EOS.exe",
        "EpicWebHelper.exe",
        "CarbonLauncher.exe",
    ];

    for process in processes.iter() {
        let mut cmd = Command::new("taskkill");
        cmd.arg("/F");
        cmd.arg("/IM");
        cmd.arg(process);
        cmd.creation_flags(CREATE_NO_WINDOW);
        cmd.spawn();
    }

    let output = Command::new("wmic")
        .arg("process")
        .arg("where")
        .arg("name='node.exe'")
        .arg("get")
        .arg("processid,commandline")
        .output()
        .expect("wmic fail");

    let output_str = String::from_utf8_lossy(&output.stdout);

    if !output.stdout.is_empty() {
        for line in output_str.lines().skip(1) {
            let line = line.trim();
            if line.contains("app.js") {
                let columns: Vec<&str> = line.split_whitespace().collect();
                if let Some(pid_str) = columns.last() {
                    if let Ok(pid) = pid_str.parse::<u32>() {
                        let mut cmd = Command::new("taskkill");
                        cmd.arg("/F");
                        cmd.arg("/PID");
                        cmd.arg(pid.to_string());
                        cmd.creation_flags(CREATE_NO_WINDOW);
                        cmd.spawn();
                    } else {
                        println!("fail on parse PID: {}", line);
                    };
                }
            }
        }
    } else {
        println!("Neonite isnt running.");
    }
}

#[tauri::command]
fn download_game_file(url: &str, dest: &str) -> Result<(), String> {
    let dest_path = Path::new(dest);
    if let Some(parent) = dest_path.parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }
    let response = reqwest::blocking::get(url).map_err(|e| e.to_string())?;
    if !response.status().is_success() {
        return Err(format!("Failed to download file: {}", response.status()));
    }
    let mut file = fs::File::create(dest_path).map_err(|e| e.to_string())?;
    let content = response.bytes().map_err(|e| e.to_string())?;
    file.write_all(&content).map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
async fn calculate_sha256_of_file(file_path: String) -> Result<String, String> {
    let file_path = std::path::PathBuf::from(file_path);

    if !file_path.exists() {
        return Err("File does not exist".to_string());
    }
    let bytes = std::fs::read(file_path).unwrap();
    let hash = Sha256::digest(&bytes);
    return Ok(format!("{:x}", hash));
}

#[tauri::command]
fn get_fortnite_processid() -> Result<Option<String>, String> {
    let output = std::process::Command::new("wmic")
        .creation_flags(CREATE_NO_WINDOW)
        .args(&[
            "process",
            "where",
            "name='FortniteClient-Win64-Shipping.exe'",
            "get",
            "ExecutablePath",
        ])
        .output()
        .map_err(|e| e.to_string())?;

    let output_str = String::from_utf8_lossy(&output.stdout);

    for line in output_str.lines() {
        let trimmed = line.trim();
        if !trimmed.is_empty() && !trimmed.starts_with("ExecutablePath") {
            return Ok(Some(trimmed.to_string()));
        }
    }

    Ok(None)
}

#[tauri::command]
fn experience(path: String, username: String, _version: String, n: String) -> Result<bool, String> {
    let game_path = std::path::PathBuf::from(path.clone());

    let appdata_path = match dirs::data_local_dir() {
        Some(path) => path,
        None => {
            return Err("Failed to get appdata directory".to_string());
        }
    };

    let mut c_exe = appdata_path.clone();
    c_exe.push("com.crbon.xyz\\Resources\\CarbonLauncher.exe");

    let mut neonite_bat = appdata_path.clone();
    neonite_bat.push("com.crbon.xyz\\Resources\\NeoniteV2\\Start Neonite.bat");

    if n == "true" {
        let _neonite = Command::new(neonite_bat)
            .creation_flags(CREATE_NO_WINDOW)
            .spawn()
            .map_err(|e| format!("Failed to start Neonite: {}", e))?;
    }

    let _carbon = Command::new(c_exe)
        .arg("-p")
        .arg(game_path.to_str().unwrap())
        .arg("-n")
        .arg(username)
        .creation_flags(CREATE_NO_WINDOW)
        .spawn()
        .map_err(|e| format!("Failed to start Carbon: {}", e))?;

    Ok(true)
}

#[tauri::command]
fn search_for_version(path: &str) -> Result<Vec<String>, String> {
    let mut file = File::open(path).map_err(|e| e.to_string())?;
    let mut buffer = Vec::new();
    file.read_to_end(&mut buffer).map_err(|e| e.to_string())?;

    let pattern = [
        0x2b, 0x00, 0x2b, 0x00, 0x46, 0x00, 0x6f, 0x00, 0x72, 0x00, 0x74, 0x00, 0x6e, 0x00, 0x69,
        0x00, 0x74, 0x00, 0x65, 0x00, 0x2b, 0x00,
    ];

    let mut matches = Vec::new();
    for (i, window) in buffer.windows(pattern.len()).enumerate() {
        if window == pattern {
            let _start = i.saturating_sub(32);
            let end = (i + pattern.len() + 64).min(buffer.len());

            let end_index = find_end(&buffer[i + pattern.len()..end]);
            if let Some(end) = end_index {
                let utf16_slice = unsafe {
                    std::slice::from_raw_parts(
                        buffer[i..i + pattern.len() + end].as_ptr() as *const u16,
                        (pattern.len() + end) / 2,
                    )
                };
                let s = String::from_utf16_lossy(utf16_slice);
                matches.push(s.trim_end_matches('\0').to_string());
            }
        }
    }

    Ok(matches)
}

fn find_end(data: &[u8]) -> Option<usize> {
    let mut i = 0;
    while i + 1 < data.len() {
        if data[i] == 0 && data[i + 1] == 0 {
            return Some(i);
        }
        i += 2;
    }
    None
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            exit_all,
            rich_presence,
            calculate_sha256_of_file,
            download_game_file,
            check_file_exists,
            get_fortnite_processid,
            extract_rar,
            search_for_version,
            experience
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use declarative_discord_rich_presence::activity::{ Activity, Button, Timestamps };
use declarative_discord_rich_presence::DeclarativeDiscordIpcClient;
use std::fmt::{ Display, Formatter };
use std::os::windows::process::CommandExt;
use std::process::Command;
use sysinfo::{ System, SystemExt };
use sha2::{ Digest, Sha256 };
use std::fs;
use std::io::Write;
use std::path::Path;

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

    let buttons = vec![
        Button::new(
            String::from("Discord"),
            String::from("https://discord.gg/carbon-897532507048796210")
        )
    ];

    let timestamp = Timestamps::new();

    let _ = client
        .set_activity(
            Activity::new().buttons(buttons).timestamps(timestamp).details("Cranium V1.7")
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
        "EpicWebHelper.exe"
    ];

    for process in processes.iter() {
        let mut cmd = Command::new("taskkill");
        cmd.arg("/F");
        cmd.arg("/IM");
        cmd.arg(process);
        cmd.creation_flags(CREATE_NO_WINDOW);
        cmd.spawn().unwrap();
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
fn experience(path: String, username: String, _version: String) -> Result<bool, String> {
    let game_path = std::path::PathBuf::from(path.clone());

    let appdata_path = match dirs::data_local_dir() {
        Some(path) => path,
        None => {
            return Err("Failed to get appdata directory".to_string());
        }
    };

    let mut c_exe = appdata_path.clone();
    c_exe.push("com.crbon.xyz\\Resources\\CarbonLauncher.exe");

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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder
        ::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(
            tauri::generate_handler![
                exit_all,
                rich_presence,
                calculate_sha256_of_file,
                download_game_file,
                check_file_exists,
                experience
            ]
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

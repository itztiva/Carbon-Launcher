// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use declarative_discord_rich_presence::activity::{ Activity, Button, Timestamps };
use declarative_discord_rich_presence::DeclarativeDiscordIpcClient;
use std::fmt::{ Display, Formatter };
use std::os::windows::process::CommandExt;
use std::process::Command;
use sysinfo::{ System, SystemExt };

#[derive(Debug)]
enum RichPresenceError {
    ClientCreationError(String),
    EnableError(String),
    SetActivityError(String),
}

impl Display for RichPresenceError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            RichPresenceError::ClientCreationError(msg) => {
                write!(f, "Client creation failed: {}", msg)
            }
            RichPresenceError::EnableError(msg) => write!(f, "Client enable failed: {}", msg),
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
        "EpicWebHelper.exe",
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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder
        ::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![exit_all, rich_presence, check_file_exists])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

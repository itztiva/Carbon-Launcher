// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::os::windows::process::CommandExt;
use std::process::Command;
use sysinfo::{ System, SystemExt };
use declarative_discord_rich_presence::activity::{ Activity, Button, Timestamps };
use declarative_discord_rich_presence::DeclarativeDiscordIpcClient;
use std::fmt::{ Display, Formatter };

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
        "node.exe"//TODO - since that will kill everything node related, check if the CMD window name has NeoniteV2 as title and only kill that - noah
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
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![exit_all, rich_presence])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

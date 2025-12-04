#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Env, Address, Map, String, Vec, Symbol, symbol_short};

#[contract]
pub struct CryptoStream;

// Keys del storage
const VIDEOS: Symbol = symbol_short!("videos");
const REWARDS: Symbol = symbol_short!("rewards");
const USERS: Symbol = symbol_short!("users");

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct UserProfile {
    pub name: String,
    pub bio: String,
}

#[contractimpl]
impl CryptoStream {
    // Registrar un nuevo video
    pub fn add_video(env: Env, owner: Address, url: String) {
        owner.require_auth(); // solo el dueño puede registrar

        let mut videos: Map<u32, (Address, String)> =
            env.storage().instance().get(&VIDEOS).unwrap_or(Map::new(&env));
        let new_id = (videos.len() as u32) + 1;

        videos.set(new_id, (owner.clone(), url.clone()));
        env.storage().instance().set(&VIDEOS, &videos);

        // Agregar recompensa por añadir video
        Self::add_reward(env.clone(), owner, 10);
    }

    // Obtener todos los videos
    pub fn get_videos(env: Env) -> Vec<(u32, Address, String)> {
        let videos: Map<u32, (Address, String)> =
            env.storage().instance().get(&VIDEOS).unwrap_or(Map::new(&env));
        let mut list = Vec::new(&env);

        for id in videos.keys() {
            if let Some((owner, url)) = videos.get(id) {
                list.push_back((id, owner, url));
            }
        }

        list
    }

    // Eliminar video (solo el dueño)
    pub fn delete_video(env: Env, caller: Address, video_id: u32) {
        caller.require_auth();

        let mut videos: Map<u32, (Address, String)> =
            env.storage().instance().get(&VIDEOS).unwrap_or(Map::new(&env));

        if let Some((owner, _)) = videos.get(video_id) {
            if owner != caller {
                panic!("No tienes permiso para eliminar este video.");
            }
            videos.remove(video_id);
            env.storage().instance().set(&VIDEOS, &videos);
        } else {
            panic!("Video no encontrado.");
        }
    }

    // Recompensas
    pub fn add_reward(env: Env, user: Address, amount: i128) {
        let mut rewards: Map<Address, i128> =
            env.storage().instance().get(&REWARDS).unwrap_or(Map::new(&env));
        let current = rewards.get(user.clone()).unwrap_or(0);
        rewards.set(user.clone(), current + amount);
        env.storage().instance().set(&REWARDS, &rewards);
    }

    pub fn get_rewards(env: Env, user: Address) -> i128 {
        let rewards: Map<Address, i128> =
            env.storage().instance().get(&REWARDS).unwrap_or(Map::new(&env));
        rewards.get(user).unwrap_or(0)
    }

    // Registro de Usuarios
    pub fn register_user(env: Env, user: Address, name: String, bio: String) {
        user.require_auth();

        let mut users: Map<Address, UserProfile> =
            env.storage().instance().get(&USERS).unwrap_or(Map::new(&env));
        
        let profile = UserProfile { name, bio };
        users.set(user, profile);
        
        env.storage().instance().set(&USERS, &users);
    }

    pub fn get_user(env: Env, user: Address) -> Option<UserProfile> {
        let users: Map<Address, UserProfile> =
            env.storage().instance().get(&USERS).unwrap_or(Map::new(&env));
        users.get(user)
    }
}

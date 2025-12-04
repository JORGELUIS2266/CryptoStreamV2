const API_URL = 'http://localhost:3000/api/videos'; // <-- tu endpoint real

export async function registerWallet(publicKey) {
    return fetch(`${API_URL}/register-wallet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicKey })
    }).then(r => r.json());
}

export async function getVideos() {
    return fetch(`${API_URL}/videos`).then(r => r.json());
}

export async function sendReward(videoId, publicKey) {
    return fetch(`${API_URL}/reward`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId, publicKey })
    }).then(r => r.json());
}

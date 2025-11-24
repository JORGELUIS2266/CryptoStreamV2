// freighter.js
export async function connectWallet() {
    if (typeof window.freighterApi === "undefined") {
        throw new Error("Freighter no está instalado");
    }

    const isConnected = await window.freighterApi.isConnected();
    if (!isConnected) throw new Error("Freighter está bloqueado o no autorizado");

    const publicKey = await window.freighterApi.getPublicKey();
    localStorage.setItem("stellarPublicKey", publicKey);

    return publicKey;
}

export async function getSavedWallet() {
    return localStorage.getItem("stellarPublicKey");
}

export async function isFreighterAvailable() {
    return typeof window.freighterApi !== "undefined";
}

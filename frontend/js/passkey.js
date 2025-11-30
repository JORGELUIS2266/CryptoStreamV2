// passkey.js

/**
 * Converts a base64url string to an ArrayBuffer
 */
function base64UrlToBuffer(base64url) {
    const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

/**
 * Converts an ArrayBuffer to a base64url string
 */
function bufferToBase64Url(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

/**
 * Generate a random challenge
 */
function generateChallenge() {
    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);
    return challenge;
}

/**
 * Register a new Passkey
 * @param {string} username - The username to register
 * @returns {Promise<{success: boolean, credentialId?: string, publicKey?: string, error?: string}>}
 */
export async function registerPasskey(username) {
    try {
        const challenge = generateChallenge();
        const userId = Uint8Array.from(username, c => c.charCodeAt(0));

        const publicKeyCredentialCreationOptions = {
            challenge: challenge,
            rp: {
                name: "Cryptostream Passkey",
                id: window.location.hostname,
            },
            user: {
                id: userId,
                name: username,
                displayName: username,
            },
            pubKeyCredParams: [{ alg: -7, type: "public-key" }], // ES256 (secp256r1)
            authenticatorSelection: {
                authenticatorAttachment: "platform",
                userVerification: "required",
            },
            timeout: 60000,
            attestation: "none"
        };

        const credential = await navigator.credentials.create({
            publicKey: publicKeyCredentialCreationOptions
        });

        if (!credential) {
            throw new Error("Registration failed");
        }

        const credentialId = bufferToBase64Url(credential.rawId);

        // Store credential locally for the demo (in a real app, this goes to DB/Contract)
        const stored = JSON.parse(localStorage.getItem("passkey-credentials") || "[]");
        // Remove duplicates
        const filtered = stored.filter(c => c.username !== username);
        filtered.push({
            credentialId,
            username,
            userId: bufferToBase64Url(userId),
            createdAt: new Date().toISOString()
        });
        localStorage.setItem("passkey-credentials", JSON.stringify(filtered));

        return {
            success: true,
            credentialId,
            // In a real app, we would parse the attestationObject to get the public key
            // For this demo, we assume success and will use the ID to look it up or mock the key
            rawId: credentialId
        };

    } catch (err) {
        console.error("Passkey registration error:", err);
        return { success: false, error: err.message };
    }
}

/**
 * Authenticate with a Passkey
 * @returns {Promise<{success: boolean, credentialId?: string, signature?: string, error?: string}>}
 */
export async function authenticatePasskey() {
    try {
        const challenge = generateChallenge();

        // Get allowed credentials from local storage
        const stored = JSON.parse(localStorage.getItem("passkey-credentials") || "[]");
        if (stored.length === 0) {
            throw new Error("No passkeys found. Register first.");
        }

        const allowCredentials = stored.map(cred => ({
            type: "public-key",
            id: base64UrlToBuffer(cred.credentialId)
        }));

        const publicKeyCredentialRequestOptions = {
            challenge: challenge,
            rpId: window.location.hostname,
            userVerification: "required",
            allowCredentials
        };

        const credential = await navigator.credentials.get({
            publicKey: publicKeyCredentialRequestOptions
        });

        if (!credential) {
            throw new Error("Authentication failed");
        }

        const response = credential.response;
        const credentialId = bufferToBase64Url(credential.rawId);
        const signature = bufferToBase64Url(response.signature);

        return {
            success: true,
            credentialId,
            signature,
            userHandle: response.userHandle ? bufferToBase64Url(response.userHandle) : null
        };

    } catch (err) {
        console.error("Passkey auth error:", err);
        return { success: false, error: err.message };
    }
}

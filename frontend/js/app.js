// // ===============================
// // SERVIDOR BASE DE DATOS (API)
// // ===============================
// const serverURLBD = 'http://localhost:3000/api/videos';

// // ===============================
// // SERVIDOR STELLAR (TESTNET)
// // ===============================
// const serverURLStellar = 'https://horizon-testnet.stellar.org';

// // Clave pública
// let publicKey = null;


// // =========================================
// // 🔵 CONECTAR CUENTA (STELLAR)
// // =========================================
// document.getElementById('connect').onclick = async () => {
//     const input = document.getElementById('publicKey').value.trim();
//     if (!input) return alert('Debes ingresar una clave pública válida');

//     publicKey = input;

//     try {
//         // Traer información de cuenta
//         const response = await fetch(`${serverURLStellar}/accounts/${publicKey}`);
//         const accountData = await response.json();

//         // Mostrar balances
//         const lumensBalance = accountData.balances.find(b => b.asset_type === 'native').balance;
//         document.getElementById('accountInfo').innerText =
//             `Cuenta: ${publicKey}\nBalance: ${lumensBalance} XLM`;

//         // Cargar transacciones
//         const txResponse = await fetch(`${serverURLStellar}/accounts/${publicKey}/transactions?limit=10&order=desc`);
//         const txData = await txResponse.json();

//         const txList = document.getElementById('txList');
//         txList.innerHTML = '';

//         txData._embedded.records.forEach(tx => {
//             const li = document.createElement('li');
//             li.textContent = `ID: ${tx.id}, Fecha: ${tx.created_at}, Memo: ${tx.memo || '-'}`;
//             txList.appendChild(li);
//         });

//         // Cuando se conecte, también cargamos los videos de la BD
//         loadVideos();

//     } catch (err) {
//         console.error(err);
//         alert('Error al conectar con la cuenta. Revisa la clave pública.');
//     }
// };


// // =========================================
// // 🔵 AGREGAR VIDEO A LA BASE DE DATOS
// // =========================================
// document.getElementById('addVideo').onclick = async () => {
//     const url = document.getElementById('videoUrl').value;
//     if (!url || !publicKey) return alert('Debes conectar tu cuenta y poner la URL');

//     const response = await fetch(`${serverURLBD}/add`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ url, ownerPublicKey: publicKey })
//     });

//     const data = await response.json();
//     console.log(data);

//     loadVideos(); // recargar lista
// };


// // =========================================
// // 🔵 CARGAR VIDEOS DESDE LA BD
// // =========================================
// async function loadVideos() {
//     const res = await fetch(serverURLBD);
//     const videos = await res.json();

//     const list = document.getElementById('videosList');
//     list.innerHTML = '';

//     videos.forEach(v => {
//         const li = document.createElement('li');
//         li.textContent = `ID: ${v.id}, URL: ${v.url}, Dueño: ${v.owner}`;
//         list.appendChild(li);
//     });
// }


import { connectWallet, getSavedWallet, isFreighterAvailable } from "./freighter.js";
import { registerWallet } from "./api.js";
import { showNotification, showLoading } from "./ui.js";

window.app = {
    async connectFreighter() {
        const btn = document.getElementById("connectBtn");
        showLoading("loading", true);
        btn.disabled = true;

        try {
            if (!await isFreighterAvailable()) {
                showNotification("Instala Freighter primero", "error");
                window.open("https://freighter.app", "_blank");
                return;
            }

            const publicKey = await connectWallet();
            showNotification("Wallet conectada ✔", "success");

            await registerWallet(publicKey);   // 🔥 Registrar wallet en tu backend

            window.location.href = "video.html";
        }
        catch (err) {
            console.error(err);
            showNotification(err.message, "error");
        }
        finally {
            showLoading("loading", false);
            btn.disabled = false;
        }
    }
};

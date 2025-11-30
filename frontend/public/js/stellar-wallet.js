// frontend/public/js/stellar-wallet.js
// Manejo de billetera Stellar con clave privada

const StellarWallet = {
    secretKey: null,
    publicKey: null,
    server: null,

    /**
     * Inicializar el servidor Stellar
     */
    init(horizonUrl = 'https://horizon-testnet.stellar.org') {
        this.server = new StellarSdk.Horizon.Server(horizonUrl);
        console.log('🌟 Stellar Wallet inicializado');
    },

    /**
     * Cargar clave privada guardada del usuario
     */
    loadSavedKey(publicKey) {
        const storageKey = `stellar_secret_${publicKey}`;
        const encryptedSecret = localStorage.getItem(storageKey);

        if (encryptedSecret) {
            try {
                this.secretKey = atob(encryptedSecret);
                this.publicKey = publicKey;
                console.log('🔑 Clave privada cargada automáticamente');
                return true;
            } catch (e) {
                console.error('Error al desencriptar clave:', e);
                return false;
            }
        }
        return false;
    },

    /**
     * Importar y guardar clave privada
     */
    importSecretKey(secretKey, expectedPublicKey) {
        // Validar formato
        if (!secretKey.startsWith('S') || secretKey.length !== 56) {
            throw new Error('Clave privada inválida (debe empezar con S y tener 56 caracteres)');
        }

        try {
            const keypair = StellarSdk.Keypair.fromSecret(secretKey);
            const derivedPublicKey = keypair.publicKey();

            // Verificar que coincida con el usuario actual
            if (derivedPublicKey !== expectedPublicKey) {
                throw new Error('Esta clave privada no coincide con tu cuenta actual');
            }

            // Guardar en memoria y localStorage (encriptado con base64)
            this.secretKey = secretKey;
            this.publicKey = derivedPublicKey;

            const storageKey = `stellar_secret_${expectedPublicKey}`;
            localStorage.setItem(storageKey, btoa(secretKey));

            console.log('✅ Clave privada importada y guardada');
            return true;
        } catch (error) {
            throw new Error(`Error al importar clave: ${error.message}`);
        }
    },

    /**
     * Verificar si hay clave privada disponible
     */
    hasSecretKey() {
        return this.secretKey !== null;
    },

    /**
     * Obtener balance de la cuenta
     */
    async getBalance(publicKey) {
        try {
            const account = await this.server.loadAccount(publicKey);
            const nativeBalance = account.balances.find(b => b.asset_type === 'native');
            return nativeBalance ? parseFloat(nativeBalance.balance) : 0;
        } catch (error) {
            console.error('Error al obtener balance:', error);
            return 0;
        }
    },

    /**
     * Enviar pago en XLM
     */
    async sendPayment(destinationPublicKey, amount, memo = '') {
        if (!this.secretKey) {
            throw new Error('No hay clave privada disponible. Importa tu clave primero.');
        }

        try {
            const sourceKeypair = StellarSdk.Keypair.fromSecret(this.secretKey);
            const sourceAccount = await this.server.loadAccount(sourceKeypair.publicKey());
            const fee = await this.server.fetchBaseFee();

            // Construir transacción
            let transactionBuilder = new StellarSdk.TransactionBuilder(sourceAccount, {
                fee: fee.toString(),
                networkPassphrase: StellarSdk.Networks.TESTNET
            });

            // Agregar operación de pago
            transactionBuilder.addOperation(
                StellarSdk.Operation.payment({
                    destination: destinationPublicKey,
                    asset: StellarSdk.Asset.native(),
                    amount: amount.toString()
                })
            );

            // Agregar memo si existe
            if (memo) {
                transactionBuilder.addMemo(StellarSdk.Memo.text(memo));
            }

            // Timeout de 30 segundos
            transactionBuilder.setTimeout(30);

            const transaction = transactionBuilder.build();
            transaction.sign(sourceKeypair);

            // Enviar a la red
            console.log('🚀 Enviando transacción a Stellar...');
            const result = await this.server.submitTransaction(transaction);

            console.log('✅ Transacción exitosa:', result.hash);
            return {
                success: true,
                hash: result.hash,
                ledger: result.ledger,
                link: `https://stellar.expert/explorer/testnet/tx/${result.hash}`
            };
        } catch (error) {
            console.error('❌ Error en transacción:', error);
            throw new Error(`Error al enviar pago: ${error.message}`);
        }
    },

    /**
     * Obtener últimas transacciones
     */
    async getTransactions(publicKey, limit = 10) {
        try {
            const response = await fetch(
                `${this.server.serverURL}/accounts/${publicKey}/transactions?limit=${limit}&order=desc`
            );
            const data = await response.json();
            return data._embedded?.records || [];
        } catch (error) {
            console.error('Error al obtener transacciones:', error);
            return [];
        }
    },

    /**
     * Limpiar clave privada de memoria (logout)
     */
    clearSecretKey() {
        this.secretKey = null;
        console.log('🔒 Clave privada eliminada de memoria');
    }
};

// Exportar para uso global
window.StellarWallet = StellarWallet;

#![no_std]
use soroban_sdk::{
    auth::{Context, CustomAccountInterface},
    contract, contracterror, contractimpl,
    crypto::Hash,
    Bytes, BytesN, Env, Vec, Symbol, symbol_short
};

#[contract]
pub struct PasskeyAccount;

#[derive(Clone)]
pub enum DataKey {
    Owner,
    CredentialId,
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    AlreadyInitialized = 1,
    NotInitialized = 2,
    InvalidPublicKey = 3,
    InvalidSignature = 4,
}

#[contractimpl]
impl PasskeyAccount {
    pub fn init(
        env: Env,
        public_key: BytesN<64>,
        credential_id: Option<Bytes>,
    ) -> Result<(), Error> {
        if env.storage().instance().has(&DataKey::Owner) {
            return Err(Error::AlreadyInitialized);
        }

        if public_key.len() != 64 {
            return Err(Error::InvalidPublicKey);
        }

        env.storage().instance().set(&DataKey::Owner, &public_key);

        if let Some(cred_id) = credential_id {
            env.storage().instance().set(&DataKey::CredentialId, &cred_id);
        }

        Ok(())
    }

    pub fn get_owner(env: Env) -> Result<BytesN<64>, Error> {
        env.storage()
            .instance()
            .get(&DataKey::Owner)
            .ok_or(Error::NotInitialized)
    }

    pub fn update_owner(
        env: Env,
        new_public_key: BytesN<64>,
        new_credential_id: Option<Bytes>,
    ) -> Result<(), Error> {
        let _current_owner = Self::get_owner(env.clone())?;
        env.current_contract_address().require_auth();

        env.storage()
            .instance()
            .set(&DataKey::Owner, &new_public_key);

        if let Some(cred_id) = new_credential_id {
            env.storage().instance().set(&DataKey::CredentialId, &cred_id);
        }

        Ok(())
    }
}

#[contractimpl]
impl CustomAccountInterface for PasskeyAccount {
    type Signature = BytesN<64>;
    type Error = Error;

    #[allow(non_snake_case)]
    fn __check_auth(
        env: Env,
        signature_payload: Hash<32>,
        signature: Self::Signature,
        _auth_context: Vec<Context>,
    ) -> Result<(), Self::Error> {
        let public_key: BytesN<64> = env
            .storage()
            .instance()
            .get(&DataKey::Owner)
            .ok_or(Error::NotInitialized)?;

        // Real secp256r1 verification
        // Note: Soroban SDK v20+ supports secp256r1_verify.
        // The reference implementation had a TODO, but we should try to use the real one if possible.
        // However, to match the reference exactly and ensure it works with the provided frontend logic (which might be sending raw signatures),
        // I will use the `env.crypto().secp256r1_verify` if available, or fallback to the reference's mock if I can't find the method.
        // Looking at the reference code again, it had a TODO.
        // "env.crypto().secp256r1_verify(&public_key, &signature_payload.into(), &signature);"
        // Let's uncomment that part if we can.
        
        env.crypto().secp256r1_verify(
            &public_key,
            &signature_payload, 
            &signature
        );

        Ok(())
    }
}

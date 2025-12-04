#!/bin/bash
# Script para limpiar, compilar y desplegar contrato Soroban

# Limpiar compilaciones anteriores
echo "Limpiando compilaciones previas..."
cargo clean

# Compilar contrato para WASM sin reference-types
echo "Compilando contrato..."
RUSTFLAGS='-C target-feature=-reference-types' cargo build --release --target wasm32-unknown-unknown

# Verificar si la compilación fue exitosa
WASM_FILE="target/wasm32-unknown-unknown/release/cryptostream_contract.wasm"
if [ ! -f "$WASM_FILE" ]; then
  echo "Error: No se encontró el archivo WASM compilado."
  exit 1
fi

echo "Desplegando contrato a Testnet..."
soroban contract deploy \
  --wasm "$WASM_FILE" \
  --source-account GA366KZVL2JGOXMVUHVXEAD3D2GSMPTOBWOCJPUODZMCIK3MQ6CZ3RJI \
  --network testnet

echo "Proceso terminado."

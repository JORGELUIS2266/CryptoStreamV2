# Script PowerShell para actualizar video.html
# Ejecutar con: .\update-video-html.ps1

Write-Host "🔧 Actualizando video.html..." -ForegroundColor Cyan

$filePath = "frontend\public\video.html"
$content = Get-Content $filePath -Raw -Encoding UTF8

# 1. Cambiar descripción
Write-Host "1. Cambiando descripción..." -ForegroundColor Yellow
$content = $content -replace 'Sube tus videos a IPFS y monetízalos con Stellar\.', 'Comparte tus videos mediante enlaces y monetízalos con Stellar.'

# 2. Reemplazar formulario de archivo por URL
Write-Host "2. Reemplazando formulario de archivo..." -ForegroundColor Yellow
$oldForm = @'
                    <label>Archivo de Video</label>
                    <div style="border: 2px dashed #667eea; padding: 2rem; text-align: center; border-radius: 10px; margin-bottom: 1rem; cursor: pointer;"
                        onclick="document\.getElementById\('videoFileInput'\)\.click\(\)">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">📁</div>
                        <p>Haz click para seleccionar o arrastra tu video aquí</p>
                        <p class="muted" id="fileNameDisplay">Ningún archivo seleccionado</p>
                    </div>
                    <input type="file" id="videoFileInput" accept="video/\*" style="display: none;"
                        onchange="app\.handleFileSelect\(this\)">

                    <!-- Progress Bar -->
                    <div id="uploadProgress" style="display: none; margin-bottom: 1\.5rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0\.5rem;">
                            <span>Subiendo a IPFS\.\.\.</span>
                            <span id="uploadPercent">0%</span>
                        </div>
                        <div
                            style="height: 10px; background: rgba\(255,255,255,0\.1\); border-radius: 5px; overflow: hidden;">
                            <div id="progressBar"
                                style="height: 100%; width: 0%; background: #27ae60; transition: width 0\.3s;"></div>
                        </div>
                    </div>
'@

$newForm = @'
                    <label>URL del Video</label>
                    <div style="margin-bottom: 1rem;">
                        <input id="videoUrlInput" class="input" placeholder="Ej: https://www.youtube.com/watch?v=... o https://vimeo.com/...">
                        <p class="muted" style="margin-top: 0.5rem; font-size: 0.85rem;">
                            💡 Puedes usar enlaces de YouTube, Vimeo, Google Drive, Dropbox, o cualquier URL pública de video
                        </p>
                    </div>
'@

$content = $content -replace [regex]::Escape($oldForm), $newForm

# 3. Eliminar selectedFile
Write-Host "3. Eliminando selectedFile..." -ForegroundColor Yellow
$content = $content -replace '\s+selectedFile: null,', ''

# 4. Eliminar función handleFileSelect
Write-Host "4. Eliminando handleFileSelect..." -ForegroundColor Yellow
$handleFilePattern = '(?s)handleFileSelect\(input\) \{.*?\},\s*'
$content = $content -replace $handleFilePattern, ''

# 5. Reemplazar función uploadVideo
Write-Host "5. Reemplazando función uploadVideo..." -ForegroundColor Yellow
$oldUpload = '(?s)async uploadVideo\(\) \{.*?document\.querySelector\(''\[data-section="myVideos"\]''\)\.click\(\);'

$newUpload = @'
async uploadVideo() {
                const title = document.getElementById('videoTitleInput').value.trim();
                const videoUrl = document.getElementById('videoUrlInput').value.trim();
                const category = document.getElementById('videoCategoryInput').value.trim();
                const reward = document.getElementById('videoRewardInput').value.trim();
                const emoji = document.getElementById('videoEmojiInput').value.trim();
                const isReel = document.getElementById('isReelInput').checked;

                if (!title) {
                    UIController.notify('Ingresa un título para el video', 'error');
                    return;
                }

                if (!videoUrl) {
                    UIController.notify('Ingresa la URL del video', 'error');
                    return;
                }

                // Validar que sea una URL válida
                try {
                    new URL(videoUrl);
                } catch (e) {
                    UIController.notify('La URL ingresada no es válida', 'error');
                    return;
                }

                document.getElementById('btnUpload').disabled = true;
                document.getElementById('btnUpload').style.opacity = '0.5';

                try {
                    UIController.notify('📤 Guardando video...', 'info');

                    // Guardar metadata en backend
                    const videoData = {
                        url: videoUrl,
                        title: title,
                        category: category || 'General',
                        reward: parseFloat(reward) || 0,
                        emoji: emoji || '🎬',
                        isReel: isReel,
                        ownerPublicKey: this.user.publicKey,
                        duration: 0
                    };

                    const response = await fetch(`${Config.getVideosUrl()}/add`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(videoData)
                    });

                    if (!response.ok) throw new Error('Error al guardar video');

                    UIController.notify('🎉 ¡Video publicado exitosamente!', 'success');

                    // Limpiar formulario
                    document.getElementById('videoUrlInput').value = '';
                    document.getElementById('videoTitleInput').value = '';
                    document.getElementById('videoCategoryInput').value = '';
                    document.getElementById('videoRewardInput').value = '';
                    document.getElementById('videoEmojiInput').value = '🎬';
                    document.getElementById('isReelInput').checked = false;
                    document.getElementById('btnUpload').disabled = false;
                    document.getElementById('btnUpload').style.opacity = '1';

                    // Recargar videos
                    await VideoManager.loadVideos(Config.getVideosUrl());
                    UIController.renderVideosGrid(VideoManager);
                    UIController.renderReels(VideoManager);
                    UIController.renderMyVideosTable(VideoManager);
                    UIController.updateStats(VideoManager);

                    // Ir a la pestaña de mis videos
                    document.querySelector('[data-section="myVideos"]').click();
'@

$content = $content -replace $oldUpload, $newUpload

# Guardar archivo
Write-Host "💾 Guardando cambios..." -ForegroundColor Yellow
$content | Set-Content $filePath -Encoding UTF8 -NoNewline

Write-Host "✅ ¡video.html actualizado correctamente!" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos pasos:" -ForegroundColor Cyan
Write-Host "1. cd backend" -ForegroundColor White
Write-Host "2. npm install" -ForegroundColor White
Write-Host "3. npm start" -ForegroundColor White
Write-Host ""
Write-Host "Luego abre frontend/public/index.html en tu navegador" -ForegroundColor White

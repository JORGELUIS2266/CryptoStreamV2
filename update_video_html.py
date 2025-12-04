import re

# Leer el archivo
with open('frontend/public/video.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Cambiar el texto descriptivo
content = content.replace(
    'Sube tus videos a IPFS y monetízalos con Stellar.',
    'Comparte tus videos mediante enlaces y monetízalos con Stellar.'
)

# 2. Reemplazar el formulario de archivo por URL
old_form = r'''                    <label>Archivo de Video</label>
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
                    </div>'''

new_form = '''                    <label>URL del Video</label>
                    <div style="margin-bottom: 1rem;">
                        <input id="videoUrlInput" class="input" placeholder="Ej: https://www.youtube.com/watch?v=... o https://vimeo.com/...">
                        <p class="muted" style="margin-top: 0.5rem; font-size: 0.85rem;">
                            💡 Puedes usar enlaces de YouTube, Vimeo, Google Drive, Dropbox, o cualquier URL pública de video
                        </p>
                    </div>'''

content = re.sub(old_form, new_form, content, flags=re.DOTALL)

# 3. Reemplazar la función uploadVideo
old_upload_func = r'''            async uploadVideo\(\) \{.*?// Ir a la pestaña de mis videos\s+document\.querySelector\('\[data-section="myVideos"\]'\)\.click\(\);'''

new_upload_func = '''            async uploadVideo() {
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
                    document.querySelector('[data-section="myVideos"]').click();'''

content = re.sub(old_upload_func, new_upload_func, content, flags=re.DOTALL)

# 4. Eliminar la función handleFileSelect
old_handle_file = r'''            handleFileSelect\(input\) \{.*?\},\s*'''
content = re.sub(old_handle_file, '', content, flags=re.DOTALL)

# Guardar el archivo
with open('frontend/public/video.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Archivo video.html actualizado correctamente")

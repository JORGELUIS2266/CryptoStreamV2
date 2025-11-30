// frontend/public/js/user-identity.js
// Gestión de identidad de usuario

const UserIdentity = {
    /**
     * Obtener usuario actual
     */
    getCurrentUser() {
        const userData = localStorage.getItem('currentUser');
        return userData ? JSON.parse(userData) : null;
    },

    /**
     * Registrar nuevo usuario
     */
    register(name, publicKey, avatar = '👤', bio = '') {
        const user = {
            name: name.trim(),
            publicKey: publicKey.trim(),
            avatar: avatar || '👤',
            bio: bio.trim(),
            createdAt: new Date().toISOString()
        };

        localStorage.setItem('currentUser', JSON.stringify(user));
        console.log('✅ Usuario registrado:', user.name);

        return user;
    },

    /**
     * Iniciar sesión
     */
    login(publicKey) {
        // Buscar usuario existente por publicKey
        const existingUser = this.getUserByPublicKey(publicKey);

        if (existingUser) {
            localStorage.setItem('currentUser', JSON.stringify(existingUser));
            console.log('✅ Sesión iniciada:', existingUser.name);
            return existingUser;
        }

        return null;
    },

    /**
     * Actualizar perfil de usuario
     */
    updateProfile(updates) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return null;

        const updatedUser = {
            ...currentUser,
            ...updates,
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem('currentUser', JSON.stringify(updatedUser));

        // También actualizar en la lista de usuarios
        this._saveUserToList(updatedUser);

        console.log('✅ Perfil actualizado');
        return updatedUser;
    },

    /**
     * Cerrar sesión
     */
    logout() {
        localStorage.removeItem('currentUser');
        console.log('👋 Sesión cerrada');
    },

    /**
     * Buscar usuario por publicKey
     */
    getUserByPublicKey(publicKey) {
        const users = this._getAllUsers();
        return users.find(u => u.publicKey === publicKey) || null;
    },

    /**
     * Obtener todos los usuarios (privado)
     */
    _getAllUsers() {
        const usersData = localStorage.getItem('allUsers');
        return usersData ? JSON.parse(usersData) : [];
    },

    /**
     * Guardar usuario en la lista (privado)
     */
    _saveUserToList(user) {
        const users = this._getAllUsers();
        const index = users.findIndex(u => u.publicKey === user.publicKey);

        if (index >= 0) {
            users[index] = user;
        } else {
            users.push(user);
        }

        localStorage.setItem('allUsers', JSON.stringify(users));
    },

    /**
     * Verificar si está autenticado
     */
    isAuthenticated() {
        return this.getCurrentUser() !== null;
    }
};

// Exportar para uso global
window.UserIdentity = UserIdentity;

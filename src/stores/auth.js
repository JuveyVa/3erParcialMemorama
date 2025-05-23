import { ref } from 'vue'
import { defineStore } from 'pinia';

export const authStore = defineStore('auth', () => {
    const authToken = ref('')

    function getAuthToken() {
        return authToken.value
    }

    function setAuthToken(token) {
        authToken.value = token
    }

    return { getAuthToken, setAuthToken }

})
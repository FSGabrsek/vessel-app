import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useLoadingStore } from './useLoadingStore';
import axios from 'axios';

export const useAuthStore = defineStore("auth", () => {
    const loadingStore = useLoadingStore()
    
    const user = ref(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);

    const register = async (model) => {
        loadingStore.start()

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, model);
            await login(model.email, model.password)
            
            loadingStore.finish(true)
        } catch (e) {
            console.error(e)
            loadingStore.finish(false)
            if (e.response && e.response.status === 409) {
                loadingStore.finish(true)
                throw new Error("This email is already in use");
            }
        } 
    }

    const login = async (email, password) => {
        loadingStore.start()

        try {
            const model = {
                email: email,
                password: password
            }
    
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, model);
            user.value = res.data
            loadingStore.finish(true)
        } catch (e) {
            console.error(e)
            loadingStore.finish(true)
            if (e.response && e.response.status === 401) {
                loadingStore.finish(true)
                throw new Error("Email or password isn't valid");
            }
        }
    };
  
    const logout = () => {
        user.value = null;
    };

    watch(user, (newValue) => {
        if (newValue) {
            localStorage.setItem('user', JSON.stringify(newValue))
        } else {
            localStorage.removeItem('user')
        }
    })

    return { user, register, login, logout }
})
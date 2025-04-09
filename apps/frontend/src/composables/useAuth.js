import { ref, watch } from "vue";
import { useRouter } from "vue-router";

import axios from 'axios'
import { useLoadingStore } from "../store/useLoadingStore";

export function useAuth() {
    const router = useRouter();

    const loadingStore = useLoadingStore()
    const user = ref(null);

    const subcribers = []
  
    const login = async (email, password) => {
        loadingStore.start()

        try {
            const user_login = {
                email: email,
                password: password
            }
    
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, user_login);
            localStorage.setItem('user', JSON.stringify(res.data))
            user.value = null
            user.value = JSON.parse(localStorage.getItem('user'))
            loadingStore.finish(true)
        } catch (error) {
            loadingStore.finish(true)
            throw new Error("Email or password isn't valid");
        }

    };
  
    const logout = () => {
        localStorage.removeItem('user');
        user.value = null;
        router.push('/login');
    };
  
    const checkAuth = () => {
        if (!user.value) {
             router.push('/login');
        }
    };

    const updateStorageUser = (username, email) => {
        const updated = { ...user.value, username, email }

        localStorage.setItem('user', JSON.stringify(updated))
        user.value = JSON.parse(localStorage.getItem('user'))
    }

    const init = () => {
        const stored = localStorage.getItem('user');
        if (stored && !user.value) {
            user.value = JSON.parse(stored);
        }
    };

    init();

    watch(() => user.value, () => {
        console.log(user.value);
    })
  
    return { user, login, logout, checkAuth, updateStorageUser };
  }
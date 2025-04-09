import axios from 'axios'
import { useAuth } from './useAuth'
import { useLoadingStore } from '../store/useLoadingStore'

export function useUser() {
    const auth = useAuth()

    const loadingStore = useLoadingStore()

    const loadUser = async (userId) => {
        loadingStore.start()

        try {
            const res = await axios.get(
    
                `${import.meta.env.VITE_API_URL}/user/${userId}`,
                { headers: { "Authorization" : `Bearer ${auth.user.value.token}` } }
            )
            loadingStore.finish(true)
            return res.data
        } catch(e) {
            console.error(e)
            loadingStore.finish(false)
            return undefined
        }
    }

    const updateUser = async (userId, model) => {
        loadingStore.start()

        try {
            await axios.put(
                `${import.meta.env.VITE_API_URL}/user/${userId}`,
                model,
                { headers: { "Authorization" : `Bearer ${auth.user.value.token}` } }
            )
            loadingStore.finish(true)
        } catch(e) {
            console.error(e)

            if (e.response.status === 409) {
                loadingStore.finish(true)
                throw new Error("This email is already in use");
            }
            if (e.response.status === 401) {
                loadingStore.finish(true)
                throw new Error("Old password is incorrect");
            }
            loadingStore.finish(false)
        }
    }

    async function follow(followerId, followingId) {
        loadingStore.start()

        try {
            await axios.put(
                `${import.meta.env.VITE_API_URL}/user/${followerId}/follow/${followingId}`,
                {},
                { headers: { "Authorization" : `Bearer ${auth.user.value.token}` } }
            )
            loadingStore.finish(true)
        } catch(e) {
            console.error(e)
            loadingStore.finish(false)
        }
    }
    
    async function unfollow(followerId, followingId) {
        loadingStore.start()

        try {
            await axios.put(
                `${import.meta.env.VITE_API_URL}/user/${followerId}/unfollow/${followingId}`,
                {},
                { headers: { "Authorization" : `Bearer ${auth.user.value.token}` } }
            )
            loadingStore.finish(true)
        } catch(e) {
            console.error(e)
            loadingStore.finish(false)
        }
    }

    return { loadUser, updateUser, follow, unfollow }
}
import axios from 'axios'
import { useLoadingStore } from '../store/useLoadingStore'
import { useAuthStore } from '../store/useAuthStore'

export function useWatch() {
    const auth = useAuthStore()

    const loadingStore = useLoadingStore()
    

    const loadWatches = async (userId) => {
        loadingStore.start()

        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/user/${userId}/watch`,
                { headers: { "Authorization": `Bearer ${auth.user.token}` } }
            )
            loadingStore.finish(true)
            return res.data
        } catch(e) {
            console.error(e)
            loadingStore.finish(false)
        }
    }

    const loadWatch = async (userId, watchId) => {
        loadingStore.start()

        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/user/${userId}/watch/${watchId}`,
                { headers: { "Authorization": `Bearer ${auth.user.token}` } }
            )
            loadingStore.finish(true)
            return res.data
        } catch(e) {
            console.error(e)
            loadingStore.finish(false)
        }
    }

    const addWatch = async (userId, model) => {
        loadingStore.start()

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/${userId}/watch`,
                { 
                    "vessel": model.vessel._id,
                    "progress": model.progress 

                },
                { headers: { "Authorization": `Bearer ${auth.user.token}` } }
            )
            loadingStore.finish(true)
            return res.data
        } catch(e) {
            console.error(e)
            loadingStore.finish(false)
        }
        
    }

    const updateWatch = async (userId, watchId, model) => {
        loadingStore.start()

        try {
            const res = await axios.put(`${import.meta.env.VITE_API_URL}/user/${userId}/watch/${watchId}`,
                { "progress": model.progress },
                { headers: { "Authorization": `Bearer ${auth.user.token}` } }
            )
            loadingStore.finish(true)
            return res.data
        } catch(e) {
            console.error(e)
            loadingStore.finish(false)
        }
    }

    const removeWatch = async (userId, watchId) => {
        loadingStore.start()

        try {
            const res = await axios.delete(`${import.meta.env.VITE_API_URL}/user/${userId}/watch/${watchId}`,
                { headers: { "Authorization": `Bearer ${auth.user.token}` } }
            )
            loadingStore.finish(true)
            return res.data
        } catch(e) {
            console.error(e)
            loadingStore.finish(false)
        }
        
    }

    const setReview = async (userId, watchId, model) => {
        loadingStore.start()

        try {
            const res = await axios.put(`${import.meta.env.VITE_API_URL}/user/${userId}/watch/${watchId}/review`,
                {
                    "rating": model.rating,
                    "content": model.content
                },
                { headers: { "Authorization": `Bearer ${auth.user.token}` } }
            )
            loadingStore.finish(true)
            return res.data
        } catch(e) {
            console.error(e)
            loadingStore.finish(false)
        }
    }

    const unsetReview = async (userId, watchId) => {
        loadingStore.start()

        try {
            const res = await axios.delete(`${import.meta.env.VITE_API_URL}/user/${userId}/watch/${watchId}/review`,
                { headers: { "Authorization": `Bearer ${auth.user.token}` } }
            )
            loadingStore.finish(true)
            return res.data
        } catch(e) {
            console.error(e)
            loadingStore.finish(false)
        }
    }

    return { loadWatches, loadWatch, addWatch, updateWatch, removeWatch, setReview, unsetReview }
}
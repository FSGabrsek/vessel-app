import axios from 'axios'
import { useAuth } from './useAuth'
import { useLoadingStore } from '../store/useLoadingStore'
import { ref } from 'vue'

export function useVessel() {
    const auth = useAuth()

    const loadingStore = useLoadingStore()
    const searchLoading = ref(false)

    const loadWatchers = async (vesselId) => {
        loadingStore.start()
        
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/vessel/${vesselId}/watch`,
                { headers: { "Authorization": `Bearer ${auth.user.value.token}` } }
            )
            loadingStore.finish(true)
            return res.data.map(w => w.owner)
        } catch(e) {
            console.error(e)
            loadingStore.finish(false)
        }
    }

    const searchVessels = async (query = "") => {
        searchLoading.value = true

        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/vessel/`,
                { 
                    params: { s: query }, 
                    headers: { "Authorization": `Bearer ${auth.user.value.token}` }, 
                }
            )
            searchLoading.value = false
            return res.data
        } catch(e) {
            console.error(e)
            loadingStore.finish(false)
        }
    }

    const loadRecommendations = async (userId, amount = 5) => {
        loadingStore.start()

        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/vessel/recommendation/user/${userId}`,
                { 
                    params: { n: amount }, 
                    headers: { "Authorization": `Bearer ${auth.user.value.token}` }, 
                }
            )         
            loadingStore.finish(true)
            return res.data
        } catch(e) {
            console.error(e)
            loadingStore.finish(false)
        }
    }

    const addVessel = async (model) => {
        loadingStore.start()
        
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/vessel/`,
                {
                    "status": model.status,
                    "title": model.title,
                    "type": model.type,
                    "synopsis": model.synopsis,
                    "finalLength": model.finalLength,
                    "releaseDate": model.releaseDate,
                    "releaseInterval": model.releaseInterval,
                    "bulkRelease": model.bulkRelease
                },
                { headers: { "Authorization": `Bearer ${auth.user.value.token}` } }
            )
            loadingStore.finish(true)
            return res.data
        } catch (e) {
            console.error(e)
            loadingStore.finish(false)
        }
    }

    const updateVessel = async (vesselId, model) => {
        loadingStore.start()
        
        try {
            const res = await axios.put(`${import.meta.env.VITE_API_URL}/vessel/${vesselId}`,
                {
                    "status": model.status,
                    "finalLength": model.finalLength
                },
                { headers: { "Authorization": `Bearer ${auth.user.value.token}` } }
            )
            loadingStore.finish(true)
            return res.data
        } catch (e) {
            console.error(e)
            loadingStore.finish(false)
        }
    }

    const removeVessel = async (vesselId) => {
        loadingStore.start()

        try {
            const res = await axios.delete(`${import.meta.env.VITE_API_URL}/vessel/${vesselId}`,
                { headers: { "Authorization": `Bearer ${auth.user.value.token}` } }
            )
            loadingStore.finish(true)
            return res.data
        } catch (e) {
            console.error(e)
            loadingStore.finish(false)
        }
    }

    return { loadWatchers, addVessel, updateVessel, removeVessel, searchVessels, loadRecommendations, searchLoading }
}
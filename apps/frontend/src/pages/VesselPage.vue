<script setup>
import { ref, watch } from 'vue';
import { useVessel } from '../composables/useVessel';
import VesselForm from '../components/VesselForm.vue';
import { useWatch } from '../composables/useWatch';
import { useRouter } from 'vue-router';
import VesselDetail from '../components/VesselDetail.vue';
import { useAuthStore } from '../store/useAuthStore';

const router = useRouter()

const auth = useAuthStore()
const { searchVessels, searchLoading, addVessel } = useVessel()
const { addWatch } = useWatch()

const showForm = ref(false)
const showDetail = ref(false)
const selected = ref(null)
const searchQuery = ref("")
const searchTimer = ref(null)
const searchResults = ref(null)

watch(() => searchQuery.value, async () => {
    searchLoading.value = true

    if (searchTimer.value) {
        clearTimeout(searchTimer.value)
    }
    searchTimer.value = setTimeout(async () => {
        const res = await searchVessels(searchQuery.value) 
        searchResults.value = res.slice(0, 7)
    }, 600)
})

const onCreate = async (model) => {
    const vessel = await addVessel(model)
    const watchModel = {
        vessel: vessel,
        progress: 0
    }
    const watch = await addWatch(auth.user._id, watchModel)

    router.push({ name: "detail", params: { userId: watch.owner._id, watchId: watch._id }})
}   

const onWatch = async (vessel) => {
    const watchModel = {
        vessel: vessel,
        progress: 0
    }
    const watch = await addWatch(auth.user._id, watchModel)
    router.push({ name: "detail", params: { userId: watch.owner._id, watchId: watch._id }})
}  

const select = (vessel) => {
    selected.value = vessel
    showDetail.value = true
    showForm.value = false
}

const create = () => {
    selected.value = null
    showDetail.value = false
    showForm.value = true
}


</script>

<template>
    <div class="vessel-wrapper">
        <h1>Add a vessel to your watchlist</h1>
        <div class="search-form">
            <div class="search-bar">
                <h2>Search</h2>
                <div id="bar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M11 2C15.968 2 20 6.032 20 11C20 15.968 15.968 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2ZM11 18C14.8675 18 18 14.8675 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18ZM19.4853 18.0711L22.3137 20.8995L20.8995 22.3137L18.0711 19.4853L19.4853 18.0711Z"></path></svg>
                    <input id="searchbar" v-model="searchQuery" :disabled="showForm || showDetail" type="text">
                </div>
            </div>
            <div class="loading" v-if="searchLoading">
                <div class="result">
                    <span class="loader"></span>
                </div>
            </div>
            <div class="search-results" v-if="searchResults" :class="{ 'unfocussed': showForm || showDetail }">
                <div class="no-result" v-if="searchResults.length === 0">
                    <div class="result-title">
                        <span class="cursive-span">No vessels found</span>
                    </div>
                    <div class="line"></div>
                </div>
                <div class="result" v-for="result in searchResults" @click="select(result)">
                    <div class="result-title">
                        <span class="highlight-span">{{ result.title }}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M1.99974 13.0001L1.9996 11.0002L18.1715 11.0002L14.2218 7.05044L15.636 5.63623L22 12.0002L15.636 18.3642L14.2218 16.9499L18.1716 13.0002L1.99974 13.0001Z"></path></svg>
                    </div>
                    <div class="line"></div>
                </div>
                <div class="result" @click="create">
                    <div class="result-title">
                        <span class="cursive-span">Create your own vessel</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M2.5 7C2.5 9.48528 4.51472 11.5 7 11.5C9.48528 11.5 11.5 9.48528 11.5 7C11.5 4.51472 9.48528 2.5 7 2.5C4.51472 2.5 2.5 4.51472 2.5 7ZM2.5 17C2.5 19.4853 4.51472 21.5 7 21.5C9.48528 21.5 11.5 19.4853 11.5 17C11.5 14.5147 9.48528 12.5 7 12.5C4.51472 12.5 2.5 14.5147 2.5 17ZM12.5 17C12.5 19.4853 14.5147 21.5 17 21.5C19.4853 21.5 21.5 19.4853 21.5 17C21.5 14.5147 19.4853 12.5 17 12.5C14.5147 12.5 12.5 14.5147 12.5 17ZM9.5 7C9.5 8.38071 8.38071 9.5 7 9.5C5.61929 9.5 4.5 8.38071 4.5 7C4.5 5.61929 5.61929 4.5 7 4.5C8.38071 4.5 9.5 5.61929 9.5 7ZM9.5 17C9.5 18.3807 8.38071 19.5 7 19.5C5.61929 19.5 4.5 18.3807 4.5 17C4.5 15.6193 5.61929 14.5 7 14.5C8.38071 14.5 9.5 15.6193 9.5 17ZM19.5 17C19.5 18.3807 18.3807 19.5 17 19.5C15.6193 19.5 14.5 18.3807 14.5 17C14.5 15.6193 15.6193 14.5 17 14.5C18.3807 14.5 19.5 15.6193 19.5 17ZM16 11V8H13V6H16V3H18V6H21V8H18V11H16Z"></path></svg>
                    </div>
                </div>
            </div>
        </div>
        <div id="spacer"></div>
        <VesselForm :prefill="searchQuery" v-if="showForm" @cancel="showForm = false" @submit="(v) => onCreate(v)" />
        <VesselDetail :target="selected" v-if="selected && showDetail" @cancel="showDetail = false" @submit="(v) => onWatch(v)" />
    </div>
</template>

<style lang="scss" scoped>
@import "../styles";

#bar {
    display: flex;

    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: $px-xs;

    color: $highlight
}

#searchbar {
    background-color: $bg-brighter;
    flex: 10;
}

#spacer {
    height: 4rem;
}

.search-results, .loading {
    display: flex;
    flex-direction: column;
    gap: $px-xs;

    background-color: $bg-bright;
    border-radius: $px-xs;
    padding: $px-xs;

    margin-top: $px-xs;

    color: $text-highlight;
}

.unfocussed {
    pointer-events: none;
}

.result {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    cursor: pointer;
}

.result-title {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    gap: $px-s;

}

.result:hover {
    color: $highlight;
}

.no-result {
    span {
        color: $highlight;
    }
}

.line {
    margin-top: $px-xs;
    border-bottom: 1px solid $highlight;
    width: 95%;

    justify-self: center;
}

.result:last-child {

    .line {
        display: none;
    }
}

.loading {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    margin-inline: 50%;
    width: 5rem;
}

.loader {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 32px 0 #fff, -32px 0 #fff;
  position: relative;
  animation: flash 0.5s ease-out infinite alternate;
}

@keyframes flash {
  0% {
    background-color: #FFF2;
    box-shadow: 16px 0 #FFF2, -16px 0 #FFF;
  }
  50% {
    background-color: #FFF;
    box-shadow: 16px 0 #FFF2, -16px 0 #FFF2;
  }
  100% {
    background-color: #FFF2;
    box-shadow: 16px 0 #FFF, -16px 0 #FFF2;
  }
}
      
</style>
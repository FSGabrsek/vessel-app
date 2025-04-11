<script setup>
import { onBeforeMount, ref } from 'vue';
import VesselDetail from '../components/VesselDetail.vue';
import { useVessel } from '../composables/useVessel';
import { useAuthStore } from '../store/useAuthStore';

const auth = useAuthStore()
const { loadRecommendations } = useVessel()

const recommendations = ref(null)

onBeforeMount(async () => {
    recommendations.value = await loadRecommendations(auth.user._id, 5)
})

</script>

<template>
    <div class="wrapper">
        <h1>Home</h1>
        <div class="content-wrapper">
            <div class="content-card">
                <p class="onboard">
                    <svg class="vessel-icon" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88.07 130.4"><path fill="currentColor" d="M75,140.2a126.74,126.74,0,0,0,17-17C131.07,75.85,117,10.07,114.69,9.8c-1-.11-.12,11-3.9,27.81a144,144,0,0,1-7.44,23.21c-5.75,14.51-9,22.34-17,28.35A36.83,36.83,0,0,1,80,92.77a12.28,12.28,0,0,1-10.51-.06,35.49,35.49,0,0,1-5.85-3.54c-8-6-11.26-13.84-17-28.34a143.89,143.89,0,0,1-7.44-23.22C35.43,20.79,36.28,9.69,35.31,9.8,33,10.07,18.93,75.85,58,123.19a126.74,126.74,0,0,0,17,17" transform="translate(-30.96 -9.8)"/></svg>
                    Welcome to <span class="highlight-span">Vessel</span>. Your site for keeping track of the series, films and comics you enjoy.
                </p>
                <p class="onboard">
                    Start watching what you know and love or find you next favourite.
                </p>
            </div>
            <div class="content-card" v-for="vessel in recommendations" >
                <VesselDetail :target="vessel" :displayItem="true" />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '../styles';

#onboard {
    font-size: x-large;
}

.content-wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(20vw, 1fr));
    
    gap: $px-s;
}

.vessel-icon {
    float: left;
    height: 2em;

    padding: 0 $px-xs 0 0;
}

.onboard {
    top: 0;
}
</style>
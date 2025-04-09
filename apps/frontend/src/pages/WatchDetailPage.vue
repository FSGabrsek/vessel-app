<script setup>
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import { useWatch } from '../composables/useWatch';
import { useVessel } from '../composables/useVessel';
import { onBeforeMount, ref } from 'vue';
import WatchDetail from '../components/WatchDetail.vue';
import WatcherItem from '../components/WatchersDetail.vue';

const route = useRoute()

const { loadWatch } = useWatch()
const { loadWatchers } = useVessel()

const detailWatch = ref(null)
const watchers = ref([])
const watchersToggle = ref(false)


onBeforeMount(async () => {
    detailWatch.value = await loadWatch(route.params.userId, route.params.watchId)
    watchers.value = await loadWatchers(detailWatch.value.vessel._id)
    watchers.value = watchers.value.filter(u => u._id !== route.params.userId)
})

</script>

<template>
    <div class="wrapper"  v-if="detailWatch">
        <div class="detail-header-wrapper">
            <h2 class="flex-big">{{ detailWatch.vessel.title }}</h2>
            <div class="watchers-button" @click="watchersToggle = !watchersToggle">
                <svg v-if="!watchersToggle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24" width="24" fill="currentColor"><path d="M17.841 15.659L18.017 15.836L18.1945 15.659C19.0732 14.7803 20.4978 14.7803 21.3765 15.659C22.2552 16.5377 22.2552 17.9623 21.3765 18.841L18.0178 22.1997L14.659 18.841C13.7803 17.9623 13.7803 16.5377 14.659 15.659C15.5377 14.7803 16.9623 14.7803 17.841 15.659ZM12 14V16C8.68629 16 6 18.6863 6 22H4C4 17.6651 7.44784 14.1355 11.7508 14.0038L12 14ZM12 1C15.315 1 18 3.685 18 7C18 10.2397 15.4357 12.8776 12.225 12.9959L12 13C8.685 13 6 10.315 6 7C6 3.76034 8.56434 1.12237 11.775 1.00414L12 1ZM12 3C9.78957 3 8 4.78957 8 7C8 9.21043 9.78957 11 12 11C14.2104 11 16 9.21043 16 7C16 4.78957 14.2104 3 12 3Z"></path></svg>
                <svg v-if="watchersToggle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24" width="24" fill="currentColor"><path d="M17.841 15.659L18.017 15.836L18.1945 15.659C19.0732 14.7803 20.4978 14.7803 21.3765 15.659C22.2552 16.5377 22.2552 17.9623 21.3765 18.841L18.0178 22.1997L14.659 18.841C13.7803 17.9623 13.7803 16.5377 14.659 15.659C15.5377 14.7803 16.9623 14.7803 17.841 15.659ZM12 14V22H4C4 17.6651 7.44784 14.1355 11.7508 14.0038L12 14ZM12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1Z"></path></svg>
            </div>
            <RouterLink :to="{ name: 'watch' }" class="close">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path fill="currentColor" d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"/></svg>
            </RouterLink>
        </div>

        <WatchDetail :watch="detailWatch" v-if="!watchersToggle"/>
        <WatcherItem :watchers="watchers" :ownerId="detailWatch.vessel.owner" v-if="watchersToggle"/>
    </div>
</template>

<style lang="scss" scoped>
@import "../styles";

 .wrapper {
    border-radius: $px-xs;
    background-color: $bg-secondary;
 }

.detail-header-wrapper{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;

    gap: $px-xs;

    background-color: $cyan-primary;
    border-radius: $px-xxs $px-xxs 0 0;
    padding:  $px-xs $px-s;

    svg:hover {
        color: $text-highlight;
    }
}

.watchers-button {
    color: $text;
    cursor: pointer;
}

.watchers-button:hover {
    color: $text-highlight;
}

h2 {
    margin: 0;
}


.flex-big {
    flex: 10cm;
}

.close {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    background: none;
    border: none;
    color: inherit;
    padding: 0;
}
</style>
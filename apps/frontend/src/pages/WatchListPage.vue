<script setup>
import { onBeforeMount, watch, ref } from 'vue';
import { useRoute, RouterView, RouterLink } from 'vue-router';
import { useUser } from '../composables/useUser';
import { useWatch } from '../composables/useWatch';
import WatchItem from '../components/WatchItem.vue';

const route = useRoute();

const { loadUser } = useUser();
const { loadWatches } = useWatch()

const userWatches = ref(null);
const pageUser = ref(null);


onBeforeMount(async () => {
    pageUser.value = await loadUser(route.params.userId)
    userWatches.value = await loadWatches(pageUser.value._id)
});


watch(() =>route.fullPath, async () => {
    pageUser.value = await loadUser(route.params.userId)
    userWatches.value = await loadWatches(pageUser.value._id)
})

</script>

<template>
    <div class="wrapper" v-if="pageUser && userWatches">
        <h1>{{ pageUser.username }}'s list</h1>
        <div class="content-wrapper">
            <div class="list-wrapper">
                <div class="list">
                    <div class="list-item-wrapper" v-for="userWatch in userWatches">
                        <RouterLink :to="{ name: 'detail', params: { watchId: userWatch._id } }"><WatchItem :watch=userWatch></WatchItem></RouterLink>
                    </div>
                    <div v-if="userWatches.length === 0" class="list-item-wrapper tiny">
                        <span>Looks like {{ pageUser.username }} isn't watching anything.</span>
                    </div>
                </div>
            </div>
            <div class="detail-wrapper">
                <RouterView :key="route.params.watchId" />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "../styles";

.content-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: clamp($px-l, 25%, $px-xl);
}

.list-wrapper, .detail-wrapper {
    flex: 1;
}

.list-item-wrapper {
    border-bottom: 1px solid $bg-primary;
}
</style>
<script setup>
import { onBeforeMount, ref } from 'vue';
import { lengthFlavourText } from '../utils/vesselUtils';
import UserItem from './UserItem.vue';
import { useWatch } from '../composables/useWatch';
import { useUser } from '../composables/useUser';
import { useAuthStore } from '../store/useAuthStore';

const props = defineProps({
    target: Object,
    displayItem: { type: Boolean, default: false }
})
const emit = defineEmits(['submit', 'cancel'])

const auth = useAuthStore()
const { loadWatches } = useWatch()
const { loadUser } = useUser()

const vessel = ref(props.target)
const user = ref(null)
const userWatches = ref(null)

onBeforeMount(async () => {
    [user.value, userWatches.value] = await Promise.all([
        loadUser(auth.user._id),
        loadWatches(auth.user._id)
    ])
})

const reloadUser = async () => {
    user.value = await loadUser(auth.user._id)
}

const add = () => {
    emit("submit", vessel.value)
}

const close = () => {
    emit("cancel")
}
</script>

<template>
    <div class="vessel-detail-wrapper">
        <div class="detail-header-wrapper">
            <h2>{{ vessel.title }}</h2>
            <svg v-if="!displayItem" @click="close" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path fill="currentColor" d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"/></svg>
        </div>
        <div class="detail-content-wrapper" :class="{ scrollable: props.displayItem }">
            <div class="detail-element-row">
                <div>
                    <h4>Status: </h4>
                    <span>{{ vessel.status }}</span>
                </div>
                <div class="detail-element-row spaced" v-if="user">
                    <h4>Created by: </h4>
                    <UserItem :target="vessel.owner" @reload="reloadUser" :follows="user.follows.some(f => f._id === vessel.owner._id)" />
                </div>
            </div>
            <div class="detail-element">
                <h3>Synopsis</h3>
                <p>{{ vessel.synopsis }}</p>
            </div>
            <div class="detail-element">
                <span class="highlight-span">{{ lengthFlavourText(vessel) }}</span>
            </div>
            <div class="detail-element" id="last"  v-if="userWatches">
                <button class="button-cyan-solid" @click="add" :disabled="userWatches.map(w => w.vessel._id).includes(vessel._id)">
                    {{ !(userWatches.map(w => w.vessel._id).includes(vessel._id)) ? "Add to list" : "This vessel is already in your list" }}
                </button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "../styles";

.vessel-detail-wrapper {
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

    background-color: $amber-primary;
    border-radius: $px-xxs $px-xxs 0 0;
    padding:  $px-xs $px-s;

    svg:hover {
        color: $text-highlight;
        cursor: pointer;
    }

    h2 {
        margin: 0;
    }
}

.detail-content-wrapper {
    display: flex;
    flex-direction: column;
    gap: $px-xs;

    padding: $px-s;
}

.scrollable {
    max-height: 40vh;
    overflow: scroll;
}

.detail-element-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    h4 {
        margin: 0;
    }
}

.spaced {
    gap: $px-xs
}

#last {
    margin-top: $px-s;
}

</style>
<script setup>
import { onBeforeMount, ref } from 'vue';
import { useAuth } from '../composables/useAuth';
import { useUser } from '../composables/useUser';
import UserItem from './UserItem.vue';

const props = defineProps(['watchers', 'ownerId'])

const auth = useAuth()
const { loadUser } = useUser()

const owner = ref(null)
const user = ref(null)

onBeforeMount(async () => {
    [user.value, owner.value] = await Promise.all([
        loadUser(auth.user.value._id),
        loadUser(props.ownerId)
    ])
})

const reloadUser = async () => {
    user.value = await loadUser(auth.user.value._id)
}

</script>

<template>
    <div class="watchers-wrapper" v-if="user">
        <UserItem :target="owner" @reload="reloadUser" :follows="user.follows.some(f => f._id === owner._id)" id="owner" v-if="user._id !== owner._id"/>
        <h3>{{ props.watchers.length }} Watcher{{ ((props.watchers.length > 1) || (props.watchers.length === 0)) ? 's' : '' }}</h3>
        <UserItem v-for="watcher in props.watchers" :target="watcher" @reload="reloadUser" :follows="user.follows.some(f => f._id === watcher._id)" />
    </div>
</template>

<style lang="scss" scoped>
@import '../styles';

h3 {
    margin: 0;
}

#owner {
    border-bottom: 1px solid $bg-primary;
}

.watchers-wrapper {
    display: flex;
    flex-direction: column;
    gap: $px-xs;
    padding: $px-s;
}
</style>
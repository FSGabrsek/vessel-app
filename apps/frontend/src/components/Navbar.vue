<script setup>
import { RouterLink } from 'vue-router'
import { useAuth } from '../composables/useAuth';

const auth = useAuth()

</script>

<template>
    <div class="nav-wrapper" v-if="auth.user.value">
        <RouterLink :to="{ name: 'home' }" class="link list-link">
            <svg class="vessel-icon" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88.07 130.4" width="24" height="24"><path fill="currentColor" d="M75,140.2a126.74,126.74,0,0,0,17-17C131.07,75.85,117,10.07,114.69,9.8c-1-.11-.12,11-3.9,27.81a144,144,0,0,1-7.44,23.21c-5.75,14.51-9,22.34-17,28.35A36.83,36.83,0,0,1,80,92.77a12.28,12.28,0,0,1-10.51-.06,35.49,35.49,0,0,1-5.85-3.54c-8-6-11.26-13.84-17-28.34a143.89,143.89,0,0,1-7.44-23.22C35.43,20.79,36.28,9.69,35.31,9.8,33,10.07,18.93,75.85,58,123.19a126.74,126.74,0,0,0,17,17" transform="translate(-30.96 -9.8)"/></svg>
            <div class="link-text">Home</div>
        </RouterLink>
        <RouterLink :to="{ name: 'watch', params: { userId: auth.user.value._id } }" class="link list-link">
            <svg class="list-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M11,4H21V6H11Zm0,4h6v2H11Zm0,6H21v2H11Zm0,4h6v2H11ZM3,4H9v6H3ZM3,14H9v6H3Z" fill="currentColor"/></svg>
            <div class="link-text">My list</div>
        </RouterLink>
        <RouterLink :to="{ name: 'vessel' }" class="link list-link">
            <svg class="add-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M2 18h10v2H2v-2zm0-7h20v2H2v-2zm0-7h20v2H2V4zm16 14v-3h2v3h3v2h-3v3h-2v-3h-3v-2h3z" fill="currentColor"/></svg>
            <div class="link-text">Add to my list</div>
        </RouterLink>
        <RouterLink :to="{ name: 'community' }" class="link list-link">
            <svg class="community-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path fill="currentColor" d="M2 22a8 8 0 1 1 16 0H2zm8-9c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm7.363 2.233A7.505 7.505 0 0 1 22.983 22H20c0-2.61-1-4.986-2.637-6.767zm-2.023-2.276A7.98 7.98 0 0 0 18 7a7.964 7.964 0 0 0-1.015-3.903A5 5 0 0 1 21 8a4.999 4.999 0 0 1-5.66 4.957z"/></svg>
            <div class="link-text">Community</div>
        </RouterLink>
    </div>
    <div id="nav-spacer" v-else></div>
</template>

<style scoped lang="scss">
@import "../styles";

.nav-wrapper {
    display: flex;
    justify-content: flex-end;
    flex-direction: row;
    gap: 1rem;

    padding: 1.5rem;
    padding-inline: 5em;

    color: $text;
}

#nav-spacer {
    height: 4rem;
}

.link {
    display: flex;
    flex-direction: row;

    font-weight: $bold;
}

.link-text {
    overflow: hidden;
    display: inline-block;
    white-space: nowrap;
}

.link:hover .link-text{
    max-width: 200px;
    opacity: 1;
    margin-left: .5em;

    transition: max-width .25s ease-in, opacity .25s ease-in, margin-left .25s ease-in;
}

.link .link-text{
    max-width: 0;
    opacity: 0;
    margin-left: 0;

    transition: max-width .25s ease-out, opacity .25s ease-out, margin-left .25s ease-out;
}

.router-link-active {
    .link-text {
        opacity: 1;
        max-width: 200px;
        margin-left: .5em;
    }

    .vessel-icon{
        color: $cyan-primary;
    }

    .list-icon{
        color: $amber-primary;
    }

    .add-icon{
        color: $red-primary;
    }

    .community-icon{
        color: $highlight
    }
}
</style>
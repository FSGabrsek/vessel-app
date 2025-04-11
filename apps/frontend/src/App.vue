<script setup>
import { RouterView, useRouter } from 'vue-router';
import Navbar from './components/Navbar.vue'
import { useLoadingStore } from './store/useLoadingStore';
import Footer from './components/Footer.vue';

const router = useRouter();
const loadingStore = useLoadingStore();

const retry = () => {
    router.go(0);
}

</script>

<template>
    <div class="root-wrapper">
        <Navbar />
        <main v-if="!loadingStore.error">
            <RouterView />
        </main>

        <div v-if="loadingStore.pending > 0" class="loading">
            <div class="load-wrapper">
                <span class="loader"></span>
            </div>
        </div>
        <div v-if="loadingStore.error" class="error">
            <h2>Something went wrong</h2>
            <p>Please try again in a moment...</p>
            <button class="button-amber-hollow" @click=retry>Retry</button>
        </div>
    </div>
    <div id="page-end">
        <Footer  />
    </div>
</template>

<style scoped lang="scss">
@import "styles.scss";

.root-wrapper {
    display: flex;
    flex-direction: column;

    flex: 1;

    padding-bottom: $px-l;
}

.error, .loading {
    position: fixed;
    height: 100%;
    width: 100%;

    display: flex;
    justify-self: center;
    align-self: center;

    flex-direction: column;
    justify-content: center;
    align-items: center;

    gap: $px-s;
}

.loader {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: block;
  margin:15px auto;
  position: relative;
  background: #FFF;
  box-shadow: -24px 0 #FFF, 24px 0 #FFF;
  box-sizing: border-box;
  animation: shadowPulse 2s linear infinite;
}

@keyframes shadowPulse {
  33% {
    background: #FFF;
    box-shadow: -24px 0 $amber-primary, 24px 0 #FFF;
  }
  66% {
    background: $amber-primary;
    box-shadow: -24px 0 #FFF, 24px 0 #FFF;
  }
  100% {
    background: #FFF;
    box-shadow: -24px 0 #FFF, 24px 0 $amber-primary;
  }
}

  
main {
    margin-inline: clamp($px-m, 17vw, $px-xl);
    flex: 1;
}

#page-end {
    align-self: end;
}

</style>

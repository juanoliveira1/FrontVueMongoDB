<template>
    <router-link to="/Login"></router-link>
    <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
})
</script>

<style lang="scss">
#app {
    font-family: $primary-font;
    background-color: $slider-bg-color;

    display: flex;
    @media (max-width: 960px) {
        flex-direction: column;
    }
}
</style>

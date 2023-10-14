<template>
    <section class="login-footer"></section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

const imgs = [
    { id: 1, name: 'lyft-logo' },
    { id: 2, name: 'buzzfeed-logo' },
    { id: 3, name: 'asana-logo' },
    { id: 4, name: 'oneplus-logo' },
    { id: 5, name: 'house-logo' },
]

export default defineComponent({
    data() {
        return {
            imgs,
        }
    },
})
</script>

<style lang="scss" scoped>
.login-footer {
    display: flex;
    justify-content: center;
    flex-direction: column;
    width: 100%;

    &__title {
        font-size: 1rem;
        color: #a1a7b2;
        margin-bottom: 1.5rem;
    }

    &__icons {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-flow: row wrap;
        margin-bottom: 1rem;
        width: 70%;
        margin: 0 auto;

        &__item {
            padding: 10px;
            padding-left: 0;
            width: fit-content;
            height: fit-content;
        }
    }
}
</style>

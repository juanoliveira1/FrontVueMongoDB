/* eslint-disable */
<template>
    <section class="slider-section">
        <div class="slider-section__carousel">
            <slide-item
                v-for="slide in slides"
                :key="slide.id"
                :slideImg="slide.src"
            />
        </div>
    </section>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, ref } from 'vue'

import SlideItem from './SlideItem.vue'

const slides = [
    {
        id: 2,
        src: 'slide-2',
    },
]

export default defineComponent({
    components: {
        SlideItem,
    },

    setup() {
        onBeforeUnmount(() => clearInterval(intervalHandle)) // clear interval on unmount for prevent memory leak

        let currentSlide = ref(1)
        const slidesLength = slides.length
        const slideSpeed = 4500
        const slideDirection = ref('slide-left')
        let intervalHandle = setInterval(() => {
            nextSlide()
        }, slideSpeed)

        function nextSlide() {
            if (currentSlide.value === slidesLength) {
                currentSlide.value = 1
            } else {
                currentSlide.value++
            }
            slideDirection.value = 'slide-right'
            smoothSlide()
        }

        const slidePick = (index: number) => {
            index < currentSlide.value
                ? (slideDirection.value = 'slide-left')
                : (slideDirection.value = 'slide-right')
            currentSlide.value = index
            smoothSlide()
        }

        function smoothSlide() {
            clearInterval(intervalHandle)
            intervalHandle = setInterval(() => {
                nextSlide()
            }, slideSpeed)
        }

        return {
            slides,
            currentSlide,
            intervalHandle,
            slideSpeed,
            slideDirection,
            nextSlide,
            slidePick,
            smoothSlide,
        }
    },
})
</script>

<style lang="scss" scoped>
.slider-section {
    display: flex;
    background-color: $slider-bg-color;
    width: 100%;
    height: 100vh;
    margin: auto 0;
    &__carousel {
        position: relative;
        width: 100%;
        display: flex;
        overflow: hidden;

        &__pagination {
            position: absolute;
            bottom: 15%;
            width: 100%;
            display: flex;
            gap: 8px;
            justify-content: center;
            align-items: center;

            /*for handle 500% zoom*/
            @media (max-height: 480px) {
                bottom: 8%;
            }

            &__picker {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                cursor: pointer;
                background-color: $slider-bg-color;
                border: 1px solid #fff;
                border-radius: 50%;

                &--active {
                    background-color: #fff;
                }
                /*for handle 500% zoom*/
                @media (max-height: 180px) {
                    width: 8px;
                    height: 8px;
                }
            }
        }
    }
}
</style>

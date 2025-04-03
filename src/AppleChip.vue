<template>
  <div class="m-chip flex-shrink-0">
    <div class="logo">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 170" version="1.1">
        <path
          d="m150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.197-2.12-9.973-3.17-14.34-3.17-4.58 0-9.492 1.05-14.746 3.17-5.262 2.13-9.501 3.24-12.742 3.35-4.929 0.21-9.842-1.96-14.746-6.52-3.13-2.73-7.045-7.41-11.735-14.04-5.032-7.08-9.169-15.29-12.41-24.65-3.471-10.11-5.211-19.9-5.211-29.378 0-10.857 2.346-20.221 7.045-28.068 3.693-6.303 8.606-11.275 14.755-14.925s12.793-5.51 19.948-5.629c3.915 0 9.049 1.211 15.429 3.591 6.362 2.388 10.447 3.599 12.238 3.599 1.339 0 5.877-1.416 13.57-4.239 7.275-2.618 13.415-3.702 18.445-3.275 13.63 1.1 23.87 6.473 30.68 16.153-12.19 7.386-18.22 17.731-18.1 31.002 0.11 10.337 3.86 18.939 11.23 25.769 3.34 3.17 7.07 5.62 11.22 7.36-0.9 2.61-1.85 5.11-2.86 7.51zm-31.26-123.01c0 8.1021-2.96 15.667-8.86 22.669-7.12 8.324-15.732 13.134-25.071 12.375-0.119-0.972-0.188-1.995-0.188-3.07 0-7.778 3.386-16.102 9.399-22.908 3.002-3.446 6.82-6.3113 11.45-8.597 4.62-2.2516 8.99-3.4968 13.1-3.71 0.12 1.0831 0.17 2.1663 0.17 3.2409z"
          fill="#fff"
        ></path>
      </svg>
      <span>M{{ benchmarks.cpuSingle[props.cpuType].length + props.generationCount }}</span>
    </div>
    <div class="subtitle">{{ cpuTypeToMoniker }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

import benchmarks from '@/benchmarks'

const props = defineProps({
  generationCount: {
    type: Number,
    required: true,
  },
  cpuType: {
    type: String,
    required: true,
  },
})

const cpuTypeToMoniker = computed(() => {
  return props.cpuType !== 'base' ? props.cpuType : ''
})
</script>

<style scoped>
.m-chip {
  position: relative;
  width: 128px;
  height: 128px;
  background: linear-gradient(135deg, #1e1e24 10%, #050505 60%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  user-select: none;
  background-size: 200% 200%;
  background-clip: content-box;
  border-radius: 4px;
  border: 2px outset rgba(100, 100, 100, 0.1);
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.25);
}

.m-chip .logo {
  opacity: 0.6;
  user-select: none;
  font-size: 34px;
  font-weight: 600;
  color: white;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.subtitle {
  opacity: 0.8;
  display: block;
  user-select: none;
  text-transform: uppercase;
  text-align: center;
  font-size: 20px;
  font-weight: 450;
  margin-top: -4px;
}

.m-chip .logo svg {
  width: 36px;
  height: 36px;
  margin-top: -7px;
}

.m-chip::before,
.m-chip::after {
  position: absolute;
  background: linear-gradient(
    90deg,
    rgb(51 0 114 / 100%),
    rgb(130 70 175 / 100%),
    rgb(167 123 202 / 100%),
    rgb(255 181 0 / 100%),
    rgb(173 220 145 / 100%),
    rgb(108 194 74 / 100%),
    rgb(68 105 61 / 100%),
    rgb(21 71 52 / 100%),
    rgb(44 213 196 / 100%),
    rgb(105 179 231 / 100%),
    rgb(48 127 226 / 100%),
    rgb(0 71 187 / 100%),
    rgb(131 0 101 / 100%),
    rgb(197 41 155 / 100%),
    rgb(217 134 186 / 100%),
    rgb(206 0 88 / 100%),
    rgb(250 70 22 / 100%),
    rgb(237 139 0 / 100%),
    rgb(243 213 78 / 100%),
    rgb(247 234 72 / 100%)
  );
  background-size: 400%;
  content: '';
  transform: rotateZ(360deg);
  will-change: transform;
  mix-blend-mode: plus-lighter;
}

.m-chip::before {
  z-index: -1;
  width: 140%;
  height: 340%;
  border-radius: 50%;
  left: -20%;
  animation: animate-rotate 50s linear infinite;
  filter: blur(100px);
}

.m-chip::after {
  z-index: -2;
  width: 500%;
  height: 100%;
  border-radius: 50%;
  left: -200%;
  animation: animate-rotate 90s linear reverse infinite;
  filter: blur(100px);
}

@keyframes animate-rotate {
  0% {
    background-position: 0 0;
    transform: rotate(0deg);
  }

  50% {
    background-position: 400% 0;
  }

  100% {
    background-position: 0 0;
    transform: rotate(360deg);
  }
}
</style>

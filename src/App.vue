<template>
  <div class="grid mt-8">
    <div class="col-12 flex justify-content-center align-items-center">
      <canvas id="canvas"></canvas>
      <div class="starfield-overlay"></div>
      <h1 class="text-center">What could</h1>
      <AppleChip :generationCount :cpuType class="mx-1" />
      <h1 class="text-center">perform like?</h1>
    </div>
  </div>
  <div class="grid my-4 justify-content-center align-items-center flex-wrap">
    <div class="col-12 text-center">
      Show
      <PSelect
        scroll-height="50vh"
        class="m-2"
        v-model="generationCount"
        :options="Array.from({ length: 16 }, (_, i) => i + 1)"
      >
      </PSelect>
      <PSelect class="m-2" v-model="predictionType" :options="['linear', 'logarithmic']"> </PSelect>
      <PSelect
        class="m-2"
        v-model="benchmarkType"
        :options="[
          { label: 'CPU (single-core)', value: 'cpuSingle' },
          { label: 'CPU (multi-core)', value: 'cpuMulti' },
          { label: 'GPU (OpenCL)', value: 'gpuOpenCL' },
          { label: 'GPU (Metal)', value: 'gpuMetal' },
        ]"
        option-label="label"
        option-value="value"
      >
      </PSelect>
      <span class="inline-block m-2">predictions for</span>
      <PSelect
        class="m-2"
        v-model="cpuType"
        :options="[
          { label: 'baseline models', value: 'base' },
          { label: 'Pro models', value: 'pro' },
          { label: 'Max models', value: 'max' },
          { label: 'Ultra models', value: 'ultra' },
        ]"
        option-label="label"
        option-value="value"
      >
      </PSelect>
    </div>
  </div>
  <div class="grid">
    <div class="col-12">
      <BenchmarkGraph :generationCount :predictionType :benchmarkType :cpuType />
    </div>
  </div>
  <div class="grid my-6">
    <div class="col-12 text-center">
      <a @click.prevent href="" @click="creditsVisible = true">Credits</a>
      &bull;
      <a href="https://www.paypal.com/donate/?hosted_button_id=Z4VTV4HNY383Q">Buy me a coffee</a>
      &bull;
      <a href="https://www.paypal.com/donate/?hosted_button_id=Z4VTV4HNY383Q"
        >or a fully specced Macbook Pro</a
      >
    </div>
  </div>

  <PDialog v-model:visible="creditsVisible" modal header="Credits" :style="{ width: '25rem' }">
    <ul style="line-height: 2rem">
      <li>Benchmarks from <a href="https://browser.geekbench.com/mac-benchmarks">Geekbench</a></li>
      <li>Chart library: <a href="https://vue-data-ui.graphieros.com/">Vue Data UI</a></li>
      <li>UX components: <a href="https://primevue.org/">PrimeVue</a></li>
      <li>Frontend framework: <a href="https://vuejs.org/">Vue 3</a></li>
      <li>
        <a
          href="https://stackoverflow.com/questions/46436270/hyperdrive-effect-in-canvas-across-randomly-placed-circles"
          >Hyperdrive effect animation</a
        >
        by <a href="https://stackoverflow.com/users/3877726/blindman67">Blindman67</a>
      </li>
      <li>
        <a
          href="https://stackoverflow.com/questions/9461621/format-a-number-as-2-5k-if-a-thousand-or-more-otherwise-900"
          >Number formatting function</a
        >
        by
        <a href="https://stackoverflow.com/users/87015/salman-arshad">Salman Arshad</a>
      </li>
      <li>My <a href="https://rubjo.github.io/victor-mono/">Victor Mono</a> coding font</li>
    </ul>
    <div class="col-12 text-center muted">by <a href="https://www.github.com/rubjo">rubjo</a></div>
  </PDialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import AppleChip from '@/AppleChip.vue'
import BenchmarkGraph from '@/BenchmarkGraph.vue'

import PSelect from 'primevue/select'
import PDialog from 'primevue/dialog'

import hyperDriveInit from '@/hyperdrive.js'

const generationCount = ref(5)
const predictionType = ref('logarithmic')
const benchmarkType = ref('cpuSingle')
const cpuType = ref('base')

const creditsVisible = ref(false)

onMounted(() => {
  hyperDriveInit()
})
</script>

<style>
html {
  background: #111;
  color: #ccc;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}

#app {
  max-width: 900px;
  margin: 0 auto;
}

#canvas {
  position: absolute;
  z-index: -10;
  width: 100vw;
  height: 1000px;
  /* mix-blend-mode: screen; */
}

.starfield-overlay {
  position: absolute;
  z-index: -5;
  width: 100vw;
  height: 1000px;
  background: linear-gradient(to bottom, transparent, #111);
}

kbd,
code,
pre,
.vue-ui-data-table td:not(.sticky-col-first) {
  font-family: 'Victor Mono', monospace;
}

h1 {
  font-weight: 500;
  filter: drop-shadow(0 0 20px #111) drop-shadow(0 0 40px #111);
}

a {
  color: #0ad;
}

.muted {
  opacity: 0.3;
}
</style>

<template>
  <VueDataUi component="VueUiXy" :dataset="dataset" :config="config" />
</template>

<script setup>
import { computed } from 'vue'

import { VueDataUi } from 'vue-data-ui'
import 'vue-data-ui/style.css'

import benchmarks from '@/benchmarks'

import { seriesPredictedValues } from '@/utils'

const props = defineProps({
  generationCount: {
    type: Number,
    required: true,
  },
  predictionType: {
    type: String,
    required: true,
  },
  benchmarkType: {
    type: String,
    required: true,
  },
  cpuType: {
    type: String,
    required: true,
  },
})

const benchmarkValues = computed(() => {
  return benchmarks[props.benchmarkType][props.cpuType]
})

const predictedValues = computed(() => {
  return seriesPredictedValues(benchmarkValues.value, props.predictionType, props.generationCount)
})

const combinedValues = computed(() => {
  return [...benchmarkValues.value, ...predictedValues.value.filter((v) => v)]
})

const benchmarkTypeToName = computed(() => {
  switch (props.benchmarkType) {
    case 'cpuSingle':
      return 'Single-core CPU (Geekbench 6)'
    case 'cpuMulti':
      return 'Multi-core CPU (Geekbench 6)'
    case 'gpuOpenCL':
      return 'OpenCL GPU (Geekbench 6)'
    case 'gpuMetal':
      return 'Metal CPU (Geekbench 6)'
    default:
      return 'Unknown'
  }
})

const dataset = computed(() => {
  return [
    {
      name: 'Benchmark',
      type: 'bar',
      dataLabels: false,
      series: benchmarkValues.value,
    },
    {
      name: 'Prediction',
      type: 'line',
      dataLabels: false,
      smooth: true,
      series: predictedValues.value,
    },
  ]
})

const cpuTypeLabel = computed(() => {
  switch (props.cpuType) {
    case 'pro':
      return ' Pro'
    case 'max':
      return ' Max'
    case 'ultra':
      return ' Ultra'
    default:
      return ''
  }
})

const processorNames = computed(() => {
  return Array.from(
    { length: benchmarkValues.value.length + props.generationCount },
    (_, i) => 'M' + (i + 1) + cpuTypeLabel.value,
  )
})

const config = computed(() => ({
  customPalette: [],
  showTable: true,
  showZoom: false,
  table: {
    th: { backgroundColor: '#111111', color: '#CCCCCC' },
    td: { backgroundColor: '#111111', color: '#CCCCCC' },
  },
  chart: {
    backgroundColor: 'transparent',
    color: '#CCCCCC',
    title: {
      text: benchmarkTypeToName.value,
      color: '#CCCCCC',
      textAlign: 'left',
      paddingLeft: 24,
    },
    padding: { left: 75, bottom: 100, right: 30 },
    legend: { show: false },
    tooltip: {
      borderColor: 'transparent',
      customFormat: ({ seriesIndex, datapoint, series }) => {
        console.log(series)
        let content = ''
        let processor = processorNames.value[seriesIndex]

        if (datapoint[0].value) {
          content = '<strong>' + processor + ' benchmark</strong>'
        } else {
          content = '<strong>' + processor + ' prediction (' + props.predictionType + ')</strong>'
        }

        content += `<table class="w-full" cellspacing="10">`

        // Show percentage increase over any previous values
        for (let i = seriesIndex; i > 0; i--) {
          const percentageChange = Math.round(
            ((combinedValues.value[seriesIndex] - combinedValues.value[i - 1]) /
              combinedValues.value[i - 1]) *
              100,
          )
          const percentageToFactor = Math.round((100 + percentageChange) / 10) / 10
          content += `<tr><td class="text-right">From ${processorNames.value[i - 1]}:</td>`
          content += `<td><span class="tag ${percentageToFactor > 0 ? 'positive' : 'negative'}">${percentageToFactor}x</span></td></tr>`
        }

        content += `</table>`

        return `<div class="tooltip">${content}</div>`
      },
    },
    highlighter: { color: '#000000', opacity: 20 },
    grid: {
      labels: {
        fontSize: 14,
        color: '#CCCCCC',
        xAxis: {},
        xAxisLabels: {
          rotation: -45,
          color: '#CCCCCC',
          values: processorNames.value,
        },
      },
    },
    labels: { fontSize: 20 },
    zoom: {
      show: false,
    },
  },
  line: { radius: 5, labels: { show: true, color: '#CCCCCC', offsetY: -15 } },
  bar: { labels: { show: true, color: '#CCCCCC' } },
}))
</script>

<style>
.tooltip {
  padding: 15px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.25);
}

.tag {
  padding: 1px 6px;
  border-radius: 50px;
  background: rgba(64, 255, 64, 0.25);
  border: 1px solid rgba(64, 255, 64, 0.1);
  color: #fff;
}
</style>

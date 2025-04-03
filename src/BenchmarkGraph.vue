<template>
  <div class="chart-container">
    <VueDataUi component="VueUiXy" :dataset="dataset" :config="config" />
  </div>
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
      color: '#00aadd',
      series: benchmarkValues.value,
    },
    {
      name: 'Prediction',
      type: 'line',
      dataLabels: false,
      smooth: true,
      color: '#00aadd',
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

const numberFormatter = (num, digits) => {
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ]
  const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/
  const item = lookup.findLast((item) => num >= item.value)
  return item ? (num / item.value).toFixed(digits).replace(regexp, '').concat(item.symbol) : '0'
}

const config = computed(() => ({
  showTable: false,
  showZoom: false,
  table: {
    th: { backgroundColor: 'transparent', color: '#CCCCCC' },
    td: { backgroundColor: 'transparent', color: '#CCCCCC' },
  },
  chart: {
    backgroundColor: 'transparent',
    color: '#CCCCCC',
    title: {
      text: benchmarkTypeToName.value,
      color: '#CCCCCC',
      textAlign: 'left',
      paddingLeft: 24,
      fontSize: 20,
    },
    padding: { top: 50, left: 100, bottom: 130, right: 30 },
    legend: { show: false },
    tooltip: {
      borderColor: 'transparent',
      customFormat: ({ seriesIndex, datapoint }) => {
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
    highlighter: { color: '#ffffff', opacity: 2 },
    grid: {
      labels: {
        fontSize: 30,
        color: '#CCCCCC',
        xAxis: {},
        xAxisLabels: {
          fontSize: 30,
          rotation: -45,
          yOffset: 0,
          color: '#CCCCCC',
          values: processorNames.value,
        },
        yAxis: {
          formatter: ({ value }) => {
            return numberFormatter(value, 1)
          },
        },
      },
    },
    labels: { fontSize: 30 },
    zoom: {
      show: false,
    },
  },
  line: {
    radius: 8,
    useGradient: false,
    strokeWidth: 8,
    dot: {
      useSerieColor: false,
      fill: '#111111',
      strokeWidth: 5,
    },
    labels: {
      show: true,
      offsetY: -20,
      rounding: 0,
      color: '#cccccc',
      formatter: null,
    },
    area: {
      useGradient: true,
      opacity: 20,
    },
  },
  bar: { labels: { show: true, color: '#CCCCCC' } },
}))
</script>

<style>
.chart-container {
  background: rgba(0, 0, 0, 0.2);
  padding: 40px 20px 20px;
  border-radius: 10px;
  backdrop-filter: blur(5px);
}

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

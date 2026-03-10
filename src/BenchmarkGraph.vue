<template>
  <div class="chart-container">
    <VueDataUi component="VueUiXy" :dataset="dataset" :config="config" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

import { VueDataUi } from 'vue-data-ui'
import 'vue-data-ui/style.css'

import benchmarks from '@/benchmarks'

import { predictNextValues, predictNextValuesLogarithmic, seriesPredictedValues } from '@/utils'

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

const hoveredIndex = ref(null)

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
  const series = [
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

  if (hoveredPredictionValues.value) {
    series.push({
      name: 'Old prediction',
      type: 'line',
      smooth: true,
      dashed: true,
      color: 'rgba(200, 200, 200, 0.75)',
      dataLabels: false,
      series: hoveredPredictionValues.value,
    })
  }

  return series
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

const hoveredPredictionValues = computed(() => {
  if (hoveredIndex.value === null) return null

  const benchmarkCount = benchmarkValues.value.length

  // Only show when hovering a benchmark that is NOT the last benchmark
  if (hoveredIndex.value >= benchmarkCount - 1) return null

  const limit = hoveredIndex.value + 1

  if (limit < 2) return null

  const partialData = benchmarkValues.value.slice(0, limit)

  const totalLength = benchmarkCount + props.generationCount
  const predictionsNeeded = totalLength - limit

  const predicted =
    props.predictionType === 'logarithmic'
      ? predictNextValuesLogarithmic(partialData, predictionsNeeded)
      : predictNextValues(partialData, predictionsNeeded)

  return [...Array(limit), ...predicted]
})

const config = computed(() => ({
  showTable: true,
  showZoom: false,
  table: {
    th: { backgroundColor: 'transparent', color: '#CCCCCC' },
    td: { backgroundColor: 'transparent', color: '#CCCCCC' },
  },
  chart: {
    backgroundColor: 'transparent',
    color: '#CCCCCC',
    fontFamily: 'Victor Mono',
    title: {
      text: benchmarkTypeToName.value,
      color: '#CCCCCC',
      textAlign: 'left',
      paddingLeft: 24,
      fontSize: 24,
    },
    padding: { top: 30, left: 30, bottom: 0, right: 30 },
    legend: { show: false },
    tooltip: {
      borderColor: 'transparent',
      customFormat: ({ seriesIndex, datapoint }) => {
        const processor = processorNames.value[seriesIndex]
        const value = combinedValues.value[seriesIndex]

        let content = ''

        if (datapoint[0].value) {
          content = `<strong>${processor} benchmark</strong>`
        } else {
          content = `<strong>${processor} prediction (${props.predictionType})</strong>`
        }

        content += `<table class="w-full" cellspacing="10">`

        const previousIndex = seriesIndex - 1
        const lastBenchmarkIndex = benchmarkValues.value.length - 1

        const rows = []

        // Always allow comparison to the immediate previous chip
        if (previousIndex >= 0) {
          rows.push(previousIndex)
        }

        // Only compare to the last benchmark if it occurred before this chip
        if (
          lastBenchmarkIndex >= 0 &&
          lastBenchmarkIndex < seriesIndex &&
          lastBenchmarkIndex !== previousIndex
        ) {
          rows.push(lastBenchmarkIndex)
        }

        rows.forEach((i) => {
          const percentageChange = Math.round(
            ((value - combinedValues.value[i]) / combinedValues.value[i]) * 100,
          )

          const factor = Math.round((100 + percentageChange) / 10) / 10

          content += `<tr>`
          content += `<td class="text-right">From ${processorNames.value[i]}:</td>`
          content += `<td><code class="tag ${factor > 0 ? 'positive' : 'negative'}">${factor}x</code></td>`
          content += `</tr>`
        })

        content += `</table>`

        return `<div class="tooltip">${content}</div>`
      },
    },
    highlighter: { color: '#ffffff', opacity: 2 },
    grid: {
      labels: {
        fontSize: 24,
        color: '#CCCCCC',
        xAxis: {},
        xAxisLabels: {
          fontSize: 24,
          rotation: props.generationCount > 6 ? -45 : 0,
          yOffset: 0,
          color: '#CCCCCC',
          values: processorNames.value,
        },
        yAxis: {
          formatter: ({ value }) => {
            return numberFormatter(value, 0)
          },
        },
      },
    },
    labels: { fontSize: 24 },
    zoom: {
      show: false,
    },
  },
  line: {
    radius: 10,
    useGradient: false,
    strokeWidth: 5,
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
  events: {
    datapointEnter: ({ seriesIndex }) => {
      hoveredIndex.value = seriesIndex
    },
    datapointLeave: () => {
      hoveredIndex.value = null
    },
  },
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

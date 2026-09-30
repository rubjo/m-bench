// Generations Apple skipped are represented by a null in the series, so that
// array positions always line up with generations (index 0 is M1). Predictions
// are derived from real scores only, never from the gaps.
export const actualValues = (data) => {
  return data.filter((value) => Number.isFinite(value))
}

export const lastActualIndex = (data) => {
  for (let i = data.length - 1; i >= 0; i--) {
    if (Number.isFinite(data[i])) return i
  }
  return -1
}

// How many generations the real scores span. Skipped generations count towards
// the span even though they carry no score, so that growth stays a per
// generation rate. For a contiguous series this equals scores.length - 1.
export const generationSpan = (data) => {
  const indexes = data
    .map((value, index) => (Number.isFinite(value) ? index : -1))
    .filter((index) => index >= 0)

  if (indexes.length < 2) return 0
  return indexes[indexes.length - 1] - indexes[0]
}

export const predictNextValues = (data, predictedValues) => {
  const values = actualValues(data)
  const span = generationSpan(data)

  // Handle cases with less than two generations of data
  if (values.length < 2 || span === 0) {
    return Array(predictedValues).fill(values[values.length - 1] || 0)
  }

  // Spread the total gain across the generations the scores actually span
  const averageDifference = (values[values.length - 1] - values[0]) / span

  // Predict the next 'predictedValues' values
  const predictions = []
  let lastValue = values[values.length - 1]
  for (let i = 0; i < predictedValues; i++) {
    lastValue += averageDifference
    predictions.push(Math.round(lastValue))
  }

  return predictions
}

export const predictNextValuesLogarithmic = (data, predictedValues) => {
  const values = actualValues(data)
  const span = generationSpan(data)

  // Handle cases with less than two generations of data
  if (values.length < 2 || span === 0) {
    return Array(predictedValues).fill(values[values.length - 1] || 0)
  }

  // Spread the total growth across the generations the scores actually span
  const logAverageDifference = (Math.log(values[values.length - 1]) - Math.log(values[0])) / span

  // Predict the next 'predictedValues' using logarithmic growth
  const predictions = []
  let lastValue = values[values.length - 1]
  for (let i = 0; i < predictedValues; i++) {
    lastValue *= Math.exp(logAverageDifference)
    predictions.push(Math.round(lastValue))
  }

  return predictions
}

export const seriesPredictedValues = (data, predictionType, predictedValues) => {
  const predicted =
    predictionType === 'logarithmic'
      ? predictNextValuesLogarithmic(data, predictedValues)
      : predictNextValues(data, predictedValues)
  return [...Array(data.length), ...predicted]
}

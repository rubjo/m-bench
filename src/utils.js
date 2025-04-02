const predictNextValues = (data, predictedValues) => {
  // Calculate the average difference between consecutive data points
  let sumOfDifferences = 0
  for (let i = 1; i < data.length; i++) {
    sumOfDifferences += data[i] - data[i - 1]
  }
  const averageDifference = sumOfDifferences / (data.length - 1)

  // Predict the next 'predictedValues' values
  const predictions = []
  let lastValue = data[data.length - 1]
  for (let i = 0; i < predictedValues; i++) {
    lastValue += averageDifference
    predictions.push(Math.round(lastValue))
  }

  return predictions
}

const predictNextValuesLogarithmic = (data, predictedValues) => {
  // Handle cases with less than two data points
  if (data.length < 2) {
    return Array(predictedValues).fill(data[data.length - 1] || 0)
  }

  // Calculate the logarithmic average difference
  let logSumOfDifferences = 0
  for (let i = 1; i < data.length; i++) {
    logSumOfDifferences += Math.log(data[i]) - Math.log(data[i - 1])
  }
  const logAverageDifference = logSumOfDifferences / (data.length - 1)

  // Predict the next 'predictedValues' using logarithmic growth
  const predictions = []
  let lastValue = data[data.length - 1]
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

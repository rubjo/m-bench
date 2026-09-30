// Average scores from Geekbench 7
//
// Source: https://browser.geekbench.com/mac-benchmarks
//
// The chart publishes the mean of user-submitted results per Mac model, so these
// are averages rather than peak results. Where a chip ships in several
// configurations, the highest averaging one is used, e.g. M5 Max with 18 CPU /
// 40 GPU cores. Geekbench 6 and 7 scores are not comparable.
//
// Apple skipped the M4 Ultra and the M5 Ultra is not listed yet (it shipped
// 2026-09-22, too recently for the chart to average enough results). The ultra
// tier therefore carries a null in the M4 Ultra slot: array positions always
// map to generations, and nulls mark generations Apple never shipped. When the
// M5 Ultra is listed, append its score after the null.

export default {
  cpuSingle: {
    base: [2191, 2399, 2768, 3277, 3643],
    pro: [2201, 2433, 2817, 3377, 3692],
    max: [2227, 2547, 2825, 3500, 3727],
    ultra: [2220, 2583, 2920, null],
  },
  cpuMulti: {
    base: [8589, 9758, 11711, 15481, 17953],
    pro: [13910, 16721, 16950, 24895, 33602],
    max: [14299, 17362, 24714, 29078, 35065],
    ultra: [23575, 28717, 39168, null],
  },
  gpuOpenCL: {
    base: [18351, 26314, 29409, 34507, 46384],
    pro: [38133, 49493, 48655, 69059, 87958],
    max: [65656, 87880, 100186, 121653, 152761],
    ultra: [94872, 127208, 140529, null],
  },
  gpuMetal: {
    base: [28448, 43696, 48070, 54186, 72640],
    pro: [65412, 82998, 76999, 115633, 136206],
    max: [109000, 145026, 166988, 207377, 239629],
    ultra: [147993, 220935, 249179, null],
  },
}

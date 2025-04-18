"use client"

import { useEffect, useRef } from "react"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import { useTheme } from "next-themes"
import type { TimeMetric } from "@/types/car-data"

interface PerformanceData {
  date: string
  zeroToHundred: number | null
  hundredToTwoHundred: number | null
  quarterMile: number | null
}

interface PerformanceChartProps {
  data: PerformanceData[]
  metric: TimeMetric
  metricLabel: string
}

export function PerformanceChart({ data, metric, metricLabel }: PerformanceChartProps) {
  const chartRef = useRef<HighchartsReact.RefObject>(null)
  const { theme } = useTheme()

  // Filter out null values
  const validData = data.filter((item) => item[metric] !== null)

  // Format the date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString(undefined, { month: "short", year: "numeric" })
  }

  // Prepare data for Highcharts
  const chartData = validData.map((item) => ({
    x: new Date(item.date).getTime(),
    y: item[metric],
  }))

  // Update chart when theme changes
  useEffect(() => {
    if (chartRef.current && chartRef.current.chart) {
      const chart = chartRef.current.chart

      if (theme === "dark") {
        chart.update({
          chart: {
            backgroundColor: "transparent",
          },
          title: {
            style: { color: "#ffffff" },
          },
          xAxis: {
            labels: { style: { color: "#aaaaaa" } },
            gridLineColor: "rgba(255, 255, 255, 0.1)",
          },
          yAxis: {
            labels: { style: { color: "#aaaaaa" } },
            gridLineColor: "rgba(255, 255, 255, 0.1)",
          },
          legend: {
            itemStyle: { color: "#aaaaaa" },
          },
        })
      } else {
        chart.update({
          chart: {
            backgroundColor: "transparent",
          },
          title: {
            style: { color: "#333333" },
          },
          xAxis: {
            labels: { style: { color: "#666666" } },
            gridLineColor: "rgba(0, 0, 0, 0.1)",
          },
          yAxis: {
            labels: { style: { color: "#666666" } },
            gridLineColor: "rgba(0, 0, 0, 0.1)",
          },
          legend: {
            itemStyle: { color: "#666666" },
          },
        })
      }
    }
  }, [theme])

  // Configure Highcharts options
  const options: Highcharts.Options = {
    chart: {
      type: "spline",
      backgroundColor: "transparent",
      style: {
        fontFamily: "Inter, sans-serif",
      },
      spacingBottom: 20, // Add more space at the bottom
      height: 350, // Fixed height to prevent cutting off
    },
    title: {
      text: undefined,
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      type: "datetime",
      dateTimeLabelFormats: {
        month: "%b %Y",
      },
      title: {
        text: "Date",
      },
    },
    yAxis: {
      title: {
        text: metricLabel,
      },
      labels: {
        formatter: function () {
          return metric === "quarterMile" ? `${this.value.toFixed(3)}s` : `${this.value.toFixed(2)}s`
        },
      },
      // For time metrics, lower is better, so we want to invert the Y axis
      reversed: true,
      // Add more space for labels
      minPadding: 0.1,
      maxPadding: 0.1,
    },
    tooltip: {
      headerFormat: "<b>{point.x:%b %Y}</b><br/>",
      pointFormat: `${metricLabel}: {point.y:.${metric === "quarterMile" ? 3 : 2}f}s`,
      shared: true,
    },
    plotOptions: {
      spline: {
        marker: {
          enabled: true,
          radius: 4,
          lineWidth: 1,
        },
        lineWidth: 3,
        states: {
          hover: {
            lineWidth: 4,
          },
        },
      },
    },
    series: [
      {
        type: "spline",
        name: metricLabel,
        data: chartData,
        color: theme === "dark" ? "#3b82f6" : "#2563eb",
      },
    ],
    // Add more margin at the bottom
    margin: [0, 0, 30, 0],
  }

  return <HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />
}

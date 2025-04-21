"use client"

import { useEffect, useRef } from "react"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import { useTheme } from "next-themes"

interface PerformanceData {
  date: string
  results: number
  distance: string
}

interface PerformanceChartProps {
  data: PerformanceData[]
  metric: string
  metricLabel: string
}

export function PerformanceChart({ data, metric, metricLabel }: PerformanceChartProps) {
  const chartRef = useRef<HighchartsReact.RefObject>(null)
  const { theme } = useTheme()

  // Filter out null values
  const validData = data.filter((item) => item.results !== null)

  // Format the date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString(undefined, { month: "short", year: "numeric" })
  }

  // Prepare data for Highcharts
  const timeData = validData.map((item) => ({
    x: new Date(item.date).getTime(),
    y: item.results,
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
      spacingBottom: 20,
      height: 350,
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
          return typeof this.value === 'number' ? `${this.value.toFixed(2)}s` : this.value;
        },
      },
      reversed: true, // For time metrics, lower is better
      minPadding: 0.1,
      maxPadding: 0.1,
    },
    tooltip: {
      shared: true,
      headerFormat: "<b>{point.x:%b %Y}</b><br/>",
      pointFormat: `${metricLabel}: {point.y:.2f}s`
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
        data: timeData,
        color: theme === "dark" ? "#3b82f6" : "#2563eb",
      }
    ],
    legend: {
      enabled: false,
    }
  }

  return <HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />
}

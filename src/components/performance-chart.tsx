"use client"

import { useEffect, useRef } from "react"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import { useTheme } from "next-themes"

interface PerformanceData {
  intervalTime: {
      name: string;
      time: number;
  }[];
  accelerationData: {
      time: number;
      acceleration: number;
  }[];
  speedData: {
      time: number;
      speed: number;
  }[];
}

interface PerformanceChartProps {
  data: PerformanceData
  metric: string
  metricLabel: string
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  const chartRef = useRef<HighchartsReact.RefObject>(null)
  const { theme } = useTheme()

  // Format the date for display

  // Prepare data for Highcharts
  const timeData = data.accelerationData.map((item) => ({
    x: item.time,
    y: item.acceleration,
  }))

  const speedData = data.speedData.map((item) => ({
    x: item.time,
    y: item.speed,
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
  const options = {
    chart: {
      type: "spline",
      backgroundColor: "transparent",
      style: {
        fontFamily: "Inter, sans-serif",
      },
      spacingBottom: 20,
      height: 370,
      zooming: {
        type: 'y'
      }
    },
    title: {
      text: undefined,
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      title: {
        text: "Time",
      },
      labels: {
        enabled: false
      },
      tickWidth: 0,
      lineWidth: 1
    },
    yAxis: [{
      // Primary y-axis for acceleration
      title: {
        text: "Acceleration",
        style: {
          color: theme === "dark" ? "#3b82f6" : "#2563eb"
        }
      },
      labels: {
        formatter: function(): string {
          // @ts-ignore - Highcharts context has 'this.value'
          return `${Number(this.value).toFixed(2)}`;
        },
        style: {
          color: theme === "dark" ? "#3b82f6" : "#2563eb"
        }
      },
      min: -0.5,
      max: 1.5,
      gridLineWidth: 1,
      lineWidth: 1,
      plotLines: [{
        value: 0,
        width: 1,
        color: theme === "dark" ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.2)"
      }]
    }, {
      // Secondary y-axis for speed
      title: {
        text: "Speed",
        style: {
          color: theme === "dark" ? "#f97316" : "#ea580c"
        }
      },
      labels: {
        formatter: function(): string {
          // @ts-ignore - Highcharts context has 'this.value'
          return `${Number(this.value).toFixed(0)}`;
        },
        style: {
          color: theme === "dark" ? "#f97316" : "#ea580c"
        }
      },
      opposite: true,
      gridLineWidth: 0,
      lineWidth: 1
    }],
    tooltip: {
      shared: true,
      useHTML: true,
      headerFormat: '<small>{point.key}s</small><table>',
      pointFormat: '<tr><td style="color: {series.color}">{series.name}: </td>' +
        '<td style="text-align: right"><b>{point.y}</b></td></tr>',
      footerFormat: '</table>'
    },
    plotOptions: {
      spline: {
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: true,
              radius: 4
            }
          }
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
        name: "Acceleration",
        data: timeData,
        color: theme === "dark" ? "#3b82f6" : "#2563eb",
        yAxis: 0,
        tooltip: {
          valueSuffix: 'g',
          valueDecimals: 2
        },
        marker: {
          enabled: false
        }
      },
      {
        type: "spline",
        name: "Speed",
        data: speedData,
        color: theme === "dark" ? "#f97316" : "#ea580c",
        yAxis: 1,
        tooltip: {
          valueSuffix: ' km/h',
          valueDecimals: 0
        },
        marker: {
          enabled: false
        }
      }
    ],
    legend: {
      enabled: true,
    }
  }

  return <HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />
}

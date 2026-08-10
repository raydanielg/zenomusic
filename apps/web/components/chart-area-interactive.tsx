"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@workspace/ui/components/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/toggle-group"

export const description = "An interactive area chart showing music generation activity"

const chartData = [
  { date: "2024-04-01", created: 3, played: 12 },
  { date: "2024-04-02", created: 1, played: 8 },
  { date: "2024-04-03", created: 2, played: 15 },
  { date: "2024-04-04", created: 4, played: 22 },
  { date: "2024-04-05", created: 5, played: 28 },
  { date: "2024-04-06", created: 3, played: 34 },
  { date: "2024-04-07", created: 2, played: 18 },
  { date: "2024-04-08", created: 6, played: 32 },
  { date: "2024-04-09", created: 1, played: 11 },
  { date: "2024-04-10", created: 3, played: 19 },
  { date: "2024-04-11", created: 4, played: 35 },
  { date: "2024-04-12", created: 2, played: 21 },
  { date: "2024-04-13", created: 5, played: 38 },
  { date: "2024-04-14", created: 1, played: 22 },
  { date: "2024-04-15", created: 2, played: 17 },
  { date: "2024-04-16", created: 3, played: 19 },
  { date: "2024-04-17", created: 7, played: 36 },
  { date: "2024-04-18", created: 4, played: 41 },
  { date: "2024-04-19", created: 2, played: 18 },
  { date: "2024-04-20", created: 1, played: 15 },
  { date: "2024-04-21", created: 2, played: 20 },
  { date: "2024-04-22", created: 3, played: 17 },
  { date: "2024-04-23", created: 1, played: 23 },
  { date: "2024-04-24", created: 5, played: 29 },
  { date: "2024-04-25", created: 3, played: 25 },
  { date: "2024-04-26", created: 1, played: 13 },
  { date: "2024-04-27", created: 6, played: 42 },
  { date: "2024-04-28", created: 2, played: 18 },
  { date: "2024-04-29", created: 4, played: 24 },
  { date: "2024-04-30", created: 5, played: 38 },
  { date: "2024-05-01", created: 2, played: 22 },
  { date: "2024-05-02", created: 4, played: 31 },
  { date: "2024-05-03", created: 3, played: 19 },
  { date: "2024-05-04", created: 5, played: 42 },
  { date: "2024-05-05", created: 6, played: 39 },
  { date: "2024-05-06", created: 7, played: 52 },
  { date: "2024-05-07", created: 4, played: 30 },
  { date: "2024-05-08", created: 2, played: 21 },
  { date: "2024-05-09", created: 3, played: 18 },
  { date: "2024-05-10", created: 4, played: 33 },
  { date: "2024-05-11", created: 5, played: 27 },
  { date: "2024-05-12", created: 2, played: 24 },
  { date: "2024-05-13", created: 3, played: 16 },
  { date: "2024-05-14", created: 6, played: 49 },
  { date: "2024-05-15", created: 5, played: 38 },
  { date: "2024-05-16", created: 4, played: 40 },
  { date: "2024-05-17", created: 7, played: 42 },
  { date: "2024-05-18", created: 3, played: 35 },
  { date: "2024-05-19", created: 2, played: 18 },
  { date: "2024-05-20", created: 2, played: 23 },
  { date: "2024-05-21", created: 1, played: 14 },
  { date: "2024-05-22", created: 1, played: 12 },
  { date: "2024-05-23", created: 3, played: 29 },
  { date: "2024-05-24", created: 4, played: 22 },
  { date: "2024-05-25", created: 2, played: 25 },
  { date: "2024-05-26", created: 3, played: 17 },
  { date: "2024-05-27", created: 5, played: 46 },
  { date: "2024-05-28", created: 3, played: 19 },
  { date: "2024-05-29", created: 1, played: 13 },
  { date: "2024-05-30", created: 4, played: 28 },
  { date: "2024-05-31", created: 2, played: 23 },
  { date: "2024-06-01", created: 2, played: 20 },
  { date: "2024-06-02", created: 5, played: 41 },
  { date: "2024-06-03", created: 1, played: 16 },
  { date: "2024-06-04", created: 5, played: 38 },
  { date: "2024-06-05", created: 1, played: 14 },
  { date: "2024-06-06", created: 3, played: 25 },
  { date: "2024-06-07", created: 4, played: 37 },
  { date: "2024-06-08", created: 5, played: 32 },
  { date: "2024-06-09", created: 6, played: 48 },
  { date: "2024-06-10", created: 2, played: 20 },
  { date: "2024-06-11", created: 1, played: 15 },
  { date: "2024-06-12", created: 6, played: 42 },
  { date: "2024-06-13", created: 1, played: 13 },
  { date: "2024-06-14", created: 5, played: 38 },
  { date: "2024-06-15", created: 4, played: 35 },
  { date: "2024-06-16", created: 4, played: 31 },
  { date: "2024-06-17", created: 6, played: 52 },
  { date: "2024-06-18", created: 1, played: 17 },
  { date: "2024-06-19", created: 4, played: 29 },
  { date: "2024-06-20", created: 5, played: 45 },
  { date: "2024-06-21", created: 2, played: 21 },
  { date: "2024-06-22", created: 4, played: 27 },
  { date: "2024-06-23", created: 6, played: 53 },
  { date: "2024-06-24", created: 2, played: 18 },
  { date: "2024-06-25", created: 2, played: 19 },
  { date: "2024-06-26", created: 5, played: 38 },
  { date: "2024-06-27", created: 5, played: 49 },
  { date: "2024-06-28", created: 2, played: 20 },
  { date: "2024-06-29", created: 1, played: 16 },
  { date: "2024-06-30", created: 5, played: 40 },
]

const chartConfig = {
  activity: {
    label: "Activity",
  },
  created: {
    label: "Songs Created",
    color: "var(--primary)",
  },
  played: {
    label: "Plays",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Music Activity</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Songs created and plays over time
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            multiple={false}
            value={timeRange ? [timeRange] : []}
            onValueChange={(value) => {
              setTimeRange(value[0] ?? "90d")
            }}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select
            value={timeRange}
            onValueChange={(value) => {
              if (value !== null) {
                setTimeRange(value)
              }
            }}
          >
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillCreated" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-created)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-created)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillPlayed" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-played)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-played)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="played"
              type="natural"
              fill="url(#fillPlayed)"
              stroke="var(--color-played)"
              stackId="a"
            />
            <Area
              dataKey="created"
              type="natural"
              fill="url(#fillCreated)"
              stroke="var(--color-created)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

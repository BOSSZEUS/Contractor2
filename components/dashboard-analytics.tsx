"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts"

// Mock data for analytics
const monthlyRevenue = [
  { month: "Jan", revenue: 4500 },
  { month: "Feb", revenue: 5200 },
  { month: "Mar", revenue: 6800 },
  { month: "Apr", revenue: 7400 },
  { month: "May", revenue: 9200 },
  { month: "Jun", revenue: 10500 },
  { month: "Jul", revenue: 11200 },
  { month: "Aug", revenue: 10800 },
  { month: "Sep", revenue: 12500 },
  { month: "Oct", revenue: 13800 },
  { month: "Nov", revenue: 14200 },
  { month: "Dec", revenue: 15500 },
]

const projectTypeData = [
  { name: "Renovation", value: 45 },
  { name: "New Construction", value: 25 },
  { name: "Repair", value: 20 },
  { name: "Maintenance", value: 10 },
]

const projectStatusData = [
  { name: "Completed", count: 24 },
  { name: "In Progress", count: 18 },
  { name: "Pending", count: 12 },
  { name: "Cancelled", count: 3 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export function DashboardAnalytics() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>Monthly revenue for the current year</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="line">
            <TabsList className="mb-4">
              <TabsTrigger value="line">Line</TabsTrigger>
              <TabsTrigger value="bar">Bar</TabsTrigger>
            </TabsList>
            <TabsContent value="line" className="h-[450px]">
              <ChartContainer
                config={{
                  revenue: {
                    label: "Revenue",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-full w-full flex-1 overflow-hidden"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyRevenue} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis width={45} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="var(--color-revenue)"
                      name="Revenue"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </TabsContent>
            <TabsContent value="bar" className="h-[450px]">
              <ChartContainer
                config={{
                  revenue: {
                    label: "Revenue",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-full w-full flex-1 overflow-hidden"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyRevenue} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis width={45} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="revenue" fill="var(--color-revenue)" name="Revenue" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Project Types</CardTitle>
            <CardDescription>Distribution of projects by type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[450px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {projectTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Status</CardTitle>
            <CardDescription>Current status of all projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[450px]">
              <ChartContainer
                config={{
                  count: {
                    label: "Projects",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-full w-full overflow-hidden"
              >
                <ResponsiveContainer width="99%" height="100%">
                  <BarChart
                    data={projectStatusData}
                    layout="vertical"
                    margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={80} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="count" fill="var(--color-count)" name="Projects" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

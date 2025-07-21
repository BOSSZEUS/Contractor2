import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calculator, FileText, BarChart3, Settings, Wrench, PieChart } from "lucide-react"

const ProjectToolsPage = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-6">Project Tools</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Document Management
            </CardTitle>
            <CardDescription>Organize and manage project documents efficiently</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Document Manager</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Store, organize, and share project documents securely
                </p>
                <Button>Launch Document Manager</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Progress Tracking
            </CardTitle>
            <CardDescription>Monitor project progress and identify potential delays</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Progress Tracker</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Track milestones, tasks, and overall project completion
                </p>
                <Button>Launch Progress Tracker</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Project Cost Calculator
            </CardTitle>
            <CardDescription>Estimate project costs based on materials and labor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-8">
                <Calculator className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Cost Calculator</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Calculate project costs with material and labor estimates
                </p>
                <Button>Launch Calculator</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Resource Management
            </CardTitle>
            <CardDescription>Allocate and manage project resources effectively</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-8">
                <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Resource Manager</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage team members, equipment, and other resources
                </p>
                <Button>Launch Resource Manager</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Task Management
            </CardTitle>
            <CardDescription>Create, assign, and track project tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-8">
                <Wrench className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Task Manager</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Organize tasks, set deadlines, and assign responsibilities
                </p>
                <Button>Launch Task Manager</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Reporting & Analytics
            </CardTitle>
            <CardDescription>Generate project reports and analyze key metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-8">
                <PieChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Reporting & Analytics</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Visualize project data and generate insightful reports
                </p>
                <Button>Launch Reporting & Analytics</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ProjectToolsPage

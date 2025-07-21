"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Upload, Search, Filter, FileText, Download, Eye, MoreHorizontal, Calendar, User } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock document data
const mockDocuments = [
  {
    id: "1",
    name: "Kitchen Renovation Contract.pdf",
    type: "contract",
    size: "2.4 MB",
    uploadedBy: "John Smith",
    uploadedAt: "2024-01-15",
    projectId: "proj-1",
    projectName: "Kitchen Renovation",
    status: "signed",
  },
  {
    id: "2",
    name: "Bathroom Quote v2.pdf",
    type: "quote",
    size: "1.8 MB",
    uploadedBy: "Sarah Johnson",
    uploadedAt: "2024-01-14",
    projectId: "proj-2",
    projectName: "Bathroom Remodel",
    status: "pending",
  },
  {
    id: "3",
    name: "Building Permit Application.pdf",
    type: "permit",
    size: "3.2 MB",
    uploadedBy: "Mike Wilson",
    uploadedAt: "2024-01-13",
    projectId: "proj-1",
    projectName: "Kitchen Renovation",
    status: "approved",
  },
  {
    id: "4",
    name: "Material Invoice - Home Depot.pdf",
    type: "invoice",
    size: "1.1 MB",
    uploadedBy: "John Smith",
    uploadedAt: "2024-01-12",
    projectId: "proj-1",
    projectName: "Kitchen Renovation",
    status: "paid",
  },
  {
    id: "5",
    name: "Progress Photos - Week 1.zip",
    type: "photo",
    size: "15.7 MB",
    uploadedBy: "Contractor Team",
    uploadedAt: "2024-01-11",
    projectId: "proj-2",
    projectName: "Bathroom Remodel",
    status: "uploaded",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "signed":
    case "approved":
    case "paid":
      return "default"
    case "pending":
      return "secondary"
    case "uploaded":
      return "outline"
    default:
      return "outline"
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case "contract":
    case "quote":
    case "permit":
    case "invoice":
      return <FileText className="h-4 w-4" />
    default:
      return <FileText className="h-4 w-4" />
  }
}

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.projectName.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    return matchesSearch && doc.type === activeTab
  })

  const documentsByType = {
    all: mockDocuments.length,
    contract: mockDocuments.filter((d) => d.type === "contract").length,
    quote: mockDocuments.filter((d) => d.type === "quote").length,
    permit: mockDocuments.filter((d) => d.type === "permit").length,
    invoice: mockDocuments.filter((d) => d.type === "invoice").length,
    photo: mockDocuments.filter((d) => d.type === "photo").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">Manage all your project documents in one place</p>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Library</CardTitle>
          <CardDescription>All documents organized by type and project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and Filter */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search documents..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>

            {/* Document Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="all">All ({documentsByType.all})</TabsTrigger>
                <TabsTrigger value="contract">Contracts ({documentsByType.contract})</TabsTrigger>
                <TabsTrigger value="quote">Quotes ({documentsByType.quote})</TabsTrigger>
                <TabsTrigger value="permit">Permits ({documentsByType.permit})</TabsTrigger>
                <TabsTrigger value="invoice">Invoices ({documentsByType.invoice})</TabsTrigger>
                <TabsTrigger value="photo">Photos ({documentsByType.photo})</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Document</TableHead>
                        <TableHead>Project</TableHead>
                        <TableHead>Uploaded By</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDocuments.length > 0 ? (
                        filteredDocuments.map((document) => (
                          <TableRow key={document.id}>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                {getTypeIcon(document.type)}
                                <div>
                                  <div className="font-medium">{document.name}</div>
                                  <div className="text-sm text-muted-foreground capitalize">{document.type}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{document.projectName}</div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span>{document.uploadedBy}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>{document.uploadedAt}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getStatusColor(document.status)} className="capitalize">
                                {document.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{document.size}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center">
                            <div className="flex flex-col items-center space-y-2">
                              <FileText className="h-8 w-8 text-muted-foreground" />
                              <div className="text-sm text-muted-foreground">
                                {searchQuery
                                  ? "No documents found matching your search."
                                  : `No ${activeTab === "all" ? "" : activeTab} documents found.`}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

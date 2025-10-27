"use client"

import { useState } from "react"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Plus, Search, Download, MoreVertical, DollarSign, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { CreateInvoiceModal } from "@/components/create-invoice-modal"
import { ViewEditInvoiceModal } from "@/components/view-edit-invoice-modal"
import { useToast } from "@/hooks/use-toast"

interface Invoice {
  id: string
  invoiceNumber: string
  customer: {
    name: string
    email: string
  }
  venue: string
  bookings: number
  amount: number
  subtotal: number
  vat: number
  status: "paid" | "pending" | "overdue" | "draft"
  issueDate: string
  dueDate: string
  paidDate?: string
  notes?: string
  paymentTerms?: string
}

// Generate invoices for 2025
const generateMockInvoices = (): Invoice[] => {
  const customers = [
    { name: "John Smith", email: "john.smith@example.com" },
    { name: "Sarah Johnson", email: "sarah.j@example.com" },
    { name: "Mike Williams", email: "mike.w@example.com" },
    { name: "Emily Brown", email: "emily.brown@example.com" },
    { name: "David Lee", email: "david.lee@example.com" },
    { name: "Jennifer Brown", email: "jennifer.brown@email.com" },
    { name: "Robert Wilson", email: "robert.wilson@email.com" },
    { name: "Lisa Thompson", email: "lisa.thompson@email.com" },
  ]

  const venues = ["Powerleague Manchester", "Goals Birmingham", "Premier Sports Complex"]
  const invoices: Invoice[] = []

  for (let i = 0; i < 25; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)]
    const venue = venues[Math.floor(Math.random() * venues.length)]
    const bookings = Math.floor(Math.random() * 4) + 1
    const subtotal = Math.floor(Math.random() * 800) + 200
    const vat = subtotal * 0.2
    const total = subtotal + vat

    const month = Math.floor(Math.random() * 12)
    const day = Math.floor(Math.random() * 28) + 1
    const issueDate = new Date(2025, month, day)
    const paymentTerms = [7, 14, 30][Math.floor(Math.random() * 3)]
    const dueDate = new Date(issueDate)
    dueDate.setDate(dueDate.getDate() + paymentTerms)

    let status: "paid" | "pending" | "overdue" | "draft"
    const statusRand = Math.random()
    if (statusRand < 0.4) status = "paid"
    else if (statusRand < 0.7) status = "pending"
    else if (statusRand < 0.85) status = "overdue"
    else status = "draft"

    const invoice: Invoice = {
      id: (i + 1).toString(),
      invoiceNumber: `INV-2025-${String(i + 1).padStart(4, "0")}`,
      customer,
      venue,
      bookings,
      amount: Number(total.toFixed(2)),
      subtotal: Number(subtotal.toFixed(2)),
      vat: Number(vat.toFixed(2)),
      status,
      issueDate: `${String(day).padStart(2, "0")}/${String(month + 1).padStart(2, "0")}/2025`,
      dueDate: `${String(dueDate.getDate()).padStart(2, "0")}/${String(dueDate.getMonth() + 1).padStart(2, "0")}/2025`,
      paymentTerms: paymentTerms.toString(),
      notes: status === "draft" ? "Draft invoice - awaiting confirmation" : "",
    }

    if (status === "paid") {
      const paidDate = new Date(dueDate)
      paidDate.setDate(paidDate.getDate() - Math.floor(Math.random() * paymentTerms))
      invoice.paidDate = `${String(paidDate.getDate()).padStart(2, "0")}/${String(paidDate.getMonth() + 1).padStart(2, "0")}/2025`
    }

    invoices.push(invoice)
  }

  return invoices.sort((a, b) => {
    const dateA = new Date(a.issueDate.split("/").reverse().join("-"))
    const dateB = new Date(b.issueDate.split("/").reverse().join("-"))
    return dateB.getTime() - dateA.getTime()
  })
}

export default function InvoicesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [venueFilter, setVenueFilter] = useState("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [isViewEditModalOpen, setIsViewEditModalOpen] = useState(false)
  const { toast } = useToast()

  const [invoices, setInvoices] = useState<Invoice[]>(generateMockInvoices())

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0)
  const paidInvoices = invoices.filter((inv) => inv.status === "paid")
  const pendingInvoices = invoices.filter((inv) => inv.status === "pending")
  const overdueInvoices = invoices.filter((inv) => inv.status === "overdue")

  const paidAmount = paidInvoices.reduce((sum, inv) => sum + inv.amount, 0)
  const pendingAmount = pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0)
  const overdueAmount = overdueInvoices.reduce((sum, inv) => sum + inv.amount, 0)

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customer.name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter
    const matchesVenue = venueFilter === "all" || invoice.venue === venueFilter

    return matchesSearch && matchesStatus && matchesVenue
  })

  const getStatusBadge = (invoice: Invoice) => {
    const statusContent = {
      paid: (
        <>
          <CheckCircle className="w-3 h-3 mr-1" />
          Paid
        </>
      ),
      pending: (
        <>
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </>
      ),
      overdue: (
        <>
          <AlertCircle className="w-3 h-3 mr-1" />
          Overdue
        </>
      ),
      draft: <>Draft</>,
    }

    const statusClasses = {
      paid: "bg-green-100 text-green-700 hover:bg-green-100",
      pending: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
      overdue: "bg-red-100 text-red-700 hover:bg-red-100",
      draft: "text-slate-600",
    }

    const badgeElement = (
      <Badge
        className={invoice.status === "draft" ? "variant-outline" : statusClasses[invoice.status]}
        variant={invoice.status === "draft" ? "outline" : undefined}
      >
        {statusContent[invoice.status]}
      </Badge>
    )

    if (invoice.status === "paid" && invoice.paidDate) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{badgeElement}</TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">Paid on: {invoice.paidDate}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    return badgeElement
  }

  const handleCreateInvoice = (invoiceData: any) => {
    const newInvoice: Invoice = {
      id: String(invoices.length + 1),
      invoiceNumber: invoiceData.invoiceNumber,
      customer: {
        name: invoiceData.customer.name,
        email: invoiceData.customer.email,
      },
      venue: invoiceData.bookings[0]?.venue || "Multiple Venues",
      bookings: invoiceData.bookings.length,
      amount: invoiceData.financial.total,
      subtotal: invoiceData.financial.subtotal,
      vat: invoiceData.financial.vatAmount,
      status: invoiceData.status,
      issueDate: invoiceData.issueDate,
      dueDate: invoiceData.dueDate,
      notes: invoiceData.notes,
    }

    setInvoices((prev) => [newInvoice, ...prev])
  }

  const handleStatusFilterClick = (status: string) => {
    setStatusFilter(status)
    const tableElement = document.getElementById("invoices-table")
    if (tableElement) {
      tableElement.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setIsViewEditModalOpen(true)
  }

  const handleUpdateInvoice = (updatedInvoice: Invoice) => {
    setInvoices((prev) => prev.map((inv) => (inv.id === updatedInvoice.id ? updatedInvoice : inv)))
    toast({
      title: "Invoice updated",
      description: `${updatedInvoice.invoiceNumber} has been successfully updated.`,
    })
  }

  const handleSendInvoice = (updatedInvoice: Invoice) => {
    setInvoices((prev) => prev.map((inv) => (inv.id === updatedInvoice.id ? updatedInvoice : inv)))
    setIsViewEditModalOpen(false)
    toast({
      title: "Invoice sent",
      description: `${updatedInvoice.invoiceNumber} has been sent to ${updatedInvoice.customer.email}.`,
    })
  }

  const handleSendReminder = (invoice: Invoice) => {
    toast({
      title: "Reminder sent",
      description: `Payment reminder sent to ${invoice.customer.email} for ${invoice.invoiceNumber}.`,
    })
  }

  const handleMarkAsPaid = (invoice: Invoice) => {
    const today = new Date()
    const paidDate = `${today.getDate().toString().padStart(2, "0")}/${(today.getMonth() + 1).toString().padStart(2, "0")}/2025`

    const updatedInvoice = {
      ...invoice,
      status: "paid" as const,
      paidDate,
    }

    setInvoices((prev) => prev.map((inv) => (inv.id === invoice.id ? updatedInvoice : inv)))
    toast({
      title: "Invoice marked as paid",
      description: `${invoice.invoiceNumber} has been marked as paid.`,
    })
  }

  const handleDeleteInvoice = (invoice: Invoice) => {
    if (invoice.status !== "draft") {
      toast({
        title: "Cannot delete invoice",
        description: "Only draft invoices can be deleted.",
        variant: "destructive",
      })
      return
    }

    setInvoices((prev) => prev.filter((inv) => inv.id !== invoice.id))
    toast({
      title: "Invoice deleted",
      description: `${invoice.invoiceNumber} has been deleted.`,
    })
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Invoices</h1>
                <p className="text-slate-600 mt-1">Manage and track all invoices</p>
              </div>
              <Button onClick={() => setIsCreateModalOpen(true)} className="zeus-gradient text-white hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                Create Invoice
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-slate-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-800">£{totalRevenue.toFixed(2)}</div>
                  <p className="text-xs text-slate-600 mt-1">{invoices.length} total invoices</p>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer transition-all hover:shadow-md hover:scale-105 active:scale-100"
                onClick={() => handleStatusFilterClick("paid")}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Paid</CardTitle>
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">£{paidAmount.toFixed(2)}</div>
                  <p className="text-xs text-slate-600 mt-1">{paidInvoices.length} invoices</p>
                  {statusFilter === "paid" && (
                    <p className="text-xs text-green-600 font-medium mt-2">Currently filtering by Paid</p>
                  )}
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer transition-all hover:shadow-md hover:scale-105 active:scale-100"
                onClick={() => handleStatusFilterClick("pending")}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">£{pendingAmount.toFixed(2)}</div>
                  <p className="text-xs text-slate-600 mt-1">{pendingInvoices.length} invoices</p>
                  {statusFilter === "pending" && (
                    <p className="text-xs text-yellow-600 font-medium mt-2">Currently filtering by Pending</p>
                  )}
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer transition-all hover:shadow-md hover:scale-105 active:scale-100"
                onClick={() => handleStatusFilterClick("overdue")}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">£{overdueAmount.toFixed(2)}</div>
                  <p className="text-xs text-slate-600 mt-1">{overdueInvoices.length} invoices</p>
                  {statusFilter === "overdue" && (
                    <p className="text-xs text-red-600 font-medium mt-2">Currently filtering by Overdue</p>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search by invoice ID, customer, or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={venueFilter} onValueChange={setVenueFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="All Venues" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Venues</SelectItem>
                      <SelectItem value="Powerleague Manchester">Powerleague Manchester</SelectItem>
                      <SelectItem value="Goals Birmingham">Goals Birmingham</SelectItem>
                      <SelectItem value="Premier Sports Complex">Premier Sports Complex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card id="invoices-table">
              <CardHeader>
                <CardTitle>Invoices</CardTitle>
                <CardDescription>
                  Showing {filteredInvoices.length} of {invoices.length} invoices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Venue</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.map((invoice) => (
                      <TableRow
                        key={invoice.id}
                        className="cursor-pointer hover:bg-slate-50"
                        onClick={() => handleViewInvoice(invoice)}
                      >
                        <TableCell className="font-medium">
                          <div>
                            <p className="font-semibold text-slate-800">{invoice.invoiceNumber}</p>
                            <p className="text-xs text-slate-500">{invoice.issueDate}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-slate-800">{invoice.customer.name}</p>
                            <p className="text-xs text-slate-500">{invoice.customer.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-slate-700">{invoice.venue}</p>
                            <p className="text-xs text-slate-500">{invoice.bookings} bookings</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-semibold text-slate-800">£{invoice.amount.toFixed(2)}</p>
                            <p className="text-xs text-slate-500">
                              £{invoice.subtotal.toFixed(2)} + £{invoice.vat.toFixed(2)} VAT
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(invoice)}</TableCell>
                        <TableCell>
                          <p className="font-medium text-slate-700">{invoice.dueDate}</p>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                              }}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleViewInvoice(invoice)
                                  }}
                                >
                                  View Details
                                </DropdownMenuItem>
                                {invoice.status === "draft" && (
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleViewInvoice(invoice)
                                    }}
                                  >
                                    Edit & Send
                                  </DropdownMenuItem>
                                )}
                                {(invoice.status === "pending" || invoice.status === "overdue") && (
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleSendReminder(invoice)
                                    }}
                                  >
                                    Send Reminder
                                  </DropdownMenuItem>
                                )}
                                {invoice.status !== "paid" && invoice.status !== "draft" && (
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleMarkAsPaid(invoice)
                                    }}
                                  >
                                    Mark as Paid
                                  </DropdownMenuItem>
                                )}
                                {invoice.status === "draft" && (
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleDeleteInvoice(invoice)
                                    }}
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <CreateInvoiceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateInvoice}
      />

      <ViewEditInvoiceModal
        isOpen={isViewEditModalOpen}
        onClose={() => {
          setIsViewEditModalOpen(false)
          setSelectedInvoice(null)
        }}
        invoice={selectedInvoice}
        onUpdate={handleUpdateInvoice}
        onSend={handleSendInvoice}
      />
    </div>
  )
}

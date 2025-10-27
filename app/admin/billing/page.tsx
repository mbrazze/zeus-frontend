"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
  CreditCard,
  Download,
  Calendar,
  DollarSign,
  FileText,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from "lucide-react"

export default function BillingPage() {
  const { toast } = useToast()

  const [paymentMethod, setPaymentMethod] = useState({
    type: "Visa",
    last4: "4242",
    expiry: "12/25",
    name: "Sarah Johnson",
  })

  const invoices = [
    {
      id: "INV-2024-001",
      date: "2024-01-15",
      amount: 1250.0,
      status: "paid",
      description: "Monthly subscription - January 2024",
    },
    {
      id: "INV-2023-012",
      date: "2023-12-15",
      amount: 1250.0,
      status: "paid",
      description: "Monthly subscription - December 2023",
    },
    {
      id: "INV-2023-011",
      date: "2023-11-15",
      amount: 1250.0,
      status: "paid",
      description: "Monthly subscription - November 2023",
    },
    {
      id: "INV-2023-010",
      date: "2023-10-15",
      amount: 1250.0,
      status: "paid",
      description: "Monthly subscription - October 2023",
    },
    {
      id: "INV-2023-009",
      date: "2023-09-15",
      amount: 1250.0,
      status: "paid",
      description: "Monthly subscription - September 2023",
    },
  ]

  const handleDownloadInvoice = (invoiceId: string) => {
    toast({
      title: "Downloading invoice",
      description: `Invoice ${invoiceId} is being downloaded...`,
    })
  }

  const handleUpdatePayment = () => {
    toast({
      title: "Payment method",
      description: "Payment method update flow would be implemented here.",
    })
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Billing</h1>
              <p className="text-gray-500 mt-1">Manage your subscription and payment methods</p>
            </div>
            <Badge variant="outline" className="gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Active
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Subscription Overview */}
            <div className="grid grid-cols-3 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Current Plan</p>
                      <p className="text-2xl font-bold mt-1">Professional</p>
                    </div>
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Monthly Cost</p>
                      <p className="text-2xl font-bold mt-1">£1,250</p>
                    </div>
                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Next Billing</p>
                      <p className="text-2xl font-bold mt-1">Feb 15</p>
                    </div>
                    <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Current Plan */}
            <Card>
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>You are currently on the Professional plan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold">Professional</h3>
                      <Badge>Current Plan</Badge>
                    </div>
                    <p className="text-3xl font-bold mt-2">
                      £1,250<span className="text-lg text-gray-500">/month</span>
                    </p>
                    <ul className="mt-4 space-y-2">
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        Unlimited venues
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        Advanced analytics
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        Priority support
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        Custom integrations
                      </li>
                    </ul>
                  </div>
                  <div className="text-right">
                    <Button variant="outline">Change Plan</Button>
                    <p className="text-sm text-gray-500 mt-2">Next billing: Feb 15, 2024</p>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-900">Plan renewal in 30 days</p>
                    <p className="text-sm text-amber-700 mt-1">
                      Your subscription will automatically renew on February 15, 2024 for £1,250.00
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
                <CardDescription>Manage your payment information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {paymentMethod.type} •••• {paymentMethod.last4}
                      </p>
                      <p className="text-sm text-gray-500">Expires {paymentMethod.expiry}</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={handleUpdatePayment}>
                    Update
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <Label>Cardholder Name</Label>
                    <Input value={paymentMethod.name} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Billing Email</Label>
                    <Input value="sarah.johnson@zeus.com" disabled />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Billing History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Billing History
                </CardTitle>
                <CardDescription>View and download your past invoices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoices.map((invoice) => (
                    <div key={invoice.id}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{invoice.id}</p>
                              <Badge variant="secondary" className="bg-green-100 text-green-700">
                                {invoice.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500">{invoice.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-medium">£{invoice.amount.toFixed(2)}</p>
                            <p className="text-sm text-gray-500">{invoice.date}</p>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => handleDownloadInvoice(invoice.id)}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {invoices.indexOf(invoice) < invoices.length - 1 && <Separator className="my-4" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Usage & Limits */}
            <Card>
              <CardHeader>
                <CardTitle>Usage & Limits</CardTitle>
                <CardDescription>Current usage for this billing period</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Bookings</span>
                    <span className="font-medium">1,245 / Unlimited</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: "45%" }} />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>API Calls</span>
                    <span className="font-medium">45,672 / Unlimited</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-600 rounded-full" style={{ width: "35%" }} />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Storage</span>
                    <span className="font-medium">12.4 GB / 100 GB</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600 rounded-full" style={{ width: "12%" }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

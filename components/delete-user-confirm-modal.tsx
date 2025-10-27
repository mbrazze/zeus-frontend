"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Trash2, Shield } from "lucide-react"

interface DeleteUserConfirmModalProps {
  user: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirmDelete: () => void
  daysSinceDisabled: number
}

export function DeleteUserConfirmModal({
  user,
  open,
  onOpenChange,
  onConfirmDelete,
  daysSinceDisabled,
}: DeleteUserConfirmModalProps) {
  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Permanently Delete User
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. The user will be permanently removed from the system.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* User Info */}
          <div className="bg-slate-50 p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-medium text-slate-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-sm text-slate-600">{user.email}</p>
              </div>
              <Badge className="bg-purple-100 text-purple-800 border-purple-200 border">
                {user.role.toUpperCase()}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-slate-600">Status:</span>
                <span className="ml-2 font-medium text-red-600">Inactive</span>
              </div>
              <div>
                <span className="text-slate-600">Disabled:</span>
                <span className="ml-2 font-medium">{daysSinceDisabled} days ago</span>
              </div>
            </div>
          </div>

          {/* Warning Alert */}
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Warning:</strong> This user has been inactive for {daysSinceDisabled} days (over 90 days). You can
              now permanently delete their account.
            </AlertDescription>
          </Alert>

          {/* What Happens */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-900">What happens when you delete this user:</p>
            <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
              <li>User will be permanently removed from the active user list</li>
              <li>They will no longer be able to access the system</li>
              <li>Their bookings and activity history will remain in the system</li>
              <li>User name and role will be retained in audit logs for compliance</li>
            </ul>
          </div>

          {/* Data Retention Notice */}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Data Retention:</strong> For reporting and audit purposes, this user's name, role, and associated
              actions will remain visible in system logs and historical records.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirmDelete()
              onOpenChange(false)
            }}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete User Permanently
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

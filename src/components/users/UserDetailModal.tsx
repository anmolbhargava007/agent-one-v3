
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface UserDetailModalProps {
  user: {
    name: string;
    email: string;
    role: string;
    avatar?: string;
    status?: string;
    lastActive?: string;
  } | null;
  open: boolean;
  onClose: () => void;
}

export default function UserDetailModal({ user, open, onClose }: UserDetailModalProps) {
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState<any>(null);
  const { toast } = useToast();

  // Initialize edited user when the modal opens with a user
  useEffect(() => {
    if (user) {
      setEditedUser({...user});
    }
  }, [user]);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    if (user) {
      setEditedUser({...user});
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedUser({...editedUser, [e.target.name]: e.target.value});
  };

  const handleRoleChange = (value: string) => {
    setEditedUser({...editedUser, role: value});
  };

  const handleStatusChange = (value: string) => {
    setEditedUser({...editedUser, status: value});
  };

  const handleSave = () => {
    toast({
      title: "User Updated",
      description: "User information has been updated successfully.",
    });
    setEditMode(false);
  };

  if (!user || !editedUser) return null;
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        <div className="flex gap-4 items-center">
          {user.avatar && (
            <img src={user.avatar} className="w-16 h-16 rounded-full object-cover" alt="User avatar"/>
          )}
          <div>
            <h3 className="font-semibold">{user.name}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <span className="text-xs inline-block mt-1 px-2 py-1 bg-accent rounded">{user.role}</span>
          </div>
        </div>
        
        {!editMode ? (
          <div className="mt-4 space-y-4">
            {user.status && (
              <div>
                <Label>Status: </Label>
                <span className={`ml-2 font-medium ${user.status === "active" ? "text-green-600" : "text-red-600"}`}>
                  {user.status}
                </span>
              </div>
            )}
            {user.lastActive && (
              <div>
                <Label>Last Active: </Label>
                <span className="ml-2">{new Date(user.lastActive).toLocaleString()}</span>
              </div>
            )}
            <div>
              <Label>Role: </Label>
              <span className="ml-2">{user.role}</span>
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                name="name"
                value={editedUser.name}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email"
                value={editedUser.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={editedUser.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="User">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {editedUser.status && (
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={editedUser.status} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}
        
        <DialogFooter>
          {!editMode ? (
            <>
              <Button variant="outline" onClick={onClose}>Close</Button>
              <Button onClick={handleEdit}>Edit User</Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleCancel}>Cancel</Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

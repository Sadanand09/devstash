"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { UserAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { iconMap } from "@/lib/icon-map";
import {
  ArrowLeft,
  Calendar,
  Mail,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  Github,
  KeyRound,
  Trash2,
  Package,
  FolderOpen,
} from "lucide-react";

type ProfileUser = {
  name: string | null;
  email: string | null;
  image: string | null;
  createdAt: string;
  hasPassword: boolean;
  isOAuthUser: boolean;
};

type ProfileStats = {
  totalItems: number;
  totalCollections: number;
  itemTypeBreakdown: {
    name: string;
    icon: string;
    color: string;
    count: number;
  }[];
};

export function ProfileClient({
  user,
  stats,
}: {
  user: ProfileUser;
  stats: ProfileStats;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <h1 className="mb-6 text-2xl font-bold">Profile</h1>

        <div className="space-y-6">
          <UserInfoCard user={user} />
          <StatsCard stats={stats} />
          {user.hasPassword && <ChangePasswordCard />}
          <DeleteAccountCard user={user} />
        </div>
      </div>
    </div>
  );
}

function UserInfoCard({ user }: { user: ProfileUser }) {
  const createdDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <UserAvatar name={user.name} image={user.image} size="lg" />
          <div>
            <p className="text-lg font-medium">{user.name || "No name set"}</p>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              {user.isOAuthUser ? (
                <Github className="h-3.5 w-3.5" />
              ) : (
                <KeyRound className="h-3.5 w-3.5" />
              )}
              {user.isOAuthUser ? "GitHub" : "Email & Password"}
            </div>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            {user.email}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Joined {createdDate}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatsCard({ stats }: { stats: ProfileStats }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 rounded-lg border p-3">
            <Package className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-2xl font-bold">{stats.totalItems}</p>
              <p className="text-xs text-muted-foreground">Total Items</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border p-3">
            <FolderOpen className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-2xl font-bold">{stats.totalCollections}</p>
              <p className="text-xs text-muted-foreground">Collections</p>
            </div>
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-muted-foreground">
            Items by Type
          </p>
          <div className="space-y-1.5">
            {stats.itemTypeBreakdown.map((type) => {
              const Icon = iconMap[type.icon];
              return (
                <div
                  key={type.name}
                  className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm"
                >
                  <div className="flex items-center gap-2">
                    {Icon && (
                      <span style={{ color: type.color }}>
                        <Icon className="h-4 w-4" />
                      </span>
                    )}
                    <span>{type.name}</span>
                  </div>
                  <span className="font-medium text-muted-foreground">
                    {type.count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ChangePasswordCard() {
  const [showForm, setShowForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setSuccess("Password changed successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowForm(false);
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          Update your password for email sign-in
        </CardDescription>
      </CardHeader>
      <CardContent>
        {success && <p className="mb-3 text-sm text-green-500">{success}</p>}
        {!showForm ? (
          <Button
            variant="outline"
            onClick={() => {
              setShowForm(true);
              setSuccess("");
            }}
          >
            <KeyRound className="mr-2 h-4 w-4" />
            Change Password
          </Button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="space-y-1.5">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
              <Input
                id="confirmNewPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Changing..." : "Change Password"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowForm(false);
                  setError("");
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

function DeleteAccountCard({ user }: { user: ProfileUser }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState("");

  const expectedValue = user.name || user.email || "DELETE";
  const isConfirmed = confirmation === expectedValue;

  async function handleDelete() {
    if (!isConfirmed) return;
    setLoading(true);

    try {
      const res = await fetch("/api/auth/delete-account", {
        method: "DELETE",
      });

      if (res.ok) {
        await signOut({ redirect: false });
        router.push("/");
      }
    } catch {
      setLoading(false);
    }
  }

  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="text-destructive">Danger Zone</CardTitle>
        <CardDescription>
          Permanently delete your account and all associated data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog
          onOpenChange={(open) => {
            if (!open) setConfirmation("");
          }}
        >
          <AlertDialogTrigger
            render={<Button variant="destructive" />}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Account
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account, all your items, collections, and tags.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-1.5 px-0">
              <Label htmlFor="deleteConfirmation">
                Type <span className="font-semibold">{expectedValue}</span> to
                confirm
              </Label>
              <Input
                id="deleteConfirmation"
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                placeholder={expectedValue}
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={loading || !isConfirmed}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {loading ? "Deleting..." : "Yes, delete my account"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/auth-context"
import LoadingSpinner from "@/components/loading-spinner"
import { Edit, Key, LogOut, User } from "lucide-react"
import { changePassword } from "@/services/auth"
import { toast } from "sonner"

export default function ProfilePage() {
  const { user, isLoading, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, router])

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="flex-1 p-6 md:p-8 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 bg-gradient-to-b from-zinc-950 to-black">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
          My Profile
        </h1>
        <p className="text-zinc-400">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-lg p-6 flex flex-col items-center">
            <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-red-500 mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-zinc-800/20"></div>
              <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
            </div>
            <h2 className="text-xl font-bold mb-1">{user?.username}</h2>
            <p className="text-sm text-zinc-400 mb-4">{user?.email}</p>

            <div className="w-full bg-zinc-800/50 rounded-lg p-3 mb-4 text-center">
              <div className="text-xs text-zinc-400">Balance</div>
              <div className="text-xl font-bold text-red-500">{user?.balance || "0"} coins</div>
            </div>

            <Button
              variant="outline"
              className="w-full bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-700 text-zinc-400"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" /> Sign Out
            </Button>
          </div>
        </div>

        <div className="md:col-span-3">
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="mb-6 bg-zinc-900/50 p-1">
              <TabsTrigger value="account" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                <User className="h-4 w-4 mr-2" /> Account
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                <Key className="h-4 w-4 mr-2" /> Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="account" className="space-y-6 mt-0">
              <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-lg p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-medium">Personal Information</h3>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-400">Username</label>
                      <Input
                        value={user?.username}
                        readOnly
                        className="bg-zinc-800/50 border-zinc-700/50 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-400">Email</label>
                      <Input
                        value={user?.email}
                        readOnly
                        className="bg-zinc-800/50 border-zinc-700/50 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-lg p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-medium">Preferences</h3>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-400">Odds Format</label>
                      <Input
                        value="Decimal"
                        readOnly
                        className="bg-zinc-800/50 border-zinc-700/50 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-400">Time Zone</label>
                      <Input
                        value="GMT+0"
                        readOnly
                        className="bg-zinc-800/50 border-zinc-700/50 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-6 mt-0">
              <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Change Password</h3>
                </div>

                <form onSubmit={async (e) => {
                  e.preventDefault();
                  setIsChangingPassword(true);
                  try {
                    const formData = new FormData(e.currentTarget);
                    const currentPassword = formData.get('currentPassword') as string;
                    const newPassword = formData.get('newPassword') as string;
                    const confirmPassword = formData.get('confirmPassword') as string;

                    if (newPassword !== confirmPassword) {
                      toast.error("New passwords don't match");
                      return;
                    }

                    const result = await changePassword(currentPassword, newPassword);
                    if (result.success) {
                      toast.success("Password changed successfully");
                      (e.target as HTMLFormElement).reset();
                    } else {
                      toast.error(result.error || "Failed to change password");
                    }
                  } catch (error) {
                    toast.error("An unexpected error occurred");
                    console.error("Password change error:", error);
                  } finally {
                    setIsChangingPassword(false);
                  }
                }} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Current Password</label>
                    <Input
                      type="password"
                      name="currentPassword"
                      placeholder="••••••••"
                      required
                      disabled={isChangingPassword}
                      className="bg-zinc-800/50 border-zinc-700/50 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">New Password</label>
                    <Input
                      type="password"
                      name="newPassword"
                      placeholder="••••••••"
                      required
                      minLength={6}
                      disabled={isChangingPassword}
                      className="bg-zinc-800/50 border-zinc-700/50 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Confirm New Password</label>
                    <Input
                      type="password"
                      name="confirmPassword"
                      placeholder="••••••••"
                      required
                      minLength={6}
                      disabled={isChangingPassword}
                      className="bg-zinc-800/50 border-zinc-700/50 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="default"
                    disabled={isChangingPassword}
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white mt-2"
                  >
                    {isChangingPassword ? (
                      <>
                        <span className="w-4 h-4 mr-2">
                          <LoadingSpinner />
                        </span>
                        Updating Password...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </form>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}


"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/hooks/useAuth"
import { getInitials } from "@/lib/utils"
import { updateUserPassword, updateUserProfile } from "@/services/user/user.service"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CalendarDays, KeyRound, Mail, Pencil, Phone, ShieldCheck, User, X } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const SUPER_ADMIN_ROLE = "superAdmin"

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function UserProfile() {
  const { user, isLoading } = useAuth()
  const queryClient = useQueryClient()

  const [isEditing, setIsEditing] = useState(false)
  const [profileForm, setProfileForm] = useState({ name: "", phone: "", avatar: "" })
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" })

  const isSuperAdmin = user?.role === SUPER_ADMIN_ROLE
  const requiresPasswordChange = user?.mustChangePassword === true

  useEffect(() => {
    if (user) {
      setProfileForm({ name: user.name, phone: user.phone ?? "", avatar: user.avatar ?? "" })
    }
  }, [user])

  const handleCancelEdit = () => {
    if (user) setProfileForm({ name: user.name, phone: user.phone ?? "", avatar: user.avatar ?? "" })
    setIsEditing(false)
  }

  const profileMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      toast.success("Perfil actualizado correctamente")
      queryClient.invalidateQueries({ queryKey: ["userProfile"] })
      setIsEditing(false)
    },
    onError: () => toast.error("No se pudo actualizar el perfil"),
  })

  const passwordMutation = useMutation({
    mutationFn: updateUserPassword,
    onSuccess: () => {
      toast.success("Contraseña actualizada correctamente")
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
    },
    onError: () => toast.error("Contraseña actual incorrecta o error del servidor"),
  })

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload: { name?: string; phone?: string; avatar?: string } = {
      phone: profileForm.phone,
      avatar: profileForm.avatar,
    }
    // solo superAdmin puede cambiar el nombre
    if (isSuperAdmin) payload.name = profileForm.name
    profileMutation.mutate(payload)
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Las contraseñas no coinciden")
      return
    }
    passwordMutation.mutate({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    })
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        No se pudo cargar el perfil.
      </div>
    )
  }

  const initials = getInitials(user.name)

  return (
    <div className="space-y-6 w-full">
      <div>
        <p className="text-muted-foreground text-sm">Información de tu cuenta de administrador.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Columna izquierda: identidad de solo lectura */}
        <Card className="bg-muted/60 md:col-span-1">
          <CardContent className="flex flex-col items-center gap-4 pt-8 pb-6">
            <Avatar className="h-24 w-24 ring-2 ring-primary/20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-2xl font-semibold">{initials}</AvatarFallback>
            </Avatar>
            <div className="text-center space-y-1">
              <p className="text-lg font-semibold">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <Badge variant="secondary" className="capitalize gap-1">
              <ShieldCheck className="h-3 w-3" />
              {user.role}
            </Badge>
            <Separator className="w-full" />
            <div className="w-full space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                <span>{formatDate(user.createdAt)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Columna derecha: formularios */}
        <div className="md:col-span-2 space-y-6">
          {requiresPasswordChange && (
            <Card className="border-amber-400/50 bg-amber-500/10">
              <CardContent className="py-4">
                <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
                  Debes cambiar tu contraseña antes de continuar.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Editar datos del perfil */}
          <Card className="bg-muted/60">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                Datos del perfil
              </CardTitle>
              {!isEditing ? (
                <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                  <Pencil className="h-3.5 w-3.5 mr-1.5" />
                  Editar perfil
                </Button>
              ) : (
                <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                  <X className="h-3.5 w-3.5 mr-1.5" />
                  Cancelar
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" /> Nombre completo
                      {!isSuperAdmin && (
                        <span className="text-xs text-muted-foreground ml-1">(solo superAdmin)</span>
                      )}
                    </Label>
                    <Input
                      id="name"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
                      // solo superAdmin puede editar el nombre
                      disabled={!isEditing || !isSuperAdmin}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" /> Correo electrónico
                      <span className="text-xs text-muted-foreground ml-1">(solo lectura)</span>
                    </Label>
                    <Input id="email" value={user.email} disabled />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" /> Teléfono
                    </Label>
                    <Input
                      id="phone"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="avatar">URL de avatar</Label>
                    <Input
                      id="avatar"
                      placeholder="https://..."
                      value={profileForm.avatar}
                      onChange={(e) => setProfileForm((p) => ({ ...p, avatar: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                {isEditing && (
                  <div className="flex justify-end">
                    <Button type="submit" disabled={profileMutation.isPending}>
                      {profileMutation.isPending ? "Guardando..." : "Guardar cambios"}
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Cambiar contraseña */}
          <Card className="bg-muted/60">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <KeyRound className="h-4 w-4" />
                Cambiar contraseña
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="currentPassword">Contraseña actual</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))}
                    required
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="newPassword">Nueva contraseña</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" variant="outline" disabled={passwordMutation.isPending}>
                    {passwordMutation.isPending ? "Actualizando..." : "Actualizar contraseña"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


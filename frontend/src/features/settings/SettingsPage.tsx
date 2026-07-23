import { type FormEvent, useEffect, useState } from "react"

import { Button } from "@/components/retroui/Button"
import { Card } from "@/components/retroui/Card"
import { Input } from "@/components/ui/Input"
import { Loader } from "@/components/ui/Loader"
import { SectionIntro } from "@/features/shared/SectionIntro"
import { useAsyncData } from "@/hooks/useAsyncData"
import { fetchUserProfile, updatePassword, updateUsername } from "@/lib/api"

type Notice = { type: "success" | "error"; text: string } | null

export function SettingsPage() {
  const { data: profile, loading } = useAsyncData(() => fetchUserProfile(), [])

  const [username, setUsername] = useState("")
  const [usernameNotice, setUsernameNotice] = useState<Notice>(null)
  const [savingUsername, setSavingUsername] = useState(false)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordNotice, setPasswordNotice] = useState<Notice>(null)
  const [savingPassword, setSavingPassword] = useState(false)

  useEffect(() => {
    if (profile) {
      setUsername(profile.username)
    }
  }, [profile])

  async function handleUsernameSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setUsernameNotice(null)
    setSavingUsername(true)
    try {
      await updateUsername(username.trim())
      setUsernameNotice({ type: "success", text: "Nom d'utilisateur mis à jour." })
    } catch (error) {
      setUsernameNotice({
        type: "error",
        text: error instanceof Error ? error.message : "Échec de la mise à jour.",
      })
    } finally {
      setSavingUsername(false)
    }
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPasswordNotice(null)

    if (newPassword !== confirmPassword) {
      setPasswordNotice({ type: "error", text: "Les nouveaux mots de passe ne correspondent pas." })
      return
    }

    setSavingPassword(true)
    try {
      await updatePassword(currentPassword, newPassword)
      setPasswordNotice({ type: "success", text: "Mot de passe mis à jour." })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      setPasswordNotice({
        type: "error",
        text: error instanceof Error ? error.message : "Échec de la mise à jour.",
      })
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 sm:space-y-8">
      <SectionIntro
        eyebrow="Compte"
        title="Paramètres"
        description="Modifie ton nom d'utilisateur et ton mot de passe."
      />

      {loading ? (
        <div className="flex min-h-40 items-center justify-center">
          <Loader />
        </div>
      ) : (
        <>
          <Card className="w-full border-black bg-white shadow-[12px_12px_0_0_#000]">
            <Card.Header className="border-b-2 border-black">
              <Card.Title className="text-black">Nom d'utilisateur</Card.Title>
              <Card.Description>Il apparaît dans le classement et sur ton profil.</Card.Description>
            </Card.Header>
            <Card.Content className="p-5 sm:p-6">
              <form className="space-y-4" onSubmit={handleUsernameSubmit}>
                <label className="grid gap-2 text-black">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-black/60">
                    Nom d'utilisateur
                  </span>
                  <Input
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    minLength={3}
                    maxLength={20}
                    required
                  />
                </label>
                <Notice notice={usernameNotice} />
                <Button
                  size="lg"
                  disabled={savingUsername || username.trim() === profile?.username}
                >
                  {savingUsername ? "Enregistrement…" : "Mettre à jour"}
                </Button>
              </form>
            </Card.Content>
          </Card>

          <Card className="w-full border-black bg-white shadow-[12px_12px_0_0_#000]">
            <Card.Header className="border-b-2 border-black">
              <Card.Title className="text-black">Mot de passe</Card.Title>
              <Card.Description>Saisis ton mot de passe actuel pour le changer.</Card.Description>
            </Card.Header>
            <Card.Content className="p-5 sm:p-6">
              <form className="space-y-4" onSubmit={handlePasswordSubmit}>
                <label className="grid gap-2 text-black">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-black/60">
                    Mot de passe actuel
                  </span>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    required
                  />
                </label>
                <label className="grid gap-2 text-black">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-black/60">
                    Nouveau mot de passe
                  </span>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    minLength={6}
                    required
                  />
                </label>
                <label className="grid gap-2 text-black">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-black/60">
                    Confirmer le nouveau mot de passe
                  </span>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    minLength={6}
                    required
                  />
                </label>
                <Notice notice={passwordNotice} />
                <Button size="lg" disabled={savingPassword}>
                  {savingPassword ? "Enregistrement…" : "Changer le mot de passe"}
                </Button>
              </form>
            </Card.Content>
          </Card>
        </>
      )}
    </div>
  )
}

function Notice({ notice }: { notice: Notice }) {
  if (!notice) {
    return null
  }
  return (
    <div
      className={`border-2 border-black px-4 py-3 text-sm font-bold shadow-[4px_4px_0_0_#000] ${
        notice.type === "success" ? "bg-[#68f2a3] text-black" : "bg-[#ff7a59] text-black"
      }`}
    >
      {notice.text}
    </div>
  )
}

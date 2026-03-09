import { type ChangeEvent, type FormEvent, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { Button } from "@/components/retroui/Button"
import { Card } from "@/components/retroui/Card"
import { Badge } from "@/components/ui/Badge"
import { Input } from "@/components/ui/Input"
import { login, register } from "@/lib/api"

interface AuthPageProps {
  mode: "login" | "register"
}

export function AuthPage({ mode }: AuthPageProps) {
  const isRegister = mode === "register"
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    if (isRegister && password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.")
      return
    }

    setSubmitting(true)
    try {
      if (isRegister) {
        await register({ username: username.trim(), email: email.trim(), password })
      } else {
        await login({ username: username.trim(), password })
      }
      navigate("/play")
    } catch {
      setError(isRegister ? "Impossible de créer le compte avec ces informations." : "Identifiant ou mot de passe invalide.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="grid min-h-[75vh] gap-6 lg:grid-cols-[1fr_0.9fr]">
      <Card className="border-black bg-[#ffe45e] shadow-[8px_8px_0_0_#000] sm:shadow-[12px_12px_0_0_#000]">
        <Card.Content className="flex h-full flex-col justify-between gap-8 p-5 text-black sm:p-8">
          <div className="space-y-5">
            <Badge tone="dark">Accès Word Clash</Badge>
            <h1 className="font-head text-4xl uppercase leading-[0.9] tracking-[0.08em] sm:text-6xl sm:tracking-[0.12em]">
              {isRegister ? "Crée ton pseudo" : "Reprends le sprint"}
            </h1>
            <p className="max-w-lg text-base leading-7 text-black/75">
              Connecte-toi pour jouer, suivre tes stats et accéder à ton profil.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {["Catégories quotidiennes", "Historique du classement", "Suivi de progression"].map((item) => (
              <div
                key={item}
                className="border-2 border-black bg-white p-4 text-sm font-black uppercase tracking-[0.16em] shadow-[4px_4px_0_0_#000]"
              >
                {item}
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>

      <Card className="border-black bg-white shadow-[8px_8px_0_0_#000] sm:shadow-[12px_12px_0_0_#000]">
        <Card.Content className="space-y-6 p-5 sm:p-8">
          <div className="space-y-2 text-black">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-black/60">
              {isRegister ? "Créer un compte" : "Bon retour"}
            </div>
            <div className="font-head text-3xl uppercase sm:text-4xl">
              {isRegister ? "Inscription" : "Connexion"}
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <Field
              label="Nom d'utilisateur"
              placeholder="ArcadeAsh"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
            {isRegister && (
              <Field
                label="Email"
                placeholder="player@listle.dev"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            )}
            <Field
              label="Mot de passe"
              placeholder="••••••••••••"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            {isRegister && (
              <Field
                label="Confirmer le mot de passe"
                placeholder="••••••••••••"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            )}
            {error && <div className="text-sm font-bold text-[#b42318]">{error}</div>}
            <Button size="lg" className="w-full" disabled={submitting}>
              {isRegister ? "Créer un compte" : "Se connecter"}
            </Button>
          </form>

          <div className="text-sm text-black/70">
            {isRegister ? "Tu as déjà un compte ? " : "Tu n'as pas de compte ? "}
            <Link
              to={isRegister ? "/login" : "/register"}
              className="font-black uppercase tracking-[0.12em] text-black underline decoration-2 underline-offset-4"
            >
              {isRegister ? "Connexion" : "Inscription"}
            </Link>
          </div>
        </Card.Content>
      </Card>
    </div>
  )
}

function Field({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}: {
  label: string
  placeholder: string
  type?: string
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <label className="grid gap-2 text-black">
      <span className="text-xs font-black uppercase tracking-[0.2em] text-black/60">
        {label}
      </span>
      <Input type={type} placeholder={placeholder} value={value} onChange={onChange} required />
    </label>
  )
}

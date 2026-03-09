import { Link } from "react-router-dom"

import { Button } from "@/components/retroui/Button"
import { Card } from "@/components/retroui/Card"
import { Badge } from "@/components/ui/Badge"
import { Input } from "@/components/ui/Input"

interface AuthPageProps {
  mode: "login" | "register"
}

export function AuthPage({ mode }: AuthPageProps) {
  const isRegister = mode === "register"

  return (
    <div className="grid min-h-[75vh] gap-6 lg:grid-cols-[1fr_0.9fr]">
      <Card className="border-black bg-[#ffe45e] shadow-[12px_12px_0_0_#000]">
        <Card.Content className="flex h-full flex-col justify-between gap-8 p-8 text-black">
          <div className="space-y-5">
            <Badge tone="dark">Listle Access</Badge>
            <h1 className="font-head text-6xl uppercase leading-[0.9] tracking-[0.12em]">
              {isRegister ? "Claim your arcade tag" : "Log back into the sprint"}
            </h1>
            <p className="max-w-lg text-base leading-7 text-black/75">
              Authentication is still frontend-only, but these screens already match the game
              brand and future account flow.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              "Daily categories",
              "Ranking history",
              "Progress tracking",
            ].map((item) => (
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

      <Card className="border-black bg-white shadow-[12px_12px_0_0_#000]">
        <Card.Content className="space-y-6 p-8">
          <div className="space-y-2 text-black">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-black/60">
              {isRegister ? "Create account" : "Welcome back"}
            </div>
            <div className="font-head text-4xl uppercase">
              {isRegister ? "Register" : "Log in"}
            </div>
          </div>

          <form className="space-y-4">
            {isRegister && <Field label="Username" placeholder="ArcadeAsh" />}
            <Field label="Email" placeholder="player@listle.dev" />
            <Field label="Password" placeholder="••••••••••••" type="password" />
            {isRegister && <Field label="Confirm password" placeholder="••••••••••••" type="password" />}
            <Button size="lg" className="w-full">
              {isRegister ? "Create demo account" : "Enter demo lobby"}
            </Button>
          </form>

          <div className="text-sm text-black/70">
            {isRegister ? "Already have an account? " : "Need an account? "}
            <Link
              to={isRegister ? "/login" : "/register"}
              className="font-black uppercase tracking-[0.12em] text-black underline decoration-2 underline-offset-4"
            >
              {isRegister ? "Log in" : "Register"}
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
}: {
  label: string
  placeholder: string
  type?: string
}) {
  return (
    <label className="grid gap-2 text-black">
      <span className="text-xs font-black uppercase tracking-[0.2em] text-black/60">
        {label}
      </span>
      <Input type={type} placeholder={placeholder} />
    </label>
  )
}

"use client"

import { useState } from "react"
import { toast } from "sonner"
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@workspace/ui/components/tabs"
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@workspace/ui/components/input-otp"
import { IconMusic, IconArrowLeft, IconCheck, IconPhone, IconShieldCheck } from "@tabler/icons-react"

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24">
      <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

const API_BASE = "/api/zeno"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [tab, setTab] = useState("login")

  const [phone, setPhone] = useState("")

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 9)
    setPhone(digits)
  }

  const fullPhone = `255${phone}`
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: fullPhone }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        const msg = data.message || data.error || data.errors?.[0]?.msg || `Failed to send OTP (${res.status})`
        throw new Error(msg)
      }

      setStep("otp")
      toast.success("OTP sent", { description: `Code sent to +${fullPhone}` })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: fullPhone, code: otp }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        const msg = data.message || data.error || data.errors?.[0]?.msg || `Verification failed (${res.status})`
        throw new Error(msg)
      }

      if (!data.token) {
        throw new Error("No token received from server")
      }

      // Step 2: Sign in with Firebase custom token
      const firebaseRes = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=AIzaSyAXuU0KS8JHgenZN2xtNF9ELOjO_jnl86k`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: data.token, returnSecureToken: true }),
        }
      )

      const firebaseData = await firebaseRes.json().catch(() => ({}))

      if (!firebaseRes.ok) {
        throw new Error(firebaseData.error?.message || "Firebase auth failed")
      }

      const idToken = firebaseData.idToken

      // Step 3: Sync signin with backend
      const syncRes = await fetch(`${API_BASE}/auth/signin-sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({}),
      })

      const syncData = await syncRes.json().catch(() => ({}))

      // Store tokens
      localStorage.setItem("zeno_token", idToken)
      localStorage.setItem("zeno_refresh_token", firebaseData.refreshToken || "")
      localStorage.setItem("zeno_user_id", firebaseData.localId || "")

      // Store user profile data from signin-sync
      if (syncData.username || syncData.userId || syncData.id) {
        localStorage.setItem("zeno_username", syncData.username || syncData.userId || syncData.id || "")
      }
      if (syncData.credits !== undefined) {
        localStorage.setItem("zeno_credits", String(syncData.credits))
      }
      if (syncData.displayName || syncData.name) {
        localStorage.setItem("zeno_display_name", syncData.displayName || syncData.name || "")
      }
      if (syncData.photoURL || syncData.avatar) {
        localStorage.setItem("zeno_avatar", syncData.photoURL || syncData.avatar || "")
      }

      setSuccess(true)
      toast.success("Welcome to ZenoMusic!", { description: "Redirecting to dashboard..." })
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  function resetFlow() {
    setStep("phone")
    setPhone("")
    setOtp("")
    setError("")
    setSuccess(false)
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {/* Logo */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <IconMusic className="h-7 w-7 text-primary" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">ZenoMusic</h1>
          <p className="text-sm text-muted-foreground">Turn your words into original songs</p>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Sign in</TabsTrigger>
          <TabsTrigger value="register">Sign up</TabsTrigger>
        </TabsList>

        {/* Login Tab - Phone OTP */}
        <TabsContent value="login">
          <FieldGroup>
            {success ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <IconCheck className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Welcome back!</h2>
                <p className="max-w-xs text-sm text-muted-foreground">
                  Login successful. Redirecting to your studio...
                </p>
              </div>
            ) : step === "phone" ? (
              <form className="flex flex-col gap-4" onSubmit={handleSendOtp}>
                <div className="flex flex-col items-center gap-1 text-center">
                  <h2 className="text-xl font-semibold">Welcome back</h2>
                  <p className="text-sm text-muted-foreground">
                    Enter your phone number to receive a code
                  </p>
                </div>

                {error && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <Field>
                  <FieldLabel htmlFor="login-phone">Phone number</FieldLabel>
                  <div className="flex items-center rounded-md border border-input bg-transparent shadow-xs focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]">
                    <span className="flex items-center gap-1.5 border-r border-input px-3 py-2 text-sm font-medium text-muted-foreground">
                      <IconPhone className="h-4 w-4" />
                      +255
                    </span>
                    <input
                      id="login-phone"
                      type="tel"
                      inputMode="numeric"
                      placeholder="712 345 678"
                      required
                      value={phone}
                      onChange={handlePhoneChange}
                      className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground/60"
                    />
                  </div>
                </Field>

                <Field>
                  <Button type="submit" className="w-full" disabled={loading || phone.length < 9}>
                    {loading ? "Sending code..." : "Send code"}
                  </Button>
                </Field>

                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" type="button" className="w-full">
                    <GoogleIcon />
                    Google
                  </Button>
                  <Button variant="outline" type="button" className="w-full">
                    <FacebookIcon />
                    Facebook
                  </Button>
                </div>

                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <button type="button" onClick={() => setTab("register")} className="font-medium text-foreground underline underline-offset-4">
                    Sign up
                  </button>
                </FieldDescription>
              </form>
            ) : (
              <form className="flex flex-col gap-4" onSubmit={handleVerifyOtp}>
                <button
                  type="button"
                  onClick={resetFlow}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  <IconArrowLeft className="h-4 w-4" />
                  Change number
                </button>

                <div className="flex flex-col items-center gap-1 text-center">
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <IconShieldCheck className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">Enter verification code</h2>
                  <p className="text-sm text-muted-foreground">
                    We sent a code to <span className="font-medium text-foreground">{fullPhone}</span>
                  </p>
                </div>

                {error && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <Field>
                  <FieldLabel htmlFor="login-otp">Verification code</FieldLabel>
                  <div className="flex justify-center">
                    <InputOTP
                      id="login-otp"
                      maxLength={6}
                      value={otp}
                      onChange={(v) => setOtp(v)}
                      containerClassName="justify-center"
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className="size-10 text-sm" />
                        <InputOTPSlot index={1} className="size-10 text-sm" />
                        <InputOTPSlot index={2} className="size-10 text-sm" />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} className="size-10 text-sm" />
                        <InputOTPSlot index={4} className="size-10 text-sm" />
                        <InputOTPSlot index={5} className="size-10 text-sm" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </Field>

                <Field>
                  <Button type="submit" className="w-full" disabled={loading || otp.length < 6}>
                    {loading ? "Verifying..." : "Verify & sign in"}
                  </Button>
                </Field>

                <FieldDescription className="text-center">
                  Didn&apos;t receive the code?{" "}
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="font-medium text-foreground underline underline-offset-4"
                  >
                    Resend
                  </button>
                </FieldDescription>
              </form>
            )}
          </FieldGroup>
        </TabsContent>

        {/* Register Tab - Phone OTP */}
        <TabsContent value="register">
          <FieldGroup>
            {success ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <IconCheck className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Account created!</h2>
                <p className="max-w-xs text-sm text-muted-foreground">
                  Welcome to ZenoMusic. Redirecting to your studio...
                </p>
              </div>
            ) : step === "phone" ? (
              <form className="flex flex-col gap-4" onSubmit={handleSendOtp}>
                <div className="flex flex-col items-center gap-1 text-center">
                  <h2 className="text-xl font-semibold">Create your account</h2>
                  <p className="text-sm text-muted-foreground">
                    Enter your phone number to get started
                  </p>
                </div>

                {error && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <Field>
                  <FieldLabel htmlFor="register-phone">Phone number</FieldLabel>
                  <div className="flex items-center rounded-md border border-input bg-transparent shadow-xs focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]">
                    <span className="flex items-center gap-1.5 border-r border-input px-3 py-2 text-sm font-medium text-muted-foreground">
                      <IconPhone className="h-4 w-4" />
                      +255
                    </span>
                    <input
                      id="register-phone"
                      type="tel"
                      inputMode="numeric"
                      placeholder="712 345 678"
                      required
                      value={phone}
                      onChange={handlePhoneChange}
                      className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground/60"
                    />
                  </div>
                </Field>

                <Field>
                  <Button type="submit" className="w-full" disabled={loading || phone.length < 9}>
                    {loading ? "Sending code..." : "Send code"}
                  </Button>
                </Field>

                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" type="button" className="w-full">
                    <GoogleIcon />
                    Google
                  </Button>
                  <Button variant="outline" type="button" className="w-full">
                    <FacebookIcon />
                    Facebook
                  </Button>
                </div>

                <FieldDescription className="text-center">
                  Already have an account?{" "}
                  <button type="button" onClick={() => setTab("login")} className="font-medium text-foreground underline underline-offset-4">
                    Sign in
                  </button>
                </FieldDescription>
              </form>
            ) : (
              <form className="flex flex-col gap-4" onSubmit={handleVerifyOtp}>
                <button
                  type="button"
                  onClick={resetFlow}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  <IconArrowLeft className="h-4 w-4" />
                  Change number
                </button>

                <div className="flex flex-col items-center gap-1 text-center">
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <IconShieldCheck className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">Verify your number</h2>
                  <p className="text-sm text-muted-foreground">
                    We sent a code to <span className="font-medium text-foreground">{fullPhone}</span>
                  </p>
                </div>

                {error && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <Field>
                  <FieldLabel htmlFor="register-otp">Verification code</FieldLabel>
                  <div className="flex justify-center">
                    <InputOTP
                      id="register-otp"
                      maxLength={6}
                      value={otp}
                      onChange={(v) => setOtp(v)}
                      containerClassName="justify-center"
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className="size-10 text-sm" />
                        <InputOTPSlot index={1} className="size-10 text-sm" />
                        <InputOTPSlot index={2} className="size-10 text-sm" />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} className="size-10 text-sm" />
                        <InputOTPSlot index={4} className="size-10 text-sm" />
                        <InputOTPSlot index={5} className="size-10 text-sm" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </Field>

                <Field>
                  <Button type="submit" className="w-full" disabled={loading || otp.length < 6}>
                    {loading ? "Verifying..." : "Verify & create account"}
                  </Button>
                </Field>

                <FieldDescription className="text-center">
                  Didn&apos;t receive the code?{" "}
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="font-medium text-foreground underline underline-offset-4"
                  >
                    Resend
                  </button>
                </FieldDescription>
              </form>
            )}
          </FieldGroup>
        </TabsContent>
      </Tabs>
    </div>
  )
}

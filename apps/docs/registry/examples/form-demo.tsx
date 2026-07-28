"use client"

import * as React from "react"
import { ArrowRightIcon, MailIcon } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { Button } from "@/registry/ui/button"
import { Cascader, type CascaderOption } from "@/registry/ui/cascader"
import { Checkbox } from "@/registry/ui/checkbox"
import {
  Form,
  FormActions,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormLegend,
  FormMessage,
  FormSection,
} from "@/registry/ui/form"
import { Input } from "@/registry/ui/input"

const teams: CascaderOption[] = [
  {
    value: "design",
    label: "Design",
    children: [
      { value: "product", label: "Product Design" },
      { value: "brand", label: "Brand Design" },
    ],
  },
  {
    value: "engineering",
    label: "Engineering",
    children: [
      { value: "web", label: "Web Platform" },
      { value: "mobile", label: "Mobile" },
    ],
  },
]

export default function FormDemo() {
  const reduceMotion = useReducedMotion()
  const [email, setEmail] = React.useState("")
  const [team, setTeam] = React.useState<string[]>([])
  const [agreed, setAgreed] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)
  const [touched, setTouched] = React.useState(false)
  const emailInvalid = touched && !/^\S+@\S+\.\S+$/.test(email)

  return (
    <div className="bg-background w-full max-w-lg rounded-2xl border p-6 shadow-sm sm:p-8">
      <Form
        onSubmit={(event) => {
          event.preventDefault()
          setTouched(true)
          if (!/^\S+@\S+\.\S+$/.test(email) || !team.length || !agreed) return
          setSubmitted(true)
        }}
      >
        <FormSection>
          <FormLegend>Create your workspace</FormLegend>
          <p className="text-muted-foreground -mt-2 text-sm">
            A few details, then you are ready to invite your team.
          </p>

          <FormField invalid={emailInvalid} required>
            <FormLabel>Work email</FormLabel>
            <FormControl>
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onBlur={() => setTouched(true)}
                placeholder="you@company.com"
                startContent={<MailIcon />}
              />
            </FormControl>
            <FormDescription>
              We will only use this for workspace updates.
            </FormDescription>
            <FormMessage>Enter a valid work email.</FormMessage>
          </FormField>

          <FormField invalid={touched && !team.length} required>
            <FormLabel>Team</FormLabel>
            <FormControl>
              <Cascader
                options={teams}
                value={team}
                onValueChange={setTeam}
                placeholder="Choose your team"
              />
            </FormControl>
            <FormMessage>Choose a team to continue.</FormMessage>
          </FormField>

          <FormField invalid={touched && !agreed}>
            <label className="flex cursor-pointer items-start gap-3 text-sm">
              <Checkbox
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked === true)}
                className="mt-0.5"
              />
              <span className="text-muted-foreground leading-relaxed">
                I agree to the workspace terms and data policy.
              </span>
            </label>
            <FormMessage>Please confirm before continuing.</FormMessage>
          </FormField>
        </FormSection>

        <FormActions>
          <AnimatePresence mode="wait" initial={false}>
            {submitted ? (
              <motion.span
                key="success"
                initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-success mr-auto text-sm font-medium"
              >
                Workspace created
              </motion.span>
            ) : null}
          </AnimatePresence>
          <Button type="submit" motion>
            Continue
            <ArrowRightIcon />
          </Button>
        </FormActions>
      </Form>
    </div>
  )
}

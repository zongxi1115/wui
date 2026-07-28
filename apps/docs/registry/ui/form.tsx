"use client"

import * as React from "react"
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type HTMLMotionProps,
} from "motion/react"

import { cn } from "@/registry/lib/utils"

interface FormFieldContextValue {
  controlId: string
  descriptionId: string
  messageId: string
  invalid: boolean
  required: boolean
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null)

function useFormField() {
  const context = React.useContext(FormFieldContext)
  if (!context)
    throw new Error("Form field parts must be used inside <FormField>.")
  return context
}

export interface FormProps extends HTMLMotionProps<"form"> {
  /** Animate the form into place when it mounts. @default true */
  animated?: boolean
}

/** A semantic form surface with coordinated field motion and validation states. */
function Form({ className, animated = true, children, ...props }: FormProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.form
      data-slot="form"
      initial={animated && !reduceMotion ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduceMotion ? 0 : 0.38,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn("grid gap-5", className)}
      {...props}
    >
      {children}
    </motion.form>
  )
}

export interface FormFieldProps extends HTMLMotionProps<"div"> {
  /** Marks the field as invalid and reveals its error treatment. */
  invalid?: boolean
  /** Marks the field as required for labels and assistive technology. */
  required?: boolean
}

function FormField({
  className,
  invalid = false,
  required = false,
  children,
  ...props
}: FormFieldProps) {
  const id = React.useId()
  const reduceMotion = useReducedMotion()

  return (
    <FormFieldContext.Provider
      value={{
        controlId: `${id}-control`,
        descriptionId: `${id}-description`,
        messageId: `${id}-message`,
        invalid,
        required,
      }}
    >
      <motion.div
        data-slot="form-field"
        data-invalid={invalid || undefined}
        animate={
          invalid && !reduceMotion ? { x: [0, -4, 4, -2, 2, 0] } : { x: 0 }
        }
        transition={{ duration: reduceMotion ? 0 : 0.32, ease: "easeOut" }}
        className={cn("grid gap-2", className)}
        {...props}
      >
        {children}
      </motion.div>
    </FormFieldContext.Provider>
  )
}

function FormLabel({
  className,
  children,
  ...props
}: React.ComponentProps<"label">) {
  const { controlId, invalid, required } = useFormField()

  return (
    <label
      data-slot="form-label"
      htmlFor={controlId}
      data-invalid={invalid || undefined}
      className={cn(
        "data-[invalid=true]:text-destructive flex items-baseline gap-1 text-sm font-medium leading-none transition-colors",
        className
      )}
      {...props}
    >
      {children}
      {required ? (
        <span aria-hidden="true" className="text-destructive">
          *
        </span>
      ) : null}
    </label>
  )
}

export interface FormControlProps extends React.ComponentProps<"div"> {
  /** The single input-like element receiving form accessibility props. */
  children: React.ReactElement<Record<string, unknown>>
}

function FormControl({ children, ...props }: FormControlProps) {
  const { controlId, descriptionId, messageId, invalid, required } =
    useFormField()

  return (
    <div data-slot="form-control" {...props}>
      {React.cloneElement(children, {
        id: children.props.id ?? controlId,
        "aria-describedby":
          children.props["aria-describedby"] ??
          `${descriptionId}${invalid ? ` ${messageId}` : ""}`,
        "aria-invalid": children.props["aria-invalid"] ?? invalid,
        "aria-required": children.props["aria-required"] ?? required,
        required: children.props.required ?? required,
      })}
    </div>
  )
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { descriptionId } = useFormField()
  return (
    <p
      id={descriptionId}
      data-slot="form-description"
      className={cn("text-muted-foreground text-xs leading-relaxed", className)}
      {...props}
    />
  )
}

function FormMessage({ className, children, ...props }: HTMLMotionProps<"p">) {
  const { messageId, invalid } = useFormField()
  const reduceMotion = useReducedMotion()

  return (
    <AnimatePresence initial={false}>
      {invalid && children ? (
        <motion.p
          id={messageId}
          data-slot="form-message"
          role="alert"
          initial={reduceMotion ? false : { opacity: 0, height: 0, y: -4 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, height: 0, y: -3 }}
          transition={{
            duration: reduceMotion ? 0 : 0.22,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={cn(
            "text-destructive overflow-hidden text-xs font-medium",
            className
          )}
          {...props}
        >
          {children}
        </motion.p>
      ) : null}
    </AnimatePresence>
  )
}

function FormSection({
  className,
  ...props
}: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="form-section"
      className={cn("grid min-w-0 gap-4 border-0 p-0", className)}
      {...props}
    />
  )
}

function FormLegend({ className, ...props }: React.ComponentProps<"legend">) {
  return (
    <legend
      data-slot="form-legend"
      className={cn("mb-1 text-base font-semibold tracking-tight", className)}
      {...props}
    />
  )
}

function FormActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="form-actions"
      className={cn("flex items-center justify-end gap-2 pt-1", className)}
      {...props}
    />
  )
}

export {
  Form,
  FormActions,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormLegend,
  FormMessage,
  FormSection,
}

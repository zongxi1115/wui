import prompts, { type Answers, type PromptObject } from "prompts"

export function isInteractive(): boolean {
  return Boolean(process.stdin.isTTY && process.stdout.isTTY)
}

export async function ask<T extends string>(
  questions: PromptObject<T> | Array<PromptObject<T>>
): Promise<Answers<T> | null> {
  let cancelled = false
  const answers = await prompts(questions, {
    onCancel: () => {
      cancelled = true
    },
  })
  return cancelled ? null : answers
}

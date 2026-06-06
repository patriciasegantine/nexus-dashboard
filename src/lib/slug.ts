export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function ensureUniqueSlug(
  slug: string,
  checkExists: (candidate: string) => Promise<boolean>
): Promise<string> {
  let candidate = slug || 'project'
  let counter = 1

  while (await checkExists(candidate)) {
    candidate = `${slug}-${counter}`
    counter++
  }

  return candidate
}

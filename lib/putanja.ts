/** Samo relativne putanje na ovom sajtu — `//zli.com` i `https://…` se odbacuju (otvoreni redirect). */
export function bezbednaPutanja(putanja: string | null | undefined, podrazumevano = '/nalog'): string {
  if (!putanja || !putanja.startsWith('/') || putanja.startsWith('//') || putanja.includes('\\')) {
    return podrazumevano
  }
  return putanja
}

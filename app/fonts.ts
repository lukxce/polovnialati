import { Bricolage_Grotesque, Schibsted_Grotesk } from 'next/font/google'

/**
 * Display face — naslovi (h1–h3), cene i veliki brojevi.
 * `latin-ext` je obavezan zbog srpske latinice (č, ć, š, ž, đ).
 */
export const display = Bricolage_Grotesque({
  variable: '--font-display',
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '700', '800'],
  display: 'swap',
  fallback: ['Arial Narrow', 'Helvetica Neue', 'sans-serif'],
})

/** UI face — sve ostalo: telo teksta, dugmad, labele, filteri. */
export const ui = Schibsted_Grotesk({
  variable: '--font-ui',
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  fallback: ['Helvetica Neue', 'Arial', 'sans-serif'],
})

/** Spojene varijable za `<html className={fontVariables}>`. */
export const fontVariables = `${display.variable} ${ui.variable}`

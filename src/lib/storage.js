import { clonePage, createProject } from './model'
import { TEMPLATES } from '../data/catalog'

const PROJECTS_KEY = 'canva-pro-designs-v1'
const USER_KEY = 'canva-pro-user'
const BRAND_KEY = 'canva-pro-brand-v1'

export const defaultBrand = {
  name: 'My brand',
  colors: ['#7D2AE8', '#00C4CC', '#0F1014', '#FFFFFF', '#FF5A6A', '#F6F1E8'],
  headingFont: 'Poppins',
  bodyFont: 'Inter',
}

export function loadUser() {
  return localStorage.getItem(USER_KEY) || ''
}

export function saveUser(name) {
  localStorage.setItem(USER_KEY, name)
}

export function loadBrand() {
  try {
    const raw = localStorage.getItem(BRAND_KEY)
    return raw ? { ...defaultBrand, ...JSON.parse(raw) } : defaultBrand
  } catch {
    return defaultBrand
  }
}

export function saveBrand(brand) {
  localStorage.setItem(BRAND_KEY, JSON.stringify(brand))
}

export function loadProjects() {
  const raw = localStorage.getItem(PROJECTS_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function saveProjects(projects) {
  try {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects))
    return true
  } catch {
    return false
  }
}

export function initialProjects() {
  const saved = loadProjects()
  if (saved) return saved
  return TEMPLATES.slice(0, 4).map((template) =>
    createProject({
      name: template.name,
      designType: template.category,
      pages: template.pages.map((page) => clonePage(page)),
    }),
  )
}

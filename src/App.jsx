import { useEffect, useRef, useState } from 'react'
import { DESIGN_TYPES, TEMPLATES } from './data/catalog'
import { clonePage, createPage, createProject } from './lib/model'
import { initialProjects, loadBrand, loadUser, saveBrand, saveProjects, saveUser } from './lib/storage'
import { Editor } from './components/Editor'
import { Home } from './components/Home'
import { Landing } from './components/Landing'
import { Login } from './components/Login'

export default function App() {
  const [screen, setScreen] = useState('landing')
  const [user, setUser] = useState(() => {
    const saved = loadUser()
    if (!saved || saved === 'Guest') {
      if (saved === 'Guest') saveUser('')
      return ''
    }
    return saved
  })
  const [projects, setProjects] = useState(() => initialProjects())
  const [brand, setBrand] = useState(() => loadBrand())
  const [activeId, setActiveId] = useState(null)
  const [loginOpen, setLoginOpen] = useState(false)
  const pendingRef = useRef(null)
  const projectsRef = useRef(projects)
  projectsRef.current = projects
  const seeded = useRef(false)

  useEffect(() => {
    if (seeded.current) return
    seeded.current = true
    saveProjects(projectsRef.current)
  }, [])

  function enterStudio(name) {
    const next = name.trim()
    if (!next) return
    saveUser(next)
    setUser(next)
    setLoginOpen(false)
    const pending = pendingRef.current
    pendingRef.current = null
    finishEnter(pending?.action, pending?.payload)
  }

  function handleEnter(action, payload) {
    if (!user) {
      pendingRef.current = { action, payload }
      setLoginOpen(true)
      return
    }
    finishEnter(action, payload)
  }

  function finishEnter(action, payload) {
    if (action === 'template') {
      const template = TEMPLATES.find((item) => item.id === payload)
      if (template) openTemplate(template)
      else setScreen('home')
      return
    }
    if (payload) {
      const type = DESIGN_TYPES.find((item) => item.id === payload)
      if (type) {
        openBlank(type)
        return
      }
    }
    setScreen('home')
  }

  function openBlank(type) {
    const project = createProject({
      name: `${type.label} design`,
      designType: type.group,
      pages: [createPage({ width: type.width, height: type.height, name: 'Page 1' })],
    })
    remember(project)
  }

  function openTemplate(template) {
    const project = createProject({
      name: template.name,
      designType: template.category,
      pages: template.pages.map((page) => clonePage(page)),
    })
    remember(project)
  }

  function remember(project) {
    const next = [project, ...projectsRef.current]
    projectsRef.current = next
    setProjects(next)
    saveProjects(next)
    setActiveId(project.id)
    setScreen('editor')
  }

  function saveProject(doc) {
    const prev = projectsRef.current
    const next = prev.some((item) => item.id === doc.id)
      ? prev.map((item) => (item.id === doc.id ? doc : item))
      : [doc, ...prev]
    projectsRef.current = next
    setProjects(next)
    return saveProjects(next)
  }

  function deleteProject(id) {
    const project = projectsRef.current.find((item) => item.id === id)
    if (!project) return
    if (!window.confirm(`Delete “${project.name}”?`)) return
    const next = projectsRef.current.filter((item) => item.id !== id)
    projectsRef.current = next
    setProjects(next)
    saveProjects(next)
  }

  function updateBrand(next) {
    setBrand(next)
    saveBrand(next)
  }

  const active = projects.find((item) => item.id === activeId)

  return (
    <div className="h-full">
      {screen === 'landing' && <Landing onEnter={handleEnter} />}
      {screen === 'home' && (
        <Home
          user={user}
          projects={projects}
          brand={brand}
          onBrand={updateBrand}
          onOpen={(project) => {
            setActiveId(project.id)
            setScreen('editor')
          }}
          onCreate={openBlank}
          onTemplate={openTemplate}
          onDelete={deleteProject}
          onLogout={() => {
            saveUser('')
            setUser('')
            setScreen('landing')
          }}
        />
      )}
      {screen === 'editor' && active && (
        <Editor
          key={active.id}
          project={active}
          brand={brand}
          onBack={() => setScreen('home')}
          onSave={saveProject}
        />
      )}

      {loginOpen && (
        <Login
          onClose={() => {
            pendingRef.current = null
            setLoginOpen(false)
          }}
          onEnter={(name) => enterStudio(name)}
        />
      )}
    </div>
  )
}

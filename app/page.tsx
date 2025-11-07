"use client"

import { useState, useEffect } from "react"
import WelcomePage from "@/components/stages/welcome-page"
import CharacterCreation from "@/components/stages/character-creation"
import CharacterCreationNoAi from "@/components/stages/character-creation-no-ai"
import PlotBrainstorm from "@/components/stages/plot-brainstorm"
import PlotBrainstormNoAi from "@/components/stages/plot-brainstorm-no-ai"
import StoryStructure from "@/components/stages/story-structure"
import StoryStructureNoAi from "@/components/stages/story-structure-no-ai"
import GuidedWriting from "@/components/stages/guided-writing"
import GuidedWritingNoAi from "@/components/stages/guided-writing-no-ai"
import StoryReview from "@/components/stages/story-review"
import LoginPage from "@/components/auth/login-page"
import Dashboard from "@/components/teacher/dashboard"

export type Language = "en" | "zh"

export interface StoryState {
  character: {
    name: string
    age: number
    traits: string[]
    description: string
    imageUrl?: string
    species?: string
  } | null
  plot: {
    setting: string
    conflict: string
    goal: string
  } | null
  structure: {
    type: "freytag" | "threeAct" | "fichtean"
    outline: string[]
    imageUrl?: string
  } | null
  story: string
}

export default function Home() {
  const [user, setUser] = useState<{ username: string; role: 'teacher' | 'student'; noAi?: boolean } | null>(null)
  const [stage, setStage] = useState<"login" | "welcome" | "character" | "plot" | "structure" | "writing" | "review" | "dashboard">("login")
  const [language, setLanguage] = useState<Language>("en")
  const [storyState, setStoryState] = useState<StoryState>({
    character: null,
    plot: null,
    structure: null,
    story: "",
  })

  // Hydration safety
  const [isReady, setIsReady] = useState(false)
  useEffect(() => {
    setIsReady(true)
  }, [])

  if (!isReady) return null

  const handleLogin = (user: { username: string; role: 'teacher' | 'student'; noAi?: boolean }) => {
    setUser(user)
    if (user.role === 'teacher') {
      setStage("dashboard")
    } else {
      setStage("welcome")
    }
  }
  
  const isNoAi = user?.noAi || false

  const handleCharacterCreate = (character: StoryState["character"]) => {
    setStoryState((prev) => ({ ...prev, character }))
    setStage("plot")
  }

  const handlePlotCreate = (plot: StoryState["plot"]) => {
    setStoryState((prev) => ({ ...prev, plot }))
    setStage("structure")
  }

  const handleStructureSelect = (structure: StoryState["structure"]) => {
    setStoryState((prev) => ({ ...prev, structure }))
    setStage("writing")
  }

  const handleStoryWrite = (story: string) => {
    setStoryState((prev) => ({ ...prev, story }))
    setStage("review")
  }

  const handleReset = () => {
    setStoryState({ character: null, plot: null, structure: null, story: "" })
    setStage("welcome")
  }

  const handleBackToStage = (targetStage: typeof stage) => {
    setStage(targetStage)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 via-pink-50 to-orange-50">
      {stage === "login" && <LoginPage onLogin={handleLogin} />}
      {stage === "dashboard" && user?.role === 'teacher' && (
        <Dashboard onBack={() => setStage("welcome")} />
      )}
      {stage === "welcome" && user && (
        <WelcomePage
          language={language}
          onLanguageChange={setLanguage}
          onStart={() => setStage("character")}
          userId={user.username}
        />
      )}
      {stage === "character" && user && (
        isNoAi ? (
          <CharacterCreationNoAi
            language={language}
            onCharacterCreate={handleCharacterCreate}
            onBack={() => setStage("welcome")}
            userId={user.username}
          />
        ) : (
          <CharacterCreation
            language={language}
            onCharacterCreate={handleCharacterCreate}
            onBack={() => setStage("welcome")}
            userId={user.username}
          />
        )
      )}
      {stage === "plot" && user && (
        isNoAi ? (
          <PlotBrainstormNoAi
            language={language}
            character={storyState.character}
            onPlotCreate={handlePlotCreate}
            onBack={() => setStage("character")}
            userId={user.username}
          />
        ) : (
          <PlotBrainstorm
            language={language}
            character={storyState.character}
            onPlotCreate={handlePlotCreate}
            onBack={() => setStage("character")}
            userId={user.username}
          />
        )
      )}
      {stage === "structure" && user && (
        isNoAi ? (
          <StoryStructureNoAi
            language={language}
            plot={storyState.plot}
            character={storyState.character}
            onStructureSelect={handleStructureSelect}
            onBack={() => setStage("plot")}
            userId={user.username}
          />
        ) : (
          <StoryStructure
            language={language}
            plot={storyState.plot}
            character={storyState.character}
            onStructureSelect={handleStructureSelect}
            onBack={() => setStage("plot")}
            userId={user.username}
          />
        )
      )}
      {stage === "writing" && user && (
        isNoAi ? (
          <GuidedWritingNoAi
            language={language}
            storyState={storyState}
            onStoryWrite={handleStoryWrite}
            onBack={() => setStage("structure")}
            userId={user.username}
          />
        ) : (
          <GuidedWriting
            language={language}
            storyState={storyState}
            onStoryWrite={handleStoryWrite}
            onBack={() => setStage("structure")}
            userId={user.username}
          />
        )
      )}
      {stage === "review" && user && (
        <StoryReview
          language={language}
          storyState={storyState}
          onReset={handleReset}
          onEdit={(targetStage) => handleBackToStage(targetStage)}
          onBack={() => setStage("writing")}
          userId={user.username}
        />
      )}
    </main>
  )
}

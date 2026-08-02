export interface HiddenClue {
  clueId: string
  category: string
  coordinates?: { x: number; y: number; radius: number }
  textSpan?: { start: number; end: number }
  explanation: string
}

export interface Scenario {
  id: string
  type: 'photo' | 'message'
  mediaUrl: string
  promptText: string
  difficulty: number
  hiddenClues: HiddenClue[]
  message?: string
}

export interface QuizQuestion {
  id: string
  category: string
  prompt: string
  options: QuizOption[]
}

export interface QuizOption {
  key: string
  text: string
  points: number
  icon?: string
}

export interface PebbleData {
  id?: string
  category: string
  colorCode: string
  scenarioId: string
  feedback: string
  clueId?: string
  earnedAt?: string
}

export interface Island {
  id: string
  name: string
  order: number
  requiredPebbles: number
  unlockedContentId: string
  progress?: number
}

export interface NestState {
  pebbles: PebbleData[]
  totalPebbles: number
  nestLevel: string
  unlockedIslands: Island[]
  nextIsland: Island | null
}

export interface ChecklistAnswer {
  question: string
  userChoice: string
}

export interface AIEvaluation {
  award_pebble: boolean
  pebble_color_category: string
  pebble_feedback_text: string
  tone: string
}

export interface QuizResult {
  totalScore: number
  nestLevel: string
  detailed: Array<{
    questionId: string
    optionSelected: string
    points: number
  }>
}

export interface UserState {
  uid: string
  displayName: string
  age: number
  password: string
  nestLevel: string
  totalPebbles: number
  unlockedIslandIds: string[]
  tutorialCompleted: boolean
}

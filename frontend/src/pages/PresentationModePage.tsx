import React, { useState, useEffect } from 'react'
import { SlideNavigation } from '../features/presentation/components/SlideNavigation'
import { SlideDeck } from '../features/presentation/components/SlideDeck'
import { SpeakerNotesDrawer } from '../features/presentation/components/SpeakerNotesDrawer'

const SLIDE_DATA = [
  {
    title: 'Macro Problem & $2.42M Margin Crisis',
    notes: {
      keyPoints: [
        'Total logistics margin shrunk by 4.2% in Q4 despite strong GMV growth.',
        '$2.42M in identified financial leakage and SLA breach penalties.',
        'Immediate recovery potential of +$1.84M EBITDA via automated routing.',
      ],
      talkingScript:
        'Judges, despite record top-line revenue, our logistics margin contracted by 4.2%. Datasphere discovered that un-optimized carrier rates and SLA failure penalties are draining $2.42 million from the bottom line.',
      anticipatedJudgeQuestions: [
        {
          q: 'Where does the $2.42M number come from?',
          a: 'It is computed directly from our DuckDB enterprise logistics dataset by aggregating contractual rate disparities and SLA delay fee penalties across all 50,000 shipment orders in Q4.',
        },
      ],
    },
  },
  {
    title: 'Root Cause & Carrier Bottleneck Decomposition',
    notes: {
      keyPoints: [
        'Apex Freight Systems accounts for 78% of all delayed shipments in the Midwest.',
        'Rate disparity: Apex charges +$0.18/km above regional market benchmark.',
        'SwiftLogistics has available capacity to absorb volume at -$0.12/km discount.',
      ],
      talkingScript:
        'When our automated Scientist and Data Engineer agents drilled down, they isolated 78% of the problem to a single carrier—Apex Freight Systems in Chicago. Meanwhile, SwiftLogistics has idle capacity at lower rates.',
      anticipatedJudgeQuestions: [
        {
          q: 'How did you determine Apex was the bottleneck?',
          a: 'Our feature store and SHAP explainability engine ran multi-factor regression attributing delay variance across weather, fuel surcharge, carrier ID, and hub dwell time.',
        },
      ],
    },
  },
  {
    title: 'Multi-Agent Autonomous Orchestration DAG',
    notes: {
      keyPoints: [
        '7 specialized LangGraph autonomous agents work in collaborative DAG.',
        'Dual-layer AST guardrails enforce deterministic financial safety limits.',
        'Human-in-the-loop (HITL) cryptographic approval for any action > $50,000.',
      ],
      talkingScript:
        'Datasphere orchestrates seven specialized LangGraph agents—from data ingestion to econometrics. To guarantee safety, we enforce dual-layer guardrails with cryptographic proof before any action is executed.',
      anticipatedJudgeQuestions: [
        {
          q: 'What prevents the AI from making an unauthorized or dangerous decision?',
          a: 'Our Guardrails engine intercepts any action exceeding safety limits or budget ceilings and mandates human-in-the-loop sign-off with HMAC-SHA256 signature verification.',
        },
      ],
    },
  },
  {
    title: '12-Month Predictive Fan Chart & Monte Carlo Outlook',
    notes: {
      keyPoints: [
        '5,000 Monte Carlo iterations simulate projected margin recovery.',
        '80% and 95% confidence intervals bound risk exposure under volatile fuel conditions.',
        'Target margin expansion to 38.4% achievable within 12 months.',
      ],
      talkingScript:
        'Using our Tier 2 probabilistic forecasting engine, we simulated 5,000 market scenarios. The model proves that reallocating carrier volume expands our operating margin from 34.8% to 38.4%.',
      anticipatedJudgeQuestions: [
        {
          q: 'How is the fan chart calculated?',
          a: 'We combine closed-form elasticity modeling with an XGBoost regressor that generates mean trajectories and prediction intervals across 80% and 95% confidence bands.',
        },
      ],
    },
  },
  {
    title: 'Boardroom Decision Matrix & 60-Day Action Plan',
    notes: {
      keyPoints: [
        'Phase 1: Automated contract clause renegotiation (+$450k).',
        'Phase 2: Reroute 40% volume to SwiftLogistics (cuts delays by 62%).',
        'Phase 3: Deploy dynamic capacity auction engine (+$1.84M total EBITDA).',
      ],
      talkingScript:
        'Here is the executive roadmap: We recommend approving Phase 1 and 2 immediately. This delivers $1.84M in EBITDA expansion and cuts customer delivery delays by 62% within 60 days.',
      anticipatedJudgeQuestions: [
        {
          q: 'What is the ROI and payback period of deploying Datasphere?',
          a: 'With $1.84M in annualized savings and under 60 days to full deployment, the payback period is under 3 weeks.',
        },
      ],
    },
  },
]

export const PresentationModePage: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [showNotes, setShowNotes] = useState<boolean>(true)
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleNext = () => {
    if (currentSlideIndex < SLIDE_DATA.length - 1) {
      setCurrentSlideIndex(prev => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1)
    }
  }

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto p-2">
      {/* Slide Navigation Bar */}
      <SlideNavigation
        currentSlideIndex={currentSlideIndex}
        totalSlides={SLIDE_DATA.length}
        slideTitles={SLIDE_DATA.map(s => s.title)}
        onSelectSlide={setCurrentSlideIndex}
        onPrev={handlePrev}
        onNext={handleNext}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        showNotes={showNotes}
        onToggleNotes={() => setShowNotes(prev => !prev)}
        elapsedSeconds={elapsedSeconds}
      />

      {/* Main Slide & Speaker Notes Split Layout */}
      <div className="flex flex-col lg:flex-row items-stretch gap-6">
        {/* Slide Deck Canvas */}
        <div className="flex-1">
          <SlideDeck currentSlideIndex={currentSlideIndex} />
        </div>

        {/* Speaker Notes & Judge Q&A Drawer */}
        {showNotes && (
          <SpeakerNotesDrawer
            slideIndex={currentSlideIndex}
            notes={SLIDE_DATA[currentSlideIndex].notes}
            onClose={() => setShowNotes(false)}
          />
        )}
      </div>
    </div>
  )
}

export default PresentationModePage

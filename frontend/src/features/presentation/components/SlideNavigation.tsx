import React from 'react'
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, FileText, Clock, Play } from 'lucide-react'
import { Button } from '../../../shared/ui/Button'
import { Badge } from '../../../shared/ui/Badge'

interface SlideNavigationProps {
  currentSlideIndex: number
  totalSlides: number
  slideTitles: string[]
  onSelectSlide: (index: number) => void
  onPrev: () => void
  onNext: () => void
  isFullscreen: boolean
  onToggleFullscreen: () => void
  showNotes: boolean
  onToggleNotes: () => void
  elapsedSeconds: number
}

export const SlideNavigation: React.FC<SlideNavigationProps> = ({
  currentSlideIndex,
  totalSlides,
  slideTitles,
  onSelectSlide,
  onPrev,
  onNext,
  isFullscreen,
  onToggleFullscreen,
  showNotes,
  onToggleNotes,
  elapsedSeconds,
}) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60)
    const rem = secs % 60
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex items-center justify-between p-3 bg-slate-950/90 border border-cyber-border rounded-xl backdrop-blur-md">
      {/* Slide Selector & Quick Title */}
      <div className="flex items-center gap-3">
        <Badge variant="cyber" className="text-xs font-mono">
          Slide {currentSlideIndex + 1} / {totalSlides}
        </Badge>
        <span className="text-xs font-bold text-cyber-text hidden sm:inline">
          {slideTitles[currentSlideIndex]}
        </span>
      </div>

      {/* Slide Thumb Dots / Pills */}
      <div className="hidden md:flex items-center gap-1.5">
        {slideTitles.map((_, idx) => (
          <button
            key={idx}
            onClick={() => onSelectSlide(idx)}
            className={`h-2 rounded-full transition-all ${
              idx === currentSlideIndex
                ? 'w-6 bg-cyber-cyan shadow-glow-sm'
                : 'w-2 bg-slate-700 hover:bg-slate-500'
            }`}
            title={`Jump to Slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Controls: Prev/Next, Timer, Notes & Fullscreen */}
      <div className="flex items-center gap-2">
        {/* Presentation Timer */}
        <div className="flex items-center gap-1 text-xs font-mono text-cyber-cyan bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
          <Clock className="w-3 h-3" />
          <span>{formatTime(elapsedSeconds)}</span>
        </div>

        {/* Speaker Notes Toggle */}
        <Button
          variant={showNotes ? 'cyber' : 'outline'}
          size="xs"
          onClick={onToggleNotes}
          className="flex items-center gap-1 text-xs"
        >
          <FileText className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Speaker Notes</span>
        </Button>

        {/* Fullscreen Toggle */}
        <button
          onClick={onToggleFullscreen}
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* Prev & Next */}
        <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
          <button
            onClick={onPrev}
            disabled={currentSlideIndex === 0}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:text-white hover:border-cyber-cyan/50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onNext}
            disabled={currentSlideIndex === totalSlides - 1}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:text-white hover:border-cyber-cyan/50 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

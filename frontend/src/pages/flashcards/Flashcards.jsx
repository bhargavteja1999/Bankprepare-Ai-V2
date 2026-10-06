import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { quizService } from '../../services/quizService';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import {
  Layers,
  Sparkles,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  HelpCircle,
  Award,
  Trash2
} from 'lucide-react';

export default function Flashcards() {
  const [searchParams] = useSearchParams();
  const [decks, setDecks] = useState([]);
  const [activeDeck, setActiveDeck] = useState(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  // New deck creation state
  const [topic, setTopic] = useState(searchParams.get('topic') || 'Important Banking Regulations & Committees');
  const [subject, setSubject] = useState(searchParams.get('subject') || 'Banking Awareness');

  const fetchDecks = async () => {
    try {
      setLoading(true);
      const list = await quizService.listFlashcardDecks();
      setDecks(list);
      if (list.length > 0 && !activeDeck) {
        const fullDeck = await quizService.getFlashcardDeck(list[0].id);
        setActiveDeck(fullDeck);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecks();
  }, []);

  const handleSelectDeck = async (deckId) => {
    try {
      setLoading(true);
      const full = await quizService.getFlashcardDeck(deckId);
      setActiveDeck(full);
      setCardIndex(0);
      setIsFlipped(false);
    } catch (e) {
      alert('Failed to load deck');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDeck = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const newDeck = await quizService.generateFlashcards({
        topic,
        subject,
        num_cards: 6,
      });
      setActiveDeck(newDeck);
      setCardIndex(0);
      setIsFlipped(false);
      fetchDecks();
    } catch (e) {
      alert('Failed to generate flashcard deck');
    } finally {
      setGenerating(false);
    }
  };

  const handleReview = async (quality) => {
    if (!activeDeck || !activeDeck.cards || !activeDeck.cards[cardIndex]) return;
    const currentCard = activeDeck.cards[cardIndex];

    try {
      await quizService.reviewFlashcard(currentCard.id, quality);
      // Move to next card
      if (cardIndex < activeDeck.cards.length - 1) {
        setCardIndex((prev) => prev + 1);
        setIsFlipped(false);
      } else {
        alert('Deck review completed! Great work on spaced repetition.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteDeck = async (deckId, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this flashcard deck?')) return;
    try {
      await quizService.deleteDeck(deckId);
      setDecks((prev) => prev.filter((d) => d.id !== deckId));
      if (activeDeck?.id === deckId) {
        setActiveDeck(null);
      }
    } catch (err) {
      alert('Failed to delete deck');
    }
  };

  const currentCard = activeDeck?.cards?.[cardIndex];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
          <Layers className="w-7 h-7 text-brand-600" />
          <span>Spaced Repetition Flashcards</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Master volatile banking terms, acronyms, and formulas with cognitive recall intervals.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 1 Col: Deck Generator & List */}
        <div className="space-y-6">
          {/* Quick Create Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>Generate New AI Deck</span>
            </h3>
            <form onSubmit={handleGenerateDeck} className="space-y-3">
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Topic: e.g. Priority Sector Lending (PSL)"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                loading={generating}
                icon={Sparkles}
                className="w-full text-xs"
              >
                Generate Flashcard Deck
              </Button>
            </form>
          </div>

          {/* Deck List */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Your Decks ({decks.length})
            </h3>
            {decks.length === 0 ? (
              <p className="text-xs text-slate-400 py-3">No decks created yet.</p>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {decks.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => handleSelectDeck(d.id)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition flex items-center justify-between gap-2 ${
                      activeDeck?.id === d.id
                        ? 'border-brand-600 bg-brand-50/60 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <h4 className="text-xs text-slate-900 line-clamp-1">{d.title}</h4>
                      <span className="text-[10px] text-slate-500">{d.cards_count || 6} cards • {d.subject}</span>
                    </div>
                    <button
                      onClick={(e) => handleDeleteDeck(d.id, e)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 2 Cols: Interactive Flashcard Player */}
        <div className="lg:col-span-2 space-y-4">
          {activeDeck && currentCard ? (
            <div className="space-y-6">
              {/* Deck Header & Progress */}
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-800">{activeDeck.title}</span>
                <span>
                  Card {cardIndex + 1} of {activeDeck.cards.length}
                </span>
              </div>

              {/* 3D Flip Card Container */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-full min-h-[300px] cursor-pointer rounded-3xl bg-white border-2 border-slate-200 shadow-lg p-8 flex flex-col justify-between hover:border-brand-400 transition-all text-center relative select-none"
              >
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-bold uppercase tracking-wider text-brand-600">
                    {isFlipped ? 'Answer & Explanation' : 'Concept / Question'}
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <RotateCw className="w-3.5 h-3.5" /> Click to Flip
                  </span>
                </div>

                <div className="py-8 my-auto">
                  <p className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed">
                    {isFlipped ? currentCard.back : currentCard.front}
                  </p>
                  {!isFlipped && currentCard.hint && (
                    <p className="text-xs text-slate-400 mt-4 italic">
                      Hint: {currentCard.hint}
                    </p>
                  )}
                </div>

                <div className="text-[11px] text-slate-400">
                  Mastery Level: {currentCard.mastery_level || 0} / 5
                </div>
              </div>

              {/* Spaced Repetition Buttons */}
              <div className="space-y-2 text-center">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  How well did you know this?
                </p>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => handleReview(0)}
                    className="p-3 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold transition"
                  >
                    Again (1d)
                  </button>
                  <button
                    onClick={() => handleReview(1)}
                    className="p-3 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 text-xs font-bold transition"
                  >
                    Hard (2d)
                  </button>
                  <button
                    onClick={() => handleReview(2)}
                    className="p-3 rounded-xl bg-blue-50 text-brand-700 hover:bg-blue-100 border border-blue-200 text-xs font-bold transition"
                  >
                    Good (4d)
                  </button>
                  <button
                    onClick={() => handleReview(3)}
                    className="p-3 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold transition"
                  >
                    Easy (7d)
                  </button>
                </div>
              </div>

              {/* Prev / Next Nav */}
              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={cardIndex === 0}
                  onClick={() => {
                    setCardIndex((prev) => Math.max(0, prev - 1));
                    setIsFlipped(false);
                  }}
                  icon={ChevronLeft}
                >
                  Previous Card
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={cardIndex === activeDeck.cards.length - 1}
                  onClick={() => {
                    setCardIndex((prev) => Math.min(activeDeck.cards.length - 1, prev + 1));
                    setIsFlipped(false);
                  }}
                >
                  <span>Next Card</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No Flashcard Deck Selected</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Create a deck on the left panel or select an existing one to begin spaced recall practice.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

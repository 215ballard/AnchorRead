import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Upload, 
  Settings, 
  RotateCcw, 
  HelpCircle, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  BookOpen, 
  Sliders, 
  Eye, 
  Activity,
  Layers,
  Plus,
  Minus,
  Trash2,
  RefreshCw
} from 'lucide-react';
import './App.css';

// Built-in Sample Texts
const SAMPLES = [
  {
    name: "The Science of Reading & Dyslexia",
    desc: "A brief overview of how eye-anchoring and typography assist reading fluency.",
    text: `Dyslexia is a natural learning difference that affects how the brain processes written language. It is not a reflection of a person's intelligence, creativity, or cognitive capability. In fact, many individuals with dyslexia are highly creative, hands-on problem solvers who excel in visual and spatial reasoning.

Research in cognitive science shows that traditional typographic layouts can create visual crowding. Visual crowding occurs when letters and words are packed too closely together, causing them to blur, rotate, or overlap in the reader's perception. To mitigate this effect, specific formatting adjustments can be applied:

1. Dyslexia-friendly Fonts: Typefaces like OpenDyslexic or Lexend are designed with unique characteristics. OpenDyslexic uses heavy, weighted bottoms to ground letters, making it harder for the brain to mentally rotate them. Lexend uses clean, highly-differentiated geometric characters to improve parsing speeds.

2. Generous Line Height and Letter Spacing: Setting the line height to 1.5x or 2.0x and expanding letter spacing prevents text lines from bleeding into each other. This creates a visual harbor for each word, allowing the eye to track from left to right without skipping lines.

3. Eye-Anchoring Bolding (Bionic Reading): Highlighting the first few letters of each word serves as a visual anchor. The brain recognizes words by their shapes rather than reading every letter. By bolding the initial syllables, the eye slides smoothly through the text, reducing cognitive fatigue and preventing visual wandering.

By customizing these visual properties, readers can transform reading from an effort of visual coordination into a direct channel of comprehension and ideas.`
  },
  {
    name: "Alice's Adventures in Wonderland",
    desc: "A classic narrative sample to test visual tracking on descriptive prose.",
    text: `Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, "and what is the use of a book," thought Alice "without pictures or conversations?"

So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.

There was nothing so VERY remarkable in that; nor did Alice think it so VERY much out of the way to hear the Rabbit say to itself, "Oh dear! Oh dear! I shall be late!" (when she thought it over afterwards, it occurred to her that she ought to have wondered at this, but at the time it all seemed quite natural); but when the Rabbit actually TOOK A WATCH OUT OF ITS WAISTCOAT-POCKET, and looked at it, and then hurried on, Alice started to her feet, for it flashed across her mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge.`
  },
  {
    name: "Software Architecture & Clean Code",
    desc: "A technical document designed to evaluate reading focus on structured developer text.",
    text: `Clean code is code that is easy to understand and easy to change. Software engineering is a social activity; we write code for machines to execute, but we write it primarily for other humans to read, maintain, and build upon. Indeed, research shows that the ratio of time spent reading code versus writing code is over ten to one.

When software developers write code, they must manage cognitive load. A clean architecture manages this load by separating concerns into distinct layers. Each module or class should have a single responsibility—a single reason to change. If a module performs multiple tasks, it becomes coupled, making it difficult to comprehend and prone to unexpected side-effects during modification.

To improve code readability, engineers should follow clean formatting conventions:
- Use meaningful, descriptive names for functions and variables.
- Write short, focused functions that perform one operation.
- Implement consistent spacing and indentation to reflect scope.
- Write helpful comments that explain the "why" rather than the "what".

Adhering to these clean code principles ensures that codebases remain maintainable, scalable, and accessible to teams of all sizes, minimizing developer friction and technical debt.`
  }
];

function App() {
  // --- Library & Document State ---
  const [documents, setDocuments] = useState(() => {
    const saved = localStorage.getItem('dyslexia_reader_library');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse library", e);
      }
    }
    return [
      {
        id: 'sample-1',
        name: "The Science of Reading & Dyslexia",
        text: SAMPLES[0].text,
        activeWordIdx: 0
      },
      {
        id: 'sample-2',
        name: "Alice's Adventures in Wonderland",
        text: SAMPLES[1].text,
        activeWordIdx: 0
      },
      {
        id: 'sample-3',
        name: "Software Architecture & Clean Code",
        text: SAMPLES[2].text,
        activeWordIdx: 0
      }
    ];
  });

  const [activeDocId, setActiveDocId] = useState(() => {
    const saved = localStorage.getItem('dyslexia_reader_active_doc_id');
    return saved || 'sample-1';
  });

  // Local state for the current active text and index for responsive rendering.
  // We initialize these directly from the active document's saved values to prevent mount race conditions.
  const [text, setText] = useState(() => {
    const activeDoc = documents.find(d => d.id === activeDocId) || documents[0];
    return activeDoc ? activeDoc.text : '';
  });
  
  const [activeWordIdx, setActiveWordIdx] = useState(() => {
    const activeDoc = documents.find(d => d.id === activeDocId) || documents[0];
    return activeDoc ? activeDoc.activeWordIdx : 0;
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('dyslexia_reader_theme') || 'carbon';
  });

  const [fontFamily, setFontFamily] = useState(() => {
    return localStorage.getItem('dyslexia_reader_font') || 'Lexend';
  });

  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('dyslexia_reader_font_size');
    return saved ? parseInt(saved, 10) : 22;
  });

  const [lineHeight, setLineHeight] = useState(() => {
    const saved = localStorage.getItem('dyslexia_reader_line_height');
    return saved ? parseFloat(saved) : 2.0;
  });

  const [letterSpacing, setLetterSpacing] = useState(() => {
    const saved = localStorage.getItem('dyslexia_reader_letter_spacing');
    return saved ? parseFloat(saved) : 0.12;
  });

  const [lineWidth, setLineWidth] = useState(() => {
    const saved = localStorage.getItem('dyslexia_reader_line_width');
    return saved ? parseInt(saved, 10) : 65;
  });

  const [boldStrength, setBoldStrength] = useState(() => {
    const saved = localStorage.getItem('dyslexia_reader_bold_strength');
    return saved ? parseInt(saved, 10) : 40; // Default 40%
  });

  const [readingMode, setReadingMode] = useState(() => {
    return localStorage.getItem('dyslexia_reader_mode') || 'focus'; // focus, bionic, standard
  });

  const [hoverTrack, setHoverTrack] = useState(() => {
    const saved = localStorage.getItem('dyslexia_reader_hover_track');
    return saved === 'true'; // Default false
  });

  // --- UI Control States ---
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wpm, setWpm] = useState(() => {
    const saved = localStorage.getItem('dyslexia_reader_wpm');
    return saved ? parseInt(saved, 10) : 110;
  });

  // --- Refs ---
  const playTimerRef = useRef(null);
  const readingContainerRef = useRef(null);
  const prevActiveDocIdRef = useRef(activeDocId);

  // --- Sync State to LocalStorage ---
  useEffect(() => {
    localStorage.setItem('dyslexia_reader_active_doc_id', activeDocId || '');
  }, [activeDocId]);

  // Debounced save for documents to prevent disk writes blocking UI during fast playback
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('dyslexia_reader_library', JSON.stringify(documents));
    }, 500);
    return () => clearTimeout(timer);
  }, [documents]);

  // Sync local text & index states when active document changes
  useEffect(() => {
    const doc = documents.find(d => d.id === activeDocId);
    if (doc) {
      setText(doc.text);
      setActiveWordIdx(doc.activeWordIdx);
    } else if (documents.length > 0) {
      setActiveDocId(documents[0].id);
    } else {
      setText('');
      setActiveWordIdx(0);
    }
    setIsPlaying(false);
  }, [activeDocId, documents.length]);

  // Sync activeWordIdx back to the documents list
  useEffect(() => {
    // Prevent overwriting the new document's progress during a document switch
    if (prevActiveDocIdRef.current !== activeDocId) {
      prevActiveDocIdRef.current = activeDocId;
      return;
    }

    if (activeDocId && activeWordIdx !== undefined) {
      setDocuments(prev => prev.map(doc => {
        if (doc.id === activeDocId && doc.activeWordIdx !== activeWordIdx) {
          return { ...doc, activeWordIdx };
        }
        return doc;
      }));
    }
  }, [activeWordIdx, activeDocId]);

  useEffect(() => {
    localStorage.setItem('dyslexia_reader_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('dyslexia_reader_font', fontFamily);
  }, [fontFamily]);

  useEffect(() => {
    localStorage.setItem('dyslexia_reader_font_size', fontSize.toString());
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('dyslexia_reader_line_height', lineHeight.toString());
  }, [lineHeight]);

  useEffect(() => {
    localStorage.setItem('dyslexia_reader_letter_spacing', letterSpacing.toString());
  }, [letterSpacing]);

  useEffect(() => {
    localStorage.setItem('dyslexia_reader_line_width', lineWidth.toString());
  }, [lineWidth]);

  useEffect(() => {
    localStorage.setItem('dyslexia_reader_bold_strength', boldStrength.toString());
  }, [boldStrength]);

  useEffect(() => {
    localStorage.setItem('dyslexia_reader_mode', readingMode);
  }, [readingMode]);

  useEffect(() => {
    localStorage.setItem('dyslexia_reader_hover_track', hoverTrack.toString());
  }, [hoverTrack]);

  useEffect(() => {
    localStorage.setItem('dyslexia_reader_wpm', wpm.toString());
  }, [wpm]);

  // --- Process and Tokenize Text ---
  // Structure: paragraphs -> tokens (word or non-word)
  const paragraphsData = useMemo(() => {
    if (!text) return [];
    const paragraphs = text.split(/\r?\n/);
    let wordCounter = 0;

    return paragraphs.map((para, paraIdx) => {
      // Split paragraph by word boundaries (including standard accented letters)
      // Capturing group keeps the delimiters in the resulting array
      const rawTokens = para.split(/([a-zA-Z0-9'\u00C0-\u017F]+)/g);
      const tokens = rawTokens
        .filter(t => t !== '')
        .map((tok, tokIdx) => {
          const isWord = /^[a-zA-Z0-9'\u00C0-\u017F]+$/.test(tok);
          let wordIdx = null;
          if (isWord) {
            wordIdx = wordCounter;
            wordCounter++;
          }
          return {
            text: tok,
            isWord,
            wordIdx,
            id: `p${paraIdx}-t${tokIdx}`
          };
        });

      return {
        id: `p-${paraIdx}`,
        tokens
      };
    });
  }, [text]);

  const totalWords = useMemo(() => {
    let count = 0;
    paragraphsData.forEach(p => {
      p.tokens.forEach(t => {
        if (t.isWord) count++;
      });
    });
    return count;
  }, [paragraphsData]);

  // Reset active word index if it overflows new text length
  useEffect(() => {
    if (activeWordIdx >= totalWords) {
      setActiveWordIdx(0);
    }
  }, [totalWords, activeWordIdx]);

  // --- Autoplay Scroller Logic ---
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = (60 * 1000) / wpm;
      playTimerRef.current = setInterval(() => {
        setActiveWordIdx(prev => {
          if (prev >= totalWords - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, intervalMs);
    } else {
      if (playTimerRef.current) {
        clearInterval(playTimerRef.current);
      }
    }

    return () => {
      if (playTimerRef.current) {
        clearInterval(playTimerRef.current);
      }
    };
  }, [isPlaying, wpm, totalWords]);

  // --- Active Word Visibility & Auto-Scroll Logic ---
  useEffect(() => {
    const activeEl = document.querySelector('.active-word');
    const container = readingContainerRef.current;
    
    if (activeEl && container) {
      const rect = activeEl.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      const threshold = 120; // px buffer from top/bottom
      const isAbove = rect.top < containerRect.top + threshold;
      const isBelow = rect.bottom > containerRect.bottom - threshold;

      if (isAbove || isBelow) {
        // Use instant scroll when autoplaying to prevent animation stuttering, 
        // and smooth scroll for keyboard/manual navigations
        activeEl.scrollIntoView({
          behavior: isPlaying ? 'auto' : 'smooth',
          block: 'center'
        });
      }
    }
  }, [activeWordIdx, isPlaying]);

  // --- Keyboard Shortcuts ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts if user is typing in a text field
      if (document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'INPUT') {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          setIsPlaying(prev => !prev);
          break;
        case 'ArrowRight':
          e.preventDefault();
          setIsPlaying(false);
          setActiveWordIdx(prev => Math.min(totalWords - 1, prev + 1));
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setIsPlaying(false);
          setActiveWordIdx(prev => Math.max(0, prev - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setWpm(prev => Math.min(600, prev + 10));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setWpm(prev => Math.max(80, prev - 10));
          break;
        case 'Escape':
          e.preventDefault();
          setActiveWordIdx(0);
          setIsPlaying(false);
          break;
        case 'KeyK':
          e.preventDefault();
          setIsPlaying(prev => !prev);
          break;
        case 'KeyL':
          e.preventDefault();
          setIsPlaying(false);
          setActiveWordIdx(prev => Math.min(totalWords - 1, prev + 1));
          break;
        case 'KeyH':
          e.preventDefault();
          setIsPlaying(false);
          setActiveWordIdx(prev => Math.max(0, prev - 1));
          break;
        case 'KeyT':
          e.preventDefault();
          const themes = ['carbon', 'sepia', 'slate', 'terminal'];
          const nextThemeIdx = (themes.indexOf(theme) + 1) % themes.length;
          setTheme(themes[nextThemeIdx]);
          break;
        case 'KeyF':
          e.preventDefault();
          const fonts = ['Lexend', 'OpenDyslexic', 'Inter', 'monospace'];
          const nextFontIdx = (fonts.indexOf(fontFamily) + 1) % fonts.length;
          setFontFamily(fonts[nextFontIdx]);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalWords, theme, fontFamily]);

  // --- Helper to bold first part of word (Bionic Reading) ---
  const renderBionicWord = (wordText, isWordActive, forceBionic) => {
    // If we're in standard reading mode and this word isn't active, just render normally
    if (readingMode === 'standard' && !isWordActive) {
      return wordText;
    }

    // Determine if we should apply bolding. 
    // We apply it if:
    // 1. Reading mode is 'bionic' (always on)
    // 2. Reading mode is 'focus' and this word is currently the active one
    const shouldBold = forceBionic || (readingMode === 'bionic') || (readingMode === 'focus' && isWordActive);

    if (!shouldBold) {
      return wordText;
    }

    const len = wordText.length;
    // Bolding factor based on bold strength state (e.g. 40% -> 0.4)
    const factor = boldStrength / 100;
    
    // Bold at least 1 character. For 2-3 letter words, bold 1-2.
    let boldLen = Math.max(1, Math.round(len * factor));
    if (len === 2) boldLen = 1;
    if (len === 3) boldLen = Math.round(3 * factor) || 1;

    const boldPart = wordText.slice(0, boldLen);
    const restPart = wordText.slice(boldLen);

    return (
      <>
        <span className="anchor-bold">{boldPart}</span>
        <span className="anchor-rest">{restPart}</span>
      </>
    );
  };

  // --- Word count helper ---
  const getWordCount = (txt) => {
    if (!txt) return 0;
    const clean = txt.trim();
    if (!clean) return 0;
    const matches = clean.match(/[a-zA-Z0-9'\u00C0-\u017F]+/g);
    return matches ? matches.length : 0;
  };

  // --- Document Deletion Handler ---
  const handleDeleteDocument = (docId, e) => {
    e.stopPropagation(); // Prevent choosing the document on click
    
    // Check if we are deleting the active document
    if (activeDocId === docId) {
      const remaining = documents.filter(d => d.id !== docId);
      if (remaining.length > 0) {
        setActiveDocId(remaining[0].id);
      } else {
        setActiveDocId(null);
        setText('');
        setActiveWordIdx(0);
      }
    }
    
    setDocuments(prev => prev.filter(d => d.id !== docId));
    setIsPlaying(false);
  };

  // --- Restore Default Samples Handler ---
  const handleRestoreDefaults = () => {
    const defaultDocs = [
      {
        id: 'sample-1',
        name: "The Science of Reading & Dyslexia",
        text: SAMPLES[0].text,
        activeWordIdx: 0
      },
      {
        id: 'sample-2',
        name: "Alice's Adventures in Wonderland",
        text: SAMPLES[1].text,
        activeWordIdx: 0
      },
      {
        id: 'sample-3',
        name: "Software Architecture & Clean Code",
        text: SAMPLES[2].text,
        activeWordIdx: 0
      }
    ];
    setDocuments(defaultDocs);
    setActiveDocId('sample-1');
    setIsPlaying(false);
  };

  // --- File Upload Handler ---
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const newDocId = `doc-${Date.now()}`;
      const newDoc = {
        id: newDocId,
        name: file.name,
        text: content,
        activeWordIdx: 0
      };
      setDocuments(prev => [...prev, newDoc]);
      setActiveDocId(newDocId);
      setIsPlaying(false);
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type === "text/plain" || file.name.toLowerCase().endsWith('.txt'))) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        const newDocId = `doc-${Date.now()}`;
        const newDoc = {
          id: newDocId,
          name: file.name,
          text: content,
          activeWordIdx: 0
        };
        setDocuments(prev => [...prev, newDoc]);
        setActiveDocId(newDocId);
        setIsPlaying(false);
      };
      reader.readAsText(file);
    }
  };

  // --- Time remaining calculation ---
  const minutesRemaining = useMemo(() => {
    if (totalWords <= 0) return 0;
    const wordsLeft = Math.max(0, totalWords - activeWordIdx);
    return Math.ceil(wordsLeft / wpm);
  }, [totalWords, activeWordIdx, wpm]);

  // --- Map font CSS family ---
  const getFontFamilyCSS = () => {
    switch(fontFamily) {
      case 'OpenDyslexic':
        return "'OpenDyslexic', sans-serif";
      case 'Lexend':
        return "'Lexend', sans-serif";
      case 'Inter':
        return "'Inter', sans-serif";
      case 'monospace':
        return "'Fira Code', monospace";
      default:
        return "system-ui, sans-serif";
    }
  };

  return (
    <div className={`app-container theme-${theme}`}>
      {/* Sidebar (Settings & Files) */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="brand">
            <BookOpen size={20} className="brand-icon" />
            <span>AnchorRead</span>
          </div>
          <button className="btn-icon-only" onClick={() => setSidebarCollapsed(true)} title="Collapse sidebar">
            <ChevronLeft size={16} />
          </button>
        </div>

        <div className="sidebar-content">
          {/* Document Library */}
          <div className="sidebar-section">
            <span className="section-title">Document Library</span>
            
            {/* Compact Drag & Drop zone */}
            <div 
              className="file-dropzone"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input').click()}
              style={{ padding: '16px 12px', gap: '4px' }}
            >
              <Upload size={16} className="file-dropzone-icon" />
              <span className="file-dropzone-text" style={{ fontSize: '0.75rem' }}>Upload or Drag & Drop .txt</span>
              <input 
                id="file-input"
                type="file" 
                accept=".txt" 
                onChange={handleFileUpload} 
                style={{ display: 'none' }} 
              />
            </div>

            <div className="sample-list" style={{ marginTop: '8px' }}>
              {documents.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '12px', color: 'var(--text-muted)', fontSize: '0.75rem', border: '1px dashed var(--border)', borderRadius: '6px' }}>
                  <span style={{ display: 'block', marginBottom: '8px' }}>No documents loaded</span>
                  <button 
                    onClick={handleRestoreDefaults} 
                    className="btn" 
                    style={{ width: '100%', fontSize: '0.7rem', padding: '6px' }}
                  >
                    <RefreshCw size={10} />
                    Load Default Samples
                  </button>
                </div>
              ) : (
                documents.map((doc) => {
                  const wordsCount = getWordCount(doc.text);
                  const progressPercent = wordsCount > 0 
                    ? Math.round((doc.activeWordIdx / (wordsCount - 1 || 1)) * 100) 
                    : 0;
                  const isActive = doc.id === activeDocId;
                  
                  return (
                    <div 
                      key={doc.id} 
                      className={`sample-item ${isActive ? 'active' : ''}`}
                      onClick={() => {
                        setActiveDocId(doc.id);
                        setIsPlaying(false);
                      }}
                      style={{ position: 'relative', overflow: 'hidden', padding: '10px 12px' }}
                    >
                      <div className="sample-info" style={{ width: 'calc(100% - 22px)' }}>
                        <span 
                          className="sample-name" 
                          style={{ 
                            display: 'block', 
                            textOverflow: 'ellipsis', 
                            overflow: 'hidden', 
                            whiteSpace: 'nowrap',
                            fontSize: '0.8rem',
                            fontWeight: isActive ? 600 : 500
                          }}
                          title={doc.name}
                        >
                          {doc.name}
                        </span>
                        <span 
                          className="sample-desc" 
                          style={{ 
                            fontSize: '0.65rem', 
                            display: 'flex', 
                            gap: '4px', 
                            alignItems: 'center',
                            color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)'
                          }}
                        >
                          <span>{progressPercent}% read</span>
                          <span>•</span>
                          <span>{wordsCount} words</span>
                        </span>
                        
                        {/* Compact Visual Progress Bar */}
                        <div style={{
                          width: '100%',
                          height: '2px',
                          backgroundColor: 'var(--border)',
                          borderRadius: '1px',
                          marginTop: '6px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${progressPercent}%`,
                            height: '100%',
                            backgroundColor: 'var(--accent)',
                            transition: 'width 0.2s ease'
                          }} />
                        </div>
                      </div>
                      
                      <button 
                        onClick={(e) => handleDeleteDocument(doc.id, e)}
                        className="delete-doc-btn"
                        style={{ 
                          position: 'absolute', 
                          right: '8px', 
                          top: '50%', 
                          transform: 'translateY(-50%)',
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          padding: '4px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Delete document"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Visual Settings Panel */}
          <div className="sidebar-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sliders size={14} className="brand-icon" />
              <span className="section-title" style={{ marginBottom: 0 }}>Visual Settings</span>
            </div>

            {/* Typography Selector */}
            <div className="slider-group" style={{ marginTop: 8 }}>
              <label className="slider-label">Font Family</label>
              <select 
                className="select-input" 
                value={fontFamily} 
                onChange={(e) => setFontFamily(e.target.value)}
              >
                <option value="Lexend">Lexend (Highly Legible)</option>
                <option value="OpenDyslexic">OpenDyslexic (Weighted Bottoms)</option>
                <option value="Inter">Inter (Sleek Sans-Serif)</option>
                <option value="monospace">Fira Code (Developer Mono)</option>
              </select>
              {fontFamily === 'OpenDyslexic' && (
                <span className="font-notice">Loaded OpenDyslexic web font</span>
              )}
            </div>

            {/* Font Size Slider */}
            <div className="slider-group">
              <div className="slider-label">
                <span>Font Size</span>
                <span className="slider-val">{fontSize}px</span>
              </div>
              <input 
                type="range" 
                min="16" 
                max="36" 
                value={fontSize} 
                onChange={(e) => setFontSize(parseInt(e.target.value, 10))} 
                className="slider"
              />
            </div>

            {/* Line Spacing Slider */}
            <div className="slider-group">
              <div className="slider-label">
                <span>Line Spacing</span>
                <span className="slider-val">{lineHeight}x</span>
              </div>
              <input 
                type="range" 
                min="1.4" 
                max="2.6" 
                step="0.1"
                value={lineHeight} 
                onChange={(e) => setLineHeight(parseFloat(e.target.value))} 
                className="slider"
              />
            </div>

            {/* Letter Spacing Slider */}
            <div className="slider-group">
              <div className="slider-label">
                <span>Letter Spacing</span>
                <span className="slider-val">+{letterSpacing}em</span>
              </div>
              <input 
                type="range" 
                min="0.04" 
                max="0.28" 
                step="0.01"
                value={letterSpacing} 
                onChange={(e) => setLetterSpacing(parseFloat(e.target.value))} 
                className="slider"
              />
            </div>

            {/* Line Width Slider */}
            <div className="slider-group">
              <div className="slider-label">
                <span>Line Max Width</span>
                <span className="slider-val">{lineWidth}ch</span>
              </div>
              <input 
                type="range" 
                min="45" 
                max="80" 
                value={lineWidth} 
                onChange={(e) => setLineWidth(parseInt(e.target.value, 10))} 
                className="slider"
              />
            </div>

            {/* Bolding Strength (Bionic factor) */}
            <div className="slider-group">
              <div className="slider-label">
                <span>Bold Strength</span>
                <span className="slider-val">{boldStrength}%</span>
              </div>
              <input 
                type="range" 
                min="20" 
                max="75" 
                step="5"
                value={boldStrength} 
                onChange={(e) => setBoldStrength(parseInt(e.target.value, 10))} 
                className="slider"
              />
            </div>

            {/* Hover Track Toggle */}
            <div className="toggle-group" style={{ marginTop: 6 }}>
              <span className="toggle-label">Hover word selection</span>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={hoverTrack} 
                  onChange={(e) => setHoverTrack(e.target.checked)} 
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          {/* Theme Switcher */}
          <div className="sidebar-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Layers size={14} className="brand-icon" />
              <span className="section-title" style={{ marginBottom: 0 }}>Color Theme</span>
            </div>
            <div className="btn-group-grid" style={{ marginTop: 8 }}>
              <button 
                onClick={() => setTheme('carbon')} 
                className={`theme-swatch active-carbon ${theme === 'carbon' ? 'active' : ''}`}
                style={{ backgroundColor: '#12131a', color: '#f1f5f9' }}
              >
                Carbon (D)
              </button>
              <button 
                onClick={() => setTheme('sepia')} 
                className={`theme-swatch active-sepia ${theme === 'sepia' ? 'active' : ''}`}
                style={{ backgroundColor: '#F3EAD8', color: '#3E2F1E' }}
              >
                Sepia (W)
              </button>
              <button 
                onClick={() => setTheme('terminal')} 
                className={`theme-swatch active-terminal ${theme === 'terminal' ? 'active' : ''}`}
                style={{ backgroundColor: '#0d120d', color: '#39FF14' }}
              >
                Terminal
              </button>
              <button 
                onClick={() => setTheme('slate')} 
                className={`theme-swatch active-slate ${theme === 'slate' ? 'active' : ''}`}
                style={{ backgroundColor: '#F0EFF0', color: '#1C1C1E' }}
              >
                Slate (L)
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="main-content">
        {/* Top Control Bar */}
        <header className="top-bar">
          <div className="top-bar-left">
            {sidebarCollapsed && (
              <button className="btn-icon-only" onClick={() => setSidebarCollapsed(false)} title="Show sidebar">
                <ChevronRight size={16} />
              </button>
            )}
            
            {/* Reading Mode Switcher */}
            <div style={{ display: 'flex', gap: 6, backgroundColor: 'var(--bg-secondary)', padding: 3, borderRadius: 8, border: '1px solid var(--border)' }}>
              <button 
                className={`btn ${readingMode === 'focus' ? 'active' : ''}`} 
                onClick={() => setReadingMode('focus')}
                style={{ padding: '6px 12px', fontSize: '0.8rem', border: 'none' }}
                title="Only bolds and highlights the active word, dimming other text."
              >
                <Eye size={14} />
                Focus Mode
              </button>
              <button 
                className={`btn ${readingMode === 'bionic' ? 'active' : ''}`} 
                onClick={() => setReadingMode('bionic')}
                style={{ padding: '6px 12px', fontSize: '0.8rem', border: 'none' }}
                title="Bolds the start of every word to guide the eye across paragraphs."
              >
                <Activity size={14} />
                Bionic Anchor
              </button>
              <button 
                className={`btn ${readingMode === 'standard' ? 'active' : ''}`} 
                onClick={() => setReadingMode('standard')}
                style={{ padding: '6px 12px', fontSize: '0.8rem', border: 'none' }}
                title="Standard text view with custom letter spacing and line heights."
              >
                <FileText size={14} />
                Standard
              </button>
            </div>
          </div>

          <div className="top-bar-right">
            {totalWords > 0 && (
              <>
                <div className="stats-badge">
                  {minutesRemaining} min left
                </div>
                <div className="stats-badge">
                  {activeWordIdx} / {totalWords} words
                </div>
              </>
            )}
            <button 
              className={`btn-icon-only ${showShortcuts ? 'active' : ''}`}
              onClick={() => setShowShortcuts(!showShortcuts)}
              title="Keyboard Shortcuts Guide"
            >
              <HelpCircle size={16} />
            </button>
          </div>
        </header>

        {/* Central Reading Canvas */}
        <div 
          className="reading-container" 
          ref={readingContainerRef}
        >
          {text.trim() === '' ? (
            <div className="empty-state">
              <div className="welcome-logo">
                <BookOpen size={32} />
              </div>
              <h1 className="welcome-title">AnchorRead</h1>
              <p className="welcome-subtitle">
                An visual assistance reader styled for software engineers and deep focus. Upload a text file (.txt) or choose one of our libraries to begin.
              </p>
              <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                <button className="btn" onClick={() => document.getElementById('file-input-empty').click()}>
                  <Upload size={16} />
                  Upload Text File
                </button>
                <button className="btn" onClick={handleRestoreDefaults}>
                  <RefreshCw size={16} />
                  Load Default Samples
                </button>
              </div>
              <input 
                id="file-input-empty"
                type="file" 
                accept=".txt" 
                onChange={handleFileUpload} 
                style={{ display: 'none' }} 
              />
            </div>
          ) : (
            <div 
              className={`reading-canvas ${readingMode === 'focus' ? 'focus-active' : ''}`}
              style={{
                fontFamily: getFontFamilyCSS(),
                fontSize: `${fontSize}px`,
                lineHeight: lineHeight,
                letterSpacing: `${letterSpacing}em`,
                maxWidth: `${lineWidth}ch`,
              }}
            >
              {paragraphsData.map((paragraph) => (
                <div key={paragraph.id} className="paragraph-block">
                  {paragraph.tokens.map((token) => {
                    if (token.isWord) {
                      const isWordActive = token.wordIdx === activeWordIdx;
                      return (
                        <span 
                          key={token.id} 
                          className={`word-token ${isWordActive ? 'active-word' : ''}`}
                          data-word-idx={token.wordIdx}
                          onClick={() => {
                            setActiveWordIdx(token.wordIdx);
                            setIsPlaying(false);
                          }}
                          onMouseEnter={() => {
                            if (hoverTrack) {
                              setActiveWordIdx(token.wordIdx);
                            }
                          }}
                        >
                          {renderBionicWord(token.text, isWordActive, false)}
                        </span>
                      );
                    } else {
                      return (
                        <span key={token.id} className="punctuation-token">
                          {token.text}
                        </span>
                      );
                    }
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Playback & Progress Controls */}
        <footer className="bottom-controls">
          <div className="player-controls">
            <button 
              className="btn" 
              onClick={() => setIsPlaying(!isPlaying)}
              style={{ borderRadius: '50%', width: 42, height: 42, padding: 0 }}
              disabled={totalWords === 0}
              title={isPlaying ? "Pause autoplay (Space)" : "Start autoplay (Space)"}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>

            <button 
              className="btn" 
              onClick={() => {
                setActiveWordIdx(0);
                setIsPlaying(false);
              }}
              style={{ borderRadius: '50%', width: 42, height: 42, padding: 0 }}
              disabled={totalWords === 0}
              title="Reset progress to beginning"
            >
              <RotateCcw size={16} />
            </button>

            <div className="wpm-selector">
              <span>WPM:</span>
              <button 
                className="btn-icon-only" 
                onClick={() => setWpm(prev => Math.max(80, prev - 10))}
                style={{ padding: 4 }}
                title="Decrease speed (ArrowDown)"
              >
                <Minus size={12} />
              </button>
              <span style={{ minWidth: 36, textAlign: 'center' }}>{wpm}</span>
              <button 
                className="btn-icon-only" 
                onClick={() => setWpm(prev => Math.min(600, prev + 10))}
                style={{ padding: 4 }}
                title="Increase speed (ArrowUp)"
              >
                <Plus size={12} />
              </button>
            </div>
          </div>

          {totalWords > 0 && (
            <div className="progress-container">
              <span>{Math.round((activeWordIdx / (totalWords - 1 || 1)) * 100)}%</span>
              <div 
                className="progress-track"
                onClick={(e) => {
                  const track = e.currentTarget;
                  const rect = track.getBoundingClientRect();
                  const percentage = (e.clientX - rect.left) / rect.width;
                  const targetIdx = Math.floor(percentage * (totalWords - 1));
                  setActiveWordIdx(Math.max(0, Math.min(totalWords - 1, targetIdx)));
                  setIsPlaying(false);
                }}
                style={{ cursor: 'pointer' }}
              >
                <div 
                  className="progress-fill" 
                  style={{ width: `${(activeWordIdx / (totalWords - 1 || 1)) * 100}%` }}
                />
              </div>
              <span>End</span>
            </div>
          )}
        </footer>

        {/* Keyboard Shortcuts Overlay Panel */}
        {showShortcuts && (
          <div className="shortcuts-panel">
            <div className="shortcuts-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Keyboard Shortcuts</span>
              <button 
                onClick={() => setShowShortcuts(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={14} />
              </button>
            </div>
            <div className="shortcut-row">
              <span>Play / Pause</span>
              <span className="shortcut-key">Space</span>
            </div>
            <div className="shortcut-row">
              <span>Next word</span>
              <span className="shortcut-key">Right Arrow</span>
            </div>
            <div className="shortcut-row">
              <span>Previous word</span>
              <span className="shortcut-key">Left Arrow</span>
            </div>
            <div className="shortcut-row">
              <span>Increase speed (+10 WPM)</span>
              <span className="shortcut-key">Up Arrow</span>
            </div>
            <div className="shortcut-row">
              <span>Decrease speed (-10 WPM)</span>
              <span className="shortcut-key">Down Arrow</span>
            </div>
            <div className="shortcut-row">
              <span>Cycle color themes</span>
              <span className="shortcut-key">T</span>
            </div>
            <div className="shortcut-row">
              <span>Cycle font families</span>
              <span className="shortcut-key">F</span>
            </div>
            <div className="shortcut-row">
              <span>Reset to start</span>
              <span className="shortcut-key">Esc</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

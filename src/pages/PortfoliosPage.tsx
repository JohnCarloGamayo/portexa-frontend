import { useEffect, useRef, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  FileText,
  Layers,
  Loader2,
  Trash2,
  UploadCloud,
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';

type ExperienceItem = {
  title: string;
  company: string;
  period: string;
};

type CollectionItem = {
  title: string;
  subtitle: string;
  accent: string;
  metric: string;
};

type ResumeIndex = {
  fileName: string;
  sourceType: string;
  indexedAt: string;
  name: string;
  summary: string;
  experience: ExperienceItem[];
  education: string[];
  skills: string[];
  rawText: string;
};

type ResumeStructureResponse = ResumeIndex;

type ResumeLibraryItem = ResumeIndex & {
  id: string;
  sizeBytes: number;
  isActive: boolean;
};

type ResumeLibraryResponse = {
  active_id: string | null;
  items: ResumeLibraryItem[];
};

type ManualInfoEntry = {
  id: string;
  label: string;
  date: string;
  description: string;
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const API_BASE = 'http://127.0.0.1:8000/api/v1';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const defaultCollections: CollectionItem[] = [
  {
    title: 'Product Lead Candidates',
    subtitle: 'Curated list of senior professionals specializing in AI-driven interface design.',
    accent: 'bg-brand-600',
    metric: 'Primary Target',
  },
  {
    title: 'Engineering',
    subtitle: '12 Active Resumes',
    accent: 'bg-brand-50 text-brand-600 border border-brand-100/50',
    metric: '12 Active Resumes',
  },
  {
    title: 'Growth & Analytics',
    subtitle: '5 Active Resumes',
    accent: 'bg-slate-100 border border-slate-200/50',
    metric: '5 Active Resumes',
  },
];

function getCollectionsFromIndex(index: ResumeIndex): CollectionItem[] {
  return [
    {
      title: index.name,
      subtitle: index.summary,
      accent: 'bg-brand-600',
      metric: 'Live RAG',
    },
    ...defaultCollections.slice(0, 2),
  ];
}

function toResumeIndexFromLibraryItem(item: ResumeLibraryItem): ResumeIndex {
  return {
    fileName: item.fileName,
    sourceType: item.sourceType,
    indexedAt: item.indexedAt,
    name: item.name,
    summary: item.summary,
    experience: item.experience,
    education: item.education,
    skills: item.skills,
    rawText: item.rawText,
  };
}

function formatProgressLabel(extractionProgress: number, isProcessing: boolean) {
  if (isProcessing) {
    return 'Loading';
  }

  if (extractionProgress >= 100) {
    return 'Done';
  }

  return 'Processing';
}

function createManualInfoEntry() {
  return {
    id: crypto.randomUUID(),
    label: '',
    date: '',
    description: '',
  } satisfies ManualInfoEntry;
}

function cleanLines(text: string) {
  return text
    .replace(/\r/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function looksLikeName(line: string) {
  return /^[A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z'.-]+){1,3}$/.test(line) && line.length <= 50;
}

function extractSkills(lines: string[]) {
  const skillsSectionIndex = lines.findIndex((line) => /skills?|technologies?|tools?/i.test(line));
  if (skillsSectionIndex >= 0) {
    const skillCandidates = lines.slice(skillsSectionIndex + 1, skillsSectionIndex + 6).join(', ');
    const skills = skillCandidates
      .split(/[,•|/]/)
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 1)
      .slice(0, 8);

    if (skills.length > 0) {
      return skills;
    }
  }

  const commaLine = lines.find((line) => line.includes(',') && line.split(',').length >= 3);
  if (commaLine) {
    return commaLine.split(',').map((skill) => skill.trim()).filter(Boolean).slice(0, 8);
  }

  return ['Resume Parsing', 'RAG Indexing', 'Portfolio Automation'];
}

function extractEducation(lines: string[]) {
  const educationIndex = lines.findIndex((line) => /education|academic/i.test(line));
  const educationSlice = educationIndex >= 0 ? lines.slice(educationIndex + 1, educationIndex + 5) : [];
  const matches = educationSlice.filter((line) => /(university|college|school|institute|bachelor|master|mba|mfa|bs|ba|degree)/i.test(line));

  if (matches.length > 0) {
    return matches.slice(0, 3);
  }

  const degreeLine = lines.find((line) => /(bachelor|master|mba|mfa|degree|university|school)/i.test(line));
  return degreeLine ? [degreeLine] : ['Education details detected from uploaded resume.'];
}

function extractExperience(lines: string[]) {
  const experiences: ExperienceItem[] = [];
  let lastTitleCandidate = '';

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const yearMatch = line.match(/((?:19|20)\d{2})\s*(?:-|–|—|to)\s*(Present|(?:19|20)\d{2})/i);

    if (!yearMatch && line.length < 80 && !/^(experience|education|skills?|summary|profile)$/i.test(line)) {
      lastTitleCandidate = line;
      continue;
    }

    if (yearMatch) {
      const title = lastTitleCandidate || 'Professional Role';
      const company = line.replace(yearMatch[0], '').replace(/[•|-]/g, '').trim() || 'Organization';
      experiences.push({
        title,
        company,
        period: `${yearMatch[1]} — ${yearMatch[2]}`,
      });
      lastTitleCandidate = '';
    }
  }

  if (experiences.length > 0) {
    return experiences.slice(0, 4);
  }

  const candidateLines = lines.filter((line) => /experience|employment|career/i.test(line));
  if (candidateLines.length > 0) {
    return [
      {
        title: 'Experience Detected',
        company: candidateLines[0],
        period: 'Parsed from resume',
      },
    ];
  }

  return [
    {
      title: 'Indexed Resume',
      company: 'Ready for AI retrieval',
      period: 'Parsed automatically',
    },
  ];
}

function buildIndex(text: string, fileName: string, sourceType: string): ResumeIndex {
  const lines = cleanLines(text);
  const nameLine = lines.find(looksLikeName) || lines[0] || 'Untitled Candidate';
  const experience = extractExperience(lines);
  const education = extractEducation(lines);
  const skills = extractSkills(lines);
  const summary = lines.slice(0, 5).join(' ').slice(0, 280) || 'Resume indexed successfully.';

  return {
    fileName,
    sourceType,
    indexedAt: new Date().toISOString(),
    name: nameLine,
    summary,
    experience,
    education,
    skills,
    rawText: text,
  };
}

async function structureResumeWithAI(fileName: string, sourceType: string, rawText: string) {
  const response = await fetch('http://127.0.0.1:8000/api/v1/ai/structure-resume', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      file_name: fileName,
      source_type: sourceType,
      raw_text: rawText,
    }),
  });

  const data = (await response.json()) as ResumeStructureResponse & { detail?: string };

  if (!response.ok) {
    throw new Error(data.detail || 'Unable to structure resume with AI');
  }

  return data;
}

function toResumeIndex(data: Partial<ResumeIndex> & {
  file_name?: string;
  source_type?: string;
  indexed_at?: string;
  raw_text?: string;
  fileName?: string;
  sourceType?: string;
  indexedAt?: string;
  rawText?: string;
}): ResumeIndex {
  return {
    fileName: data.fileName || data.file_name || 'Resume',
    sourceType: data.sourceType || data.source_type || 'unknown',
    indexedAt: data.indexedAt || data.indexed_at || new Date().toISOString(),
    name: data.name || 'Untitled Candidate',
    summary: data.summary || 'Resume indexed successfully.',
    experience: data.experience || [],
    education: data.education || [],
    skills: data.skills || [],
    rawText: data.rawText || data.raw_text || '',
  };
}

async function readTextFile(file: File) {
  if (file.type === 'text/plain' || /\.(txt|md|csv)$/i.test(file.name)) {
    return file.text();
  }

  if (file.type === 'application/pdf' || /\.pdf$/i.test(file.name)) {
    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    const pages: string[] = [];

    for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex += 1) {
      const page = await pdf.getPage(pageIndex);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item: any) => ('str' in item ? item.str : ''))
        .join(' ');
      pages.push(pageText);
    }

    return pages.join('\n');
  }

  if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || /\.docx$/i.test(file.name)) {
    const buffer = await file.arrayBuffer();
    const mammothModule = await import('mammoth/mammoth.browser.js');
    const result = await mammothModule.extractRawText({ arrayBuffer: buffer });
    return result.value;
  }

  return file.text();
}

const PortfoliosPage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadMessage, setUploadMessage] = useState('Drag, browse, or paste a resume to build the AI index.');
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [collections, setCollections] = useState<CollectionItem[]>(defaultCollections);
  const [savedResumes, setSavedResumes] = useState<ResumeLibraryItem[]>([]);
  const [activeResumeId, setActiveResumeId] = useState<string | null>(null);
  const [resumeIndex, setResumeIndex] = useState<ResumeIndex>({
    fileName: 'Resume_2024.pdf',
    sourceType: 'Sample index',
    indexedAt: new Date().toISOString(),
    name: 'Juan Dela Cruz',
    summary: 'Sample profile indexed for preview. Upload a new resume to replace this content.',
    experience: [
      { title: 'Senior UX Designer', company: 'TechFlow Ecosystems', period: '2021 — Present' },
      { title: 'Product Architect', company: 'Studio Bloom', period: '2018 — 2021' },
    ],
    education: ['MFA Interaction Design', 'Rhode Island School of Design'],
    skills: ['User Research', 'System Design', 'React Native', 'Figma Pro'],
    rawText: '',
  });
  const [manualInfoEntries, setManualInfoEntries] = useState<ManualInfoEntry[]>([createManualInfoEntry()]);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmingPortfolio, setIsConfirmingPortfolio] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const loadLibrary = async () => {
      if (!token) {
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/resumes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as ResumeLibraryResponse;
        setSavedResumes(data.items || []);
        setActiveResumeId(data.active_id);

        const activeItem = (data.items || []).find((item) => item.id === data.active_id) || data.items?.[0];
        if (activeItem) {
          const activeIndex = toResumeIndexFromLibraryItem(activeItem);
          setResumeIndex(activeIndex);
          setUploadMessage(`Loaded ${activeIndex.fileName} from your saved AI library.`);
          setCollections(getCollectionsFromIndex(activeIndex));
          setExtractionProgress(100);
          localStorage.setItem('portexa_rag_index', JSON.stringify(activeIndex));
        } else {
          setExtractionProgress(0);
        }
      } catch {
        // Fallback to localStorage only if backend call fails
        const saved = localStorage.getItem('portexa_rag_index');
        if (saved) {
          try {
            const parsed = JSON.parse(saved) as ResumeIndex;
            setResumeIndex(parsed);
            setUploadMessage(`Loaded ${parsed.fileName} from your saved AI index.`);
            setCollections(getCollectionsFromIndex(parsed));
            setExtractionProgress(100);
          } catch {
            localStorage.removeItem('portexa_rag_index');
            setExtractionProgress(0);
          }
        }
      }
    };

    void loadLibrary();
  }, []);

  const persistIndex = (index: ResumeIndex) => {
    localStorage.setItem('portexa_rag_index', JSON.stringify(index));
  };

  const saveResumeToLibrary = async (file: File, index: ResumeIndex) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('index_json', JSON.stringify(index));

    const response = await fetch(`${API_BASE}/resumes`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const detail = await response.json().catch(() => null) as { detail?: string } | null;
      throw new Error(detail?.detail || 'Unable to save resume to the library');
    }

    const data = (await response.json()) as ResumeLibraryItem;
    setActiveResumeId(data.id);
  };

  const reloadLibrary = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    const response = await fetch(`${API_BASE}/resumes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return;
    }

    const data = (await response.json()) as ResumeLibraryResponse;
    setSavedResumes(data.items || []);
    setActiveResumeId(data.active_id);

    const activeItem = (data.items || []).find((item) => item.id === data.active_id) || data.items?.[0];
    if (activeItem) {
      const activeIndex = toResumeIndexFromLibraryItem(activeItem);
      setResumeIndex(activeIndex);
      setCollections(getCollectionsFromIndex(activeIndex));
      setUploadMessage(`Loaded ${activeIndex.fileName} from your saved AI library.`);
      persistIndex(activeIndex);
    } else {
      // No resumes left, reset to default state
      setResumeIndex({
        fileName: 'Resume_2024.pdf',
        sourceType: 'Sample index',
        indexedAt: new Date().toISOString(),
        name: 'Juan Dela Cruz',
        summary: 'Sample profile indexed for preview. Upload a new resume to replace this content.',
        experience: [
          { title: 'Senior UX Designer', company: 'TechFlow Ecosystems', period: '2021 — Present' },
          { title: 'Product Architect', company: 'Studio Bloom', period: '2018 — 2021' },
        ],
        education: ['MFA Interaction Design', 'Rhode Island School of Design'],
        skills: ['User Research', 'System Design', 'React Native', 'Figma Pro'],
        rawText: '',
      });
      setCollections(defaultCollections);
      setUploadMessage('Drag, browse, or paste a resume to build the AI index.');
    }
  };

  const deleteResumeFromLibrary = async (entryId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`${API_BASE}/resumes/${entryId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const detail = await response.json().catch(() => null) as { detail?: string } | null;
        setErrorMessage(detail?.detail || 'Unable to delete resume');
        setIsDeleting(false);
        return;
      }

      await reloadLibrary();
      setDeleteConfirmationId(null);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'An error occurred while deleting');
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmAndCreatePortfolio = async () => {
    if (!activeResumeId) {
      setErrorMessage('Select or upload a resume first before creating a portfolio.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMessage('Your session has expired. Please login again.');
      return;
    }

    setIsConfirmingPortfolio(true);
    setErrorMessage('');
    try {
      const response = await fetch(`${API_BASE}/resumes/${activeResumeId}/activate`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const detail = await response.json().catch(() => null) as { detail?: string } | null;
        throw new Error(detail?.detail || 'Unable to activate resume for portfolio creation');
      }

      await reloadLibrary();
      setUploadMessage('Portfolio confirmed. This resume is now your active RAG source.');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to confirm portfolio right now.');
    } finally {
      setIsConfirmingPortfolio(false);
    }
  };

  const processFile = async (file: File) => {
    setErrorMessage('');

    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage('File is too large. Please upload a file smaller than 10MB.');
      return;
    }

    setIsProcessing(true);
    setExtractionProgress(18);

    try {
      const text = await readTextFile(file);
      setExtractionProgress(72);

      const index = toResumeIndex(
        await structureResumeWithAI(file.name, file.type || 'unknown', text).catch(() =>
          buildIndex(text, file.name, file.type || 'unknown'),
        ),
      );
      setResumeIndex(index);
      persistIndex(index);
      setExtractionProgress(100);
      setUploadMessage(`Indexed ${file.name}. Saving it to your private AI library.`);
      setCollections(getCollectionsFromIndex(index));
      void saveResumeToLibrary(file, index)
        .then(() => reloadLibrary())
        .catch((saveError) => {
          setErrorMessage(saveError instanceof Error ? saveError.message : 'Unable to sync the saved file to your library.');
        });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to read the uploaded file.');
      setExtractionProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    await processFile(file);
    event.target.value = '';
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file) {
      return;
    }

    await processFile(file);
  };

  const handleManualInfoProcess = async () => {
    const normalizedEntries = manualInfoEntries
      .map((entry) => ({
        label: entry.label.trim(),
        date: entry.date.trim(),
        description: entry.description.trim(),
      }))
      .filter((entry) => entry.label || entry.date || entry.description);

    if (normalizedEntries.length === 0) {
      setErrorMessage('Add at least one information row first.');
      setExtractionProgress(0);
      return;
    }

    const text = normalizedEntries
      .map((entry) => [
        `Label: ${entry.label || 'General Information'}`,
        entry.date ? `Date: ${entry.date}` : '',
        entry.description ? `Description: ${entry.description}` : '',
      ].filter(Boolean).join('\n'))
      .join('\n\n');

    setIsProcessing(true);
    setExtractionProgress(58);
    setErrorMessage('');
    
    try {
      const index = toResumeIndex(
        await structureResumeWithAI('Manual Information Source', 'manual-entry', text).catch(() =>
          buildIndex(text, 'Manual Information Source', 'manual-entry'),
        ),
      );
      const manualInfoFile = new File([text], 'Manual Information Source.txt', { type: 'text/plain' });
      setResumeIndex(index);
      persistIndex(index);
      setUploadMessage('Manual information indexed. Saving it to your private AI library.');
      setCollections(getCollectionsFromIndex(index));
      setExtractionProgress(100);
      
      try {
        await saveResumeToLibrary(manualInfoFile, index);
        await reloadLibrary();
      } catch (saveError) {
        setErrorMessage(saveError instanceof Error ? saveError.message : 'Unable to sync the manual information to your library.');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to process manual information. Please try again.');
      setExtractionProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  const isExtractionComplete = extractionProgress >= 100 && !isProcessing;
  const progressLabel = formatProgressLabel(extractionProgress, isProcessing);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Resume Library</h1>
        <p className="text-slate-500 font-medium">
          Upload a resume or enter structured information to update the active AI source. Saved files stay in your private library below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-brand-100 bg-gradient-to-br from-brand-50 via-white to-brand-50/30 p-8 shadow-sm">
            <div className="flex items-start justify-between gap-6 mb-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-brand-700 mb-4">
                  Add New Resume
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">Upload a source or add information</h2>
                <p className="text-slate-500 font-medium max-w-xl leading-relaxed">
                  This adds a new active AI source and refreshes the structured preview. Use the saved files panel below to switch or delete older entries.
                </p>
              </div>
              <div className="hidden md:flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm border border-brand-100 text-brand-600 shrink-0">
                <UploadCloud className="w-7 h-7" />
              </div>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-brand-200 rounded-[1.75rem] bg-white/80 hover:bg-white transition-colors p-12 flex flex-col items-center justify-center text-center group cursor-pointer"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt,.md"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="w-16 h-16 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center mb-6 group-hover:-translate-y-1 group-hover:scale-110 transition-all duration-300">
                {isProcessing ? <Loader2 className="w-8 h-8 animate-spin" /> : <UploadCloud className="w-8 h-8" />}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Drag and drop your resume</h3>
              <p className="text-slate-500 font-medium mb-8">Support for PDF, DOCX, and TXT up to 10MB</p>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="bg-brand-100 hover:bg-brand-200 text-brand-700 px-6 py-3 rounded-xl font-bold transition-colors"
              >
                Browse Files
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start gap-4 mb-6">
              <div className="flex items-center gap-3 text-slate-700 font-semibold">
                <FileText className="w-5 h-5" />
                <div>
                  <h3 className="text-lg text-slate-900">Add Information</h3>
                  <p className="text-sm text-slate-500 font-medium">Create labeled facts like Experience, Project, Date, and Description.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setManualInfoEntries((previous) => [...previous, createManualInfoEntry()])}
                className="rounded-xl border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-bold text-brand-700 hover:bg-brand-100 transition-colors"
              >
                Add Row
              </button>
            </div>

            <div className="space-y-4">
              {manualInfoEntries.map((entry, index) => (
                <div key={entry.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <span className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Entry {index + 1}</span>
                    {manualInfoEntries.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setManualInfoEntries((previous) => previous.filter((item) => item.id !== entry.id))}
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-[160px_160px_1fr] gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Label</label>
                      <input
                        value={entry.label}
                        onChange={(event) => {
                          const value = event.target.value;
                          setManualInfoEntries((previous) => previous.map((item) => item.id === entry.id ? { ...item, label: value } : item));
                        }}
                        placeholder="Experience"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-brand-300 focus:ring-4 focus:ring-brand-500/10"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Date</label>
                      <input
                        value={entry.date}
                        onChange={(event) => {
                          const value = event.target.value;
                          setManualInfoEntries((previous) => previous.map((item) => item.id === entry.id ? { ...item, date: value } : item));
                        }}
                        placeholder="December 2025 - March 2026"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-brand-300 focus:ring-4 focus:ring-brand-500/10"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Description</label>
                      <input
                        value={entry.description}
                        onChange={(event) => {
                          const value = event.target.value;
                          setManualInfoEntries((previous) => previous.map((item) => item.id === entry.id ? { ...item, description: value } : item));
                        }}
                        placeholder="Built AI resume indexing and structured retrieval"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-brand-300 focus:ring-4 focus:ring-brand-500/10"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between gap-4 mt-6">
              <p className="text-sm text-slate-500 font-medium">These rows are converted into structured text before AI indexing.</p>
              <button
                type="button"
                onClick={() => void handleManualInfoProcess()}
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800 transition-colors disabled:opacity-60"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Execute'}
              </button>
            </div>
          </div>

          <div className="pt-8">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 mb-6">Recent Collections</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {collections.map((collection, index) => (
                <div
                  key={`${collection.title}-${index}`}
                  className={index === 0
                    ? 'md:col-span-2 relative rounded-[2rem] overflow-hidden group cursor-pointer min-h-[240px] flex items-end'
                    : 'rounded-[2rem] p-8 cursor-pointer flex flex-col justify-between min-h-[160px] border transition-colors'}
                >
                  {index === 0 ? (
                    <>
                      <img
                        src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                        alt="Workspace"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
                      <div className="relative z-10 p-8 w-full">
                        <div className="bg-brand-600 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full inline-flex mb-4">
                          {collection.metric}
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">{collection.title}</h3>
                        <p className="text-slate-300 text-sm font-medium">{collection.subtitle}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={`w-10 h-10 rounded-xl ${collection.accent} flex items-center justify-center mb-4`}>
                        {index === 1 ? <Layers className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{collection.title}</h3>
                        <p className="text-slate-500 text-sm mt-1 font-medium">{collection.subtitle}</p>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-5 gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Saved Files</h3>
                <p className="text-sm text-slate-500 font-medium">These files live in your private resume library. You can add more or delete any saved item.</p>
              </div>
            </div>

            <div className="space-y-3">
              {savedResumes.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500 font-medium">
                  No saved resumes yet. Upload one to create your first library entry.
                </div>
              ) : (
                savedResumes.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-2xl border px-4 py-4 flex items-start justify-between gap-4 ${item.isActive ? 'border-brand-200 bg-brand-50/70' : 'border-slate-100 bg-slate-50'}`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        const nextIndex = toResumeIndexFromLibraryItem(item);
                        setActiveResumeId(item.id);
                        setResumeIndex(nextIndex);
                        setCollections(getCollectionsFromIndex(nextIndex));
                        setUploadMessage(`Loaded ${item.fileName} from your saved AI library.`);
                        persistIndex(nextIndex);
                      }}
                      className="text-left flex-1"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-slate-900">{item.fileName}</span>
                        {item.isActive && (
                          <span className="rounded-full bg-brand-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white">Active</span>
                        )}
                      </div>
                      <p className="text-xs font-medium text-slate-500">{item.name} • {new Date(item.indexedAt).toLocaleString()}</p>
                      <p className="mt-2 text-xs font-medium leading-relaxed text-slate-500 line-clamp-2">{item.summary}</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteConfirmationId(item.id)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label={`Delete ${item.fileName}`}
                      disabled={isDeleting}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm sticky top-24">
            <div className="flex justify-between items-start mb-8 gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 leading-tight">Structured <br />Preview</h2>
              </div>
              <div className="bg-brand-50 text-brand-600 rounded-full px-4 py-2 flex items-center gap-2 text-xs font-bold tracking-widest uppercase shrink-0">
                {isExtractionComplete ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span className="w-1.5 h-1.5 rounded-full bg-brand-600 animate-pulse"></span>}
                {isExtractionComplete ? 'AI Parsing Complete' : 'AI Parsing Active'}
              </div>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-slate-700">Extraction progress</span>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest ${isExtractionComplete ? 'bg-emerald-50 text-emerald-700' : 'bg-brand-50 text-brand-700'}`}>
                  {isExtractionComplete ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {progressLabel}
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
                <div
                    className={`h-full rounded-full transition-all duration-1000 relative overflow-hidden ${isExtractionComplete ? 'bg-emerald-500' : 'bg-brand-600'}`}
                  style={{ width: `${extractionProgress}%` }}
                >
                    {!isExtractionComplete && (
                      <div className="absolute inset-0 bg-white/20 -translate-x-full animate-[shimmer_2s_infinite]"></div>
                    )}
                </div>
              </div>
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                  <span className={`flex items-center justify-center gap-1.5 ${extractionProgress >= 40 ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {extractionProgress >= 40 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300"></div>}
                    Identity
                  </span>
                  <span className={`flex items-center justify-center gap-1.5 ${extractionProgress >= 75 ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {extractionProgress >= 75 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300"></div>}
                    Experience
                  </span>
                  <span className={`flex items-center justify-center gap-1.5 ${isExtractionComplete ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {isExtractionComplete ? <CheckCircle2 className="w-3.5 h-3.5" /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300"></div>}
                    Skills
                  </span>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-4">Profile</h3>
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900 mb-1">{resumeIndex.name}</h4>
                  <p className="text-xs text-slate-500 font-medium">{resumeIndex.fileName}</p>
                  <p className="text-xs text-slate-500 font-medium mt-2 leading-relaxed">{resumeIndex.summary}</p>
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-4">Professional Experience</h3>
                <div className="space-y-4">
                  {resumeIndex.experience.map((item) => (
                    <div className="flex gap-4" key={`${item.title}-${item.company}-${item.period}`}>
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-brand-500" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-0.5">{item.title}</h4>
                        <p className="text-xs text-slate-500 font-medium">{item.company} • {item.period}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-4">Education</h3>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2">
                  {resumeIndex.education.map((item) => (
                    <p key={item} className="text-xs text-slate-500 font-medium">{item}</p>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-4">Technical Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {resumeIndex.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {errorMessage && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="button"
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] transition mt-8 disabled:opacity-70"
                disabled={isProcessing || isConfirmingPortfolio}
                onClick={() => void confirmAndCreatePortfolio()}
              >
                {isProcessing ? 'Indexing...' : isConfirmingPortfolio ? 'Confirming...' : 'Confirm & Create Portfolio'}
              </button>
            </div>
          </div>

          <div className="bg-slate-800 rounded-[2rem] p-6 text-white flex gap-4">
            <div className="shrink-0 mt-1">
              <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-1 line-clamp-1">RAG Status</h4>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">{uploadMessage}</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>

      {/* Delete Confirmation Modal */}
      {deleteConfirmationId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-2xl bg-white p-6 shadow-lg max-w-sm mx-4">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Resume?</h3>
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to delete this resume? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setDeleteConfirmationId(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void deleteResumeFromLibrary(deleteConfirmationId)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default PortfoliosPage;
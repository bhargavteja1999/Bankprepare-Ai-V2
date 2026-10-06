import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { documentService } from '../../services/documentService';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import {
  FileUp,
  FileText,
  Trash2,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle,
  FileCode,
  UploadCloud
} from 'lucide-react';
import { BANKING_SUBJECTS } from '../../utils/constants';
import { formatDate, formatFileSize } from '../../utils/formatters';

export default function UploadDocument() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('file'); // 'file' or 'text'
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('General/Banking Awareness');
  const [rawText, setRawText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const docs = await documentService.listDocuments();
      setDocuments(docs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }
    setError('');
    setUploading(true);

    try {
      await documentService.uploadFile(selectedFile, title, subject);
      setSuccess('Document parsed and saved successfully!');
      setSelectedFile(null);
      setTitle('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchDocs();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload and parse document');
    } finally {
      setUploading(false);
    }
  };

  const handleTextUpload = async (e) => {
    e.preventDefault();
    if (!rawText.trim()) {
      setError('Please enter some text content');
      return;
    }
    setError('');
    setUploading(true);

    try {
      await documentService.createTextDocument(title || 'Study Notes', subject, rawText);
      setSuccess('Notes saved and indexed successfully!');
      setRawText('');
      setTitle('');
      fetchDocs();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save notes');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this document?')) return;
    try {
      await documentService.deleteDocument(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      alert('Failed to delete document');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
          <FileUp className="w-7 h-7 text-brand-600" />
          <span>Document Ingestion & Study Material</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Upload PDF chapters, mock test papers, or monthly banking capsules to generate custom quizzes.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Upload Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex border-b border-slate-200 pb-2 gap-4">
          <button
            onClick={() => setActiveTab('file')}
            className={`text-sm font-semibold pb-2 border-b-2 transition ${
              activeTab === 'file'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Upload File (PDF / DOCX / TXT)
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`text-sm font-semibold pb-2 border-b-2 transition ${
              activeTab === 'text'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Paste Study Notes / Text
          </button>
        </div>

        {activeTab === 'file' ? (
          <form onSubmit={handleFileUpload} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Document Title (Optional)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. RBI Monetary Policy Capsule 2026"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Subject Category
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  {BANKING_SUBJECTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-2xl p-8 text-center cursor-pointer bg-slate-50/50 hover:bg-brand-50/20 transition group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center mx-auto text-slate-400 group-hover:text-brand-600 transition mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-800">
                {selectedFile ? selectedFile.name : 'Click to select or drag and drop document'}
              </p>
              <p className="text-xs text-slate-400 mt-1">Supports PDF, DOCX, TXT up to 15MB</p>
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="primary" loading={uploading} icon={FileUp}>
                Process & Ingest Document
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleTextUpload} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Notes Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Quantitative Formulas & DI Concepts"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Subject Category
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  {BANKING_SUBJECTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Study Content
              </label>
              <textarea
                rows={6}
                required
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste your study notes, key terms, formulas, or summaries here..."
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="primary" loading={uploading} icon={FileText}>
                Save Study Notes
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Uploaded Documents List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">
          Your Ingested Documents ({documents.length})
        </h2>

        {loading ? (
          <Loader message="Loading documents..." />
        ) : documents.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-slate-400 text-sm">
            No documents uploaded yet. Upload a document above to get started!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm leading-tight">{doc.title}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">{doc.subject}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {doc.summary && (
                    <p className="text-xs text-slate-500 mt-3 line-clamp-2 bg-slate-50 p-2.5 rounded-xl">
                      {doc.summary}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-slate-400 mt-4">
                    <span>{doc.word_count || 0} Words</span>
                    <span>•</span>
                    <span>{formatFileSize(doc.file_size)}</span>
                    <span>•</span>
                    <span>{formatDate(doc.created_at)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
                  <Link
                    to={`/generate-quiz?document_id=${doc.id}&topic=${encodeURIComponent(doc.title)}&subject=${encodeURIComponent(doc.subject)}`}
                    className="flex-1"
                  >
                    <Button variant="primary" size="sm" icon={Sparkles} className="w-full text-xs">
                      Generate Quiz
                    </Button>
                  </Link>
                  <Link
                    to={`/flashcards?document_id=${doc.id}&topic=${encodeURIComponent(doc.title)}&subject=${encodeURIComponent(doc.subject)}`}
                  >
                    <Button variant="outline" size="sm" icon={Layers} className="text-xs">
                      Flashcards
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

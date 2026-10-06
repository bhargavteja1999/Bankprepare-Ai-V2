import React, { useState } from 'react';
import SubjectCard from './SubjectCard';
import TopicCard from './TopicCard';

export default function SyllabusTree({ syllabusData }) {
  const subjects = syllabusData?.subjects || [];
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || 1);

  const currentSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];

  return (
    <div className="space-y-6">
      {/* Subject Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {subjects.map((sub) => (
          <SubjectCard
            key={sub.id}
            subject={sub}
            isSelected={sub.id === selectedSubjectId}
            onClick={() => setSelectedSubjectId(sub.id)}
          />
        ))}
      </div>

      {/* Selected Subject Topics List */}
      {currentSubject && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {currentSubject.name} — Core Topics
              </h2>
              <p className="text-xs text-slate-500">
                Practice topic-wise high yield questions to maximize exam percentile.
              </p>
            </div>
            <div className="text-xs font-semibold text-brand-600 bg-brand-50 px-3 py-1 rounded-lg self-start sm:self-auto">
              {currentSubject.topics?.length || 0} Key Modules
            </div>
          </div>

          <div className="space-y-3">
            {currentSubject.topics?.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                subjectName={currentSubject.name}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

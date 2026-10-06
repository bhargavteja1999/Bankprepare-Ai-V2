import React, { useState, useEffect } from 'react';
import { quizService } from '../../services/quizService';
import SyllabusTree from '../../components/syllabus/SyllabusTree';
import Loader from '../../components/common/Loader';
import { Map, Target, Sparkles, BookOpen } from 'lucide-react';

export default function Syllabus() {
  const [syllabusData, setSyllabusData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSyllabus = async () => {
      try {
        setLoading(true);
        const data = await quizService.getSyllabus();
        setSyllabusData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSyllabus();
  }, []);

  if (loading) {
    return <Loader message="Loading banking syllabus roadmap..." />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
          <Map className="w-7 h-7 text-brand-600" />
          <span>Banking Exam Syllabus Roadmap</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Structured syllabus for {syllabusData?.exam || 'IBPS & SBI PO'} with topic-wise weightage and direct AI quiz launching.
        </p>
      </div>

      <SyllabusTree syllabusData={syllabusData} />
    </div>
  );
}

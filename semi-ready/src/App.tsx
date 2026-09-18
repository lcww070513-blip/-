import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useApp } from '@/store/store';
import { ErrorState, LoadingState } from '@/components/ui';

import Home from '@/pages/Home';
import BasicsList from '@/pages/BasicsList';
import BasicDetail from '@/pages/BasicDetail';
import ProcessList from '@/pages/ProcessList';
import ProcessDetail from '@/pages/ProcessDetail';
import BackendList from '@/pages/BackendList';
import BackendDetail from '@/pages/BackendDetail';
import EquipmentList from '@/pages/EquipmentList';
import EquipmentDetail from '@/pages/EquipmentDetail';
import Simulation from '@/pages/Simulation';
import JobsList from '@/pages/JobsList';
import JobDetail from '@/pages/JobDetail';
import CompaniesList from '@/pages/CompaniesList';
import CompanyDetail from '@/pages/CompanyDetail';
import InterviewList from '@/pages/InterviewList';
import InterviewDetail from '@/pages/InterviewDetail';
import AnswerBuilder from '@/pages/AnswerBuilder';
import MockInterview from '@/pages/MockInterview';
import Quiz from '@/pages/Quiz';
import WrongNotes from '@/pages/WrongNotes';
import Dashboard from '@/pages/Dashboard';
import Glossary from '@/pages/Glossary';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}

export default function App() {
  const { status, error } = useApp();

  return (
    <Layout>
      <ScrollToTop />
      {status === 'loading' && <LoadingState />}
      {status === 'error' && error && (
        <div style={{ marginBottom: 16 }}>
          <ErrorState message={error} onRetry={() => window.location.reload()} />
        </div>
      )}
      {status !== 'loading' && (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/basics" element={<BasicsList />} />
          <Route path="/basics/:id" element={<BasicDetail />} />
          <Route path="/process" element={<ProcessList />} />
          <Route path="/process/:id" element={<ProcessDetail />} />
          <Route path="/backend" element={<BackendList />} />
          <Route path="/backend/:id" element={<BackendDetail />} />
          <Route path="/equipment" element={<EquipmentList />} />
          <Route path="/equipment/simulation" element={<Simulation />} />
          <Route path="/equipment/:id" element={<EquipmentDetail />} />
          <Route path="/jobs" element={<JobsList />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/companies" element={<CompaniesList />} />
          <Route path="/companies/:id" element={<CompanyDetail />} />
          <Route path="/interview" element={<InterviewList />} />
          <Route path="/interview/builder" element={<AnswerBuilder />} />
          <Route path="/interview/mock" element={<MockInterview />} />
          <Route path="/interview/:id" element={<InterviewDetail />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/wrong-notes" element={<WrongNotes />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
    </Layout>
  );
}

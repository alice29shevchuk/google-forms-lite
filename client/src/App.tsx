import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { FormBuilderPage } from './pages/FormBuilderPage';
import { FormFillPage } from './pages/FormFillPage';
import { FormResponsesPage } from './pages/FormResponsesPage';
import { HomePage } from './pages/HomePage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="forms/new" element={<FormBuilderPage />} />
          <Route path="forms/:id/fill" element={<FormFillPage />} />
          <Route path="forms/:id/responses" element={<FormResponsesPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

import { Link, Outlet } from 'react-router-dom';
import './layout.css';

export function AppLayout() {
  return (
    <div className="app-root">
      <header className="app-header">
        <Link to="/" className="app-brand">
          Forms Lite
        </Link>
        <nav className="app-nav">
          <Link to="/">Форми</Link>
          <Link to="/forms/new" className="app-nav-cta">
            Нова форма
          </Link>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
      <footer className="app-footer">Google Forms Lite — тестове завдання</footer>
    </div>
  );
}

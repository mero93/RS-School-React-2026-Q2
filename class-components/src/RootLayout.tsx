import { Outlet } from 'react-router-dom';
import Header from './components/Header/Header';

export default function RootLayout() {
  return (
    <div className="app-layout-root">
      <Header />
      <main className="app-content-frame">
        <Outlet />
      </main>
    </div>
  );
}

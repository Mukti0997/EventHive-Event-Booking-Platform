import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import useScrollProgress from '../../hooks/useScrollProgress';

const Layout = () => {
  const { progress } = useScrollProgress();

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Ambient Scroll Progress Indicator */}
      <div
        className="scroll-progress-bar"
        style={{ width: `${progress}%` }}
        aria-hidden="true"
      />
      <Navbar />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

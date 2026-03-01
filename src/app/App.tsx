import { RouterProvider } from 'react-router';
import { router } from './routes';
import { ThemeProvider } from './contexts/ThemeContext';
import { MobileShell } from './components/MobileShell';

export default function App() {
  return (
    <ThemeProvider>
      <MobileShell>
        <RouterProvider router={router} />
      </MobileShell>
    </ThemeProvider>
  );
}

import { createBrowserRouter } from 'react-router-dom';
import ItemDetails from '../components/ItemDetails/ItemDetails';
import About from '../pages/About/About';
import Home from '../pages/Home/Home';
import NotFound from '../pages/NotFound/NotFound';
import RootLayout from '../RootLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: '',
        element: <Home />, 
        children: [
          {
            path: '',
            element: <ItemDetails />,
          },
        ],
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

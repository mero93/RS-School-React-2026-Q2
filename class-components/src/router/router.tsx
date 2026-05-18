import { createBrowserRouter } from 'react-router-dom';
import About from '../pages/About/About';
import Home from '../pages/Home/Home';
import NotFound from '../pages/NotFound/NotFound';
import ItemDetails from '../components/ItemDetails/ItemDetails';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <NotFound />,
    children: [
      {
        path: '',
        element: <ItemDetails />,
        errorElement: <NotFound />,
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
]);

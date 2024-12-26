import { FC } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import Index from './routes/Index';
import Viewer from './routes/Viewer';

const App: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Index />} />
        <Route path="/:id" element={<Viewer />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

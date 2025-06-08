import { FC } from 'react';
import { Route, Switch } from 'wouter';

import ThemeProvider from './components/ThemeProvider';
import Footer from './components/ui/Footer';
import Header from './components/ui/Header';
import Index from './routes/index/Index';
import Viewer from './routes/Viewer';

const App: FC = () => {
  return (
    <ThemeProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="grow px-4 sm:mx-auto sm:px-5">
          <Switch>
            <Route path="/:id" component={Viewer} />
            <Route component={Index} />
          </Switch>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default App;

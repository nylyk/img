import { FC } from 'react';
import Index from './routes/index/Index';
import Viewer from './routes/viewer/Viewer';
import { Route, Switch } from 'wouter';
import ThemeProvider from './components/ThemeProvider';
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';

const App: FC = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="px-4 sm:px-5 sm:mx-auto grow">
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

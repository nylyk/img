import { FC } from 'react';
import Index from './routes/index/Index';
import Viewer from './routes/Viewer';
import { Route, Switch } from 'wouter';
import ThemeProvider from './components/ThemeProvider';

const App: FC = () => {
  return (
    <ThemeProvider>
      <Switch>
        <Route path="/:id" component={Viewer} />
        <Route component={Index} />
      </Switch>
    </ThemeProvider>
  );
};

export default App;

import { FC } from 'react';
import Index from './routes/index/Index';
import Viewer from './routes/Viewer';
import { Route, Switch } from 'wouter';

const App: FC = () => {
  return (
    <Switch>
      <Route path="/:id" component={Viewer} />
      <Route component={Index} />
    </Switch>
  );
};

export default App;

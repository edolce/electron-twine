import * as React from 'react';
import { createRoot} from 'react-dom/client';

import Main from './components/Main.jsx';

const root = createRoot(document.body);
root.render(<Main />);
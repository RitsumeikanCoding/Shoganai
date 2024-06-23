import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { App } from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

//ReactDOM.render(
//    <GoogleOAuthProvider clientId="ADD HERE">
//        <React.StrictMode>
//            <App />
//        </React.StrictMode>
//    </GoogleOAuthProvider>, document.getElementById('root'));

ReactDOM.render(<App />, document.getElementById('root'));
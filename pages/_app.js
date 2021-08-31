import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'spectre.css'
import 'spectre.css/dist/spectre-icons.css'
import 'spectre.css/dist/spectre-exp.min.css'
import '../client/styles/layout.scss'
import '../client/styles/styled-scrollbar.scss'
import 'flareact/router'
import { StoreProvider } from '../client/state-persistence/global';

export default function MokerApp({ Component, pageProps }) {
    return (<StoreProvider>
        <Component {...pageProps} />
        <ToastContainer
            position="top-center"
        />
    </StoreProvider>);
}
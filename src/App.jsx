import React, { lazy, Suspense } from 'react';
import { NextUIProvider } from '@nextui-org/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Landing } from './views'
import { Loader } from './components';
import { darkMode } from './components/Navbar';

const MainPage = lazy(() => import('./components/partials/MainPage'));
const Video = lazy(() => import('./components/Video'));

const App = () => {
    return (
        <BrowserRouter>
            <NextUIProvider >

                <Suspense fallback={<Loader darkMode={darkMode} />}>
                    <MainPage>

                        <Routes>
                            <Route path="/" element={<Landing />} />
                            <Route path="/distubify" element={<Landing />} />
                            <Route path="/home" element={<Landing />} />
                            <Route path="/distubify/home" element={<Landing />} />
                            <Route path="/v/:id" element={<Video />} />
                        </Routes>
                    </MainPage>
                </Suspense>

            </NextUIProvider>
        </BrowserRouter>
    )
};

export default App;
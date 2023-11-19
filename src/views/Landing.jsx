import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Loader } from '../components';

const Content = lazy(() => import('../components/partials/Content'));
const NavBar = lazy(() => import('../components/Navbar'));
const Sidebar = lazy(() => import('../components/Sidebar'));
const Filter = lazy(() => import('../components/Filter'));
const Videos = lazy(() => import('../components/Videos'));

const Landing = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    }, [isLoading]);

    return (
        <Suspense fallback={<Loader />}>
            {isLoading && <Loader />}
            <Content>
                <React.Fragment>
                    <NavBar />
                    <Sidebar />
                    <Filter />
                    <Videos />
                </React.Fragment>
            </Content>
        </Suspense>
    );
};

export default Landing;
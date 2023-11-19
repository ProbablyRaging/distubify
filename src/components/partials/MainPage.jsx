import React from 'react';
import { darkMode } from '../Navbar';

const MainPage = ({ children }) => {
    return (
        <React.Fragment>
            <div className={`w-full h-[100vh] md:h-full box-border ${darkMode.value ? 'bg-bgdark text-textdark' : 'bg-bglight text-textlight'} duration-150`}>
                {children}
            </div>
        </React.Fragment>
    );
};

export default MainPage;
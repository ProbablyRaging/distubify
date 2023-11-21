import React from 'react';
import { Spinner } from '@nextui-org/react';
import { darkMode } from '../Navbar';

const Loader = () => {
    return (
        <div className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center z-[9999] ${darkMode.value ? 'bg-bgdark' : 'bg-bglight'}`}>
            <Spinner color={`${darkMode.value ? 'white' : 'black'}`} />
        </div>
    );
};

export default Loader;
import React from 'react';

const Content = ({ children }) => {
    return (
        <div className='block overflow-auto'>
            {children}
        </div>
    );
};

export default Content;
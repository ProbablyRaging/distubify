import React from 'react';
import styles from '../../style';

const ContentWrapper = ({ children }) => {
    return (
        <React.Fragment>
            <div className={`${styles.flexStart}`}>
                <div className={`${styles.boxWidth}`}>
                    {children}
                </div>
            </div>
        </React.Fragment>
    );
};

export default ContentWrapper;
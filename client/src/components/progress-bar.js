import React from 'react';

const ProgressBar = (props) => {
    const { percentage } = props;

    const barContainerStyle = {
        height: '12px',
        width: '100%',
        backgroundColor: "#ffffff20",
        borderRadius: 50
    };

    const barStyle = {
        height: '100%',
        width: percentage + '%',
        backgroundColor: '#fff',
        borderRadius: 50,
        transition: 'width 1s ease-in-out',
    };

    return (
        <div style={ barContainerStyle }>
            <div style={ barStyle }></div>
        </div>
    )
}

export default ProgressBar;
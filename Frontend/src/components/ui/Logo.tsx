import React from 'react';

const  Logo =  (props) =>
{
    return (
        <div>
            <div className={`font-extrabold text-admin-primary ${props.className}`}>Content<span className='text-primary'>Schedular</span></div>
        </div>
    );
}

export default Logo;
import React from 'react'

function Logo({ className = '' }) {
    return (
        <div className={`font-extrabold text-black ${className}`}>
            Content<span className="text-primary">Schedular</span>
        </div>
    )
}

export default Logo
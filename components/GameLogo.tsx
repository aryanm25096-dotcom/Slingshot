import React from 'react';

interface GameLogoProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const GameLogo: React.FC<GameLogoProps> = ({ className = '', size = 'md' }) => {
    // Size mapping
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-24 h-24',
        xl: 'w-32 h-32'
    };

    return (
        <div className={`relative ${sizeClasses[size]} ${className} flex items-center justify-center`}>
            {/* Outer Glow Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-[#00FFFF] shadow-[0_0_15px_#00FFFF] opacity-80 animate-pulse-glow" />

            {/* Inner Ring (Electric Lime) */}
            <div className="absolute inset-1 rounded-full border border-[#CCFF00] opacity-90" />

            {/* Camera Lens / Blaster Core (CSS Shapes) */}
            <div className="absolute inset-3 bg-black rounded-full overflow-hidden flex items-center justify-center">

                {/* Lens Reflection */}
                <div className="absolute top-1/4 left-1/4 w-1/3 h-1/3 bg-white/20 rounded-full blur-[1px]" />

                {/* Blaster Aperture (Center Dot) */}
                <div className="w-1/3 h-1/3 bg-[#00FFFF] rounded-full shadow-[0_0_10px_#00FFFF]" />

                {/* Crosshair Lines */}
                <div className="absolute w-full h-[1px] bg-[#CCFF00]/50" />
                <div className="absolute h-full w-[1px] bg-[#CCFF00]/50" />
            </div>

            {/* Decorative Orbit Dot */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#CCFF00] rounded-full shadow-[0_0_5px_#CCFF00] animate-bounce" />
        </div>
    );
};

export default GameLogo;

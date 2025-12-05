import { useEffect, useState } from 'react';
import { Logo } from './Logo';
import { cn } from '@/lib/utils';

interface SplashScreenProps {
    onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
    const [progress, setProgress] = useState(0);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // Animate progress bar
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + 2;
            });
        }, 30);

        // Start fade out after 2.5 seconds
        const fadeTimer = setTimeout(() => {
            setFadeOut(true);
        }, 2500);

        // Complete transition after 3 seconds
        const completeTimer = setTimeout(() => {
            onComplete();
        }, 3000);

        return () => {
            clearInterval(progressInterval);
            clearTimeout(fadeTimer);
            clearTimeout(completeTimer);
        };
    }, [onComplete]);

    return (
        <div
            className={cn(
                "fixed inset-0 z-50 flex flex-col items-center justify-center",
                "bg-gradient-to-br from-purple-900 via-purple-700 to-pink-600",
                "transition-opacity duration-500",
                fadeOut && "opacity-0"
            )}
        >
            {/* Animated particles background */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${3 + Math.random() * 4}s`,
                        }}
                    />
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center gap-8 animate-in fade-in zoom-in duration-700">
                {/* Logo with pulse animation */}
                <div className="animate-pulse-slow">
                    <Logo size={120} className="drop-shadow-2xl" />
                </div>

                {/* App name with gradient text */}
                <div className="text-center space-y-2">
                    <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
                        NIRD FakeCheck
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 font-light tracking-wide">
                        Vérification de Contenu
                    </p>
                </div>

                {/* Tagline */}
                <div className="text-center max-w-md px-4">
                    <p className="text-lg text-white/80 italic">
                        "Démêlez le vrai du faux avec notre intelligence artificielle"
                    </p>
                </div>

                {/* Loading progress bar */}
                <div className="w-64 h-1.5 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                    <div
                        className="h-full bg-gradient-to-r from-white via-pink-200 to-purple-200 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-radial from-white/5 via-transparent to-transparent opacity-50" />
        </div>
    );
};

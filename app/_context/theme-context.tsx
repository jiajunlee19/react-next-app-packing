"use client";

import React, { useState, createContext, useContext, useEffect } from "react";

type ThemeContextType = {
    darkMode: boolean | undefined;
    setDarkMode: React.Dispatch<React.SetStateAction<boolean | undefined>>;

};

export const ThemeContext = createContext<ThemeContextType | null>(null);

type ThemeContextProviderProps = {
    children: React.ReactNode;
};

export default function ThemeContextProvider({ children }: ThemeContextProviderProps) {

    const [darkMode, setDarkMode] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        if (darkMode === undefined) {
            // For the 1st time user enters the website, the theme is set to match the OS theme
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                localStorage.setItem('darkMode', 'true');
                window.document.documentElement.classList.add('dark');
            }

            // Else, the theme is set based on localStorage value
            else {
                setDarkMode(localStorage.getItem('darkMode') === 'true');
            }
        }
        else if (darkMode) {
            localStorage.setItem('darkMode', 'true');
            window.document.documentElement.classList.add('dark');
        }
        else {
            localStorage.setItem('darkMode', 'false');
            window.document.documentElement.classList.remove('dark');
        }

    }, [darkMode]);

    return (
        <ThemeContext.Provider
            value={{
                darkMode,
                setDarkMode,
            }}
          >
            {children}
        </ThemeContext.Provider>
    );
}

export function useThemeContext() {

    const context = useContext(ThemeContext);

    if (context === null) {
        throw new Error(
            "useThemeContext must be used within an ThemeContextProvider !"
        );
    }

    return context;
};
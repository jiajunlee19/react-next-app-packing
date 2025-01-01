"use client";

import React, { useState, createContext, useContext } from "react";
import { type TSectionName } from "@/app/_libs/types";

type ActiveSectionContextType = {
    activeSection: TSectionName;
    setActiveSection: React.Dispatch<React.SetStateAction<TSectionName>>;
    timeOfLastClick: number;
    setTimeOfLastClick: React.Dispatch<React.SetStateAction<number>>;
};

export const ActiveSectionContext = createContext<ActiveSectionContextType | null>(null);

type ActiveSectionContextProviderProps = {
    children: React.ReactNode;
};

export default function ActiveSectionContextProvider({ children }: ActiveSectionContextProviderProps) {

    const [activeSection, setActiveSection] = useState<TSectionName>("Home");
    const [timeOfLastClick, setTimeOfLastClick] = useState(0); // // keep track of whether its clicked or scrolled, and disable the observer temporarily when its clicked

    return (
        <ActiveSectionContext.Provider
            value={{
                activeSection,
                setActiveSection,
                timeOfLastClick,
                setTimeOfLastClick,
            }}
          >
            {children}
        </ActiveSectionContext.Provider>
    );
}

export function useActiveSectionContext() {

    const context = useContext(ActiveSectionContext);

    if (context === null) {
        throw new Error(
            "useActiveSectionContext must be used within an ActiveSectionContextProvider !"
        );
    }

    return context;
};
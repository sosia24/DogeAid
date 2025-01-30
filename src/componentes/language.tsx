"use client"

import { useContext, useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from "@/services/languageContext";

export default function Language() {
    const { isEnglish, toggleLanguageES, toggleLanguageUS } = useLanguage()

    function handleUS() {
        toggleLanguageUS()
    }
    
    function handleES() {
        toggleLanguageES()
    }

    return (
        <div className="fixed top-3 right-8 sm:right-4 flex space-x-2 sm:space-x-0 sm:py-0 py-4 z-10">
            <button onClick={() => handleUS()} className="flex items-center space-x-1 rounded-full px-2 py-2 text-white shadow-md hover:bg-blue-700 transition">
                <span className="fi fi-us"></span>
            </button>
            <button onClick={() => handleES()} className="flex items-center space-x-1 rounded-full px-2 py-2 text-white shadow-md hover:bg-red-700 transition">
                <span className="fi fi-es"></span>
            </button>
        </div>
    )
}

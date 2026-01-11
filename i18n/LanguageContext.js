import React, { createContext, useState, useContext } from 'react';
import i18n, { LANGUAGES } from './index';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(i18n.locale);

    const changeLanguage = (langCode) => {
        i18n.locale = langCode;
        setLanguage(langCode);
    };

    const t = (key, options) => i18n.t(key, options);

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t, languages: LANGUAGES }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);

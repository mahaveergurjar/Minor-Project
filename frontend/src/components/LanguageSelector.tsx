import React from "react";

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "hi", name: "Hindi" },
];

interface LanguageSelectorProps {
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selectedLanguage, setSelectedLanguage }) => {
  return (
    <select
      value={selectedLanguage}
      onChange={(e) => setSelectedLanguage(e.target.value)}
      className="p-2 border rounded-lg text-sm bg-white"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
};

export default LanguageSelector;

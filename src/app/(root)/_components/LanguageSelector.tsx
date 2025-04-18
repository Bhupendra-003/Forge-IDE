"use client";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { LANGUAGE_CONFIG } from "../_constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LockIcon } from "lucide-react";


function LanguageSelector({ hasAccess }: { hasAccess: boolean }) {

    const { language, setLanguage } = useCodeEditorStore();

    const handleLanguageSelect = (langId: string) => {
        // For now everyone has access
        // if (hasAccess && langId !== "javascript") return;
        setLanguage(langId);
        console.log("Language changed to: " + langId);
    };

    return (
        <div>
            <Select value={language} onValueChange={handleLanguageSelect}>
                <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                    {Object.values(LANGUAGE_CONFIG).map((lang, index) => {
                        return ((
                            <SelectItem 
                                key={index} 
                                value={lang.id}
                                className="flex items-center justify-between"
                                onClick={() => handleLanguageSelect(lang.id)}
                            >
                                <div className="flex gap-3 items-center">
                                    <div className="w-5 h-5 object-contain overflow-hidden">
                                        <img className="w-full h-full object-contain"
                                            src={lang.logoPath}
                                            alt="logo" />
                                    </div>
                                    <span>{lang.label}</span>
                                </div>
                                
                            </SelectItem>
                        ))
                    })}
                </SelectContent>
            </Select>
        </div>
    )

}
export default LanguageSelector;
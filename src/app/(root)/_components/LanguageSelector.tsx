"use client";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { LANGUAGE_CONFIG } from "../_constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// Removed unused imports

function LanguageSelector() {

    const { language, setLanguage } = useCodeEditorStore();

    const handleLanguageSelect = (langId: string) => {
        // For now everyone has access
        // if (hasAccess && langId !== "javascript") return;
        setLanguage(langId);
        console.log("Language changed to: " + langId);
    };

    return (
        <div className="mx-2">
            <Select value={language} onValueChange={handleLanguageSelect}>
                <SelectTrigger className="w-fit md:scale-110 border">
                    <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent className="scale-110 md:w-36">
                    {Object.values(LANGUAGE_CONFIG).map((lang, index) => {
                        return ((
                            <SelectItem
                                key={index}
                                value={lang.id}
                                className="flex items-center justify-between"

                            >
                                <div className="flex gap-3 items-center">
                                    <div className="w-5 h-5 object-contain overflow-hidden">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img className="w-full h-full object-contain"
                                            src={lang.logoPath}
                                            alt="logo" />
                                    </div>
                                    <span className="block">{lang.label}</span>
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
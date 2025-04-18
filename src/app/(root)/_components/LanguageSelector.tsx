"use client";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { LANGUAGE_CONFIG } from "../_constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function LanguageSelector({ hasAccess }: { hasAccess: boolean }) {

    const { language, setLanguage } = useCodeEditorStore();


    const handleLanguageSelect = (langId: string) => {
        if (!hasAccess && langId !== "javascript") return;
        setLanguage(langId);
    };

    return (
        <div>
            <Select value={language} onValueChange={handleLanguageSelect}>
                <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                    {Object.values(LANGUAGE_CONFIG).map((lang) => (
                        <SelectItem key={lang.id} value={lang.id}>
                            {lang.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )

}
export default LanguageSelector;
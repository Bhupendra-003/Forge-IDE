"use client"
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
    const [fontSize, setFontSize] = React.useState(14);

    return (
        <div className="max-h-[700px] overflow-y-scroll scrollbar-custom">
                <Card>
                <CardContent className="space-y-6 pt-6">
                    <div className="flex items-center justify-between">
                        <Label>Minimap</Label>
                        <Switch defaultChecked={false} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="fontSize">Font Size</Label>
                        <Slider
                            id="fontSize"
                            min={10}
                            max={24}
                            step={1}
                            value={[fontSize]}
                            onValueChange={([val]) => setFontSize(val)}
                        />
                        <div className="text-sm text-muted-foreground">{fontSize}px</div>
                    </div>

                    <div className="flex items-center justify-between">
                        <Label>Automatic Layout</Label>
                        <Switch defaultChecked={true} />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label>Scroll Beyond Last Line</Label>
                        <Switch defaultChecked={false} />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label>Render Whitespace</Label>
                        <Input defaultValue="selection" className="w-40" />
                    </div>

                    <div className="space-y-2">
                        <Label>Font Family</Label>
                        <Input defaultValue='"Fira Code", "Cascadia Code", "Consolas", "monospace"' />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label>Font Ligatures</Label>
                        <Switch defaultChecked={true} />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label>Cursor Blinking</Label>
                        <Input defaultValue="smooth" className="w-40" />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label>Smooth Scrolling</Label>
                        <Switch defaultChecked={true} />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label>Context Menu</Label>
                        <Switch defaultChecked={true} />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label>Render Line Highlight</Label>
                        <Input defaultValue="all" className="w-40" />
                    </div>

                    <div className="space-y-2">
                        <Label>Line Height</Label>
                        <Input type="number" defaultValue={1.6} className="w-24" step="0.1" />
                    </div>

                    <div className="space-y-2">
                        <Label>Letter Spacing</Label>
                        <Input type="number" defaultValue={0.5} className="w-24" step="0.1" />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label>Rounded Selection</Label>
                        <Switch defaultChecked={true} />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        <Label>Scrollbar Sizes</Label>
                        <div className="flex space-x-4">
                            <div>
                                <Label className="text-sm">Vertical</Label>
                                <Input type="number" defaultValue={8} className="w-20" />
                            </div>
                            <div>
                                <Label className="text-sm">Horizontal</Label>
                                <Input type="number" defaultValue={8} className="w-20" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Settings;

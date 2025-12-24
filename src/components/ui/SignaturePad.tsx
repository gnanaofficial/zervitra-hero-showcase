
import React, { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Eraser, Check } from "lucide-react";

interface SignaturePadProps {
    onSave: (dataUrl: string | null) => void;
    initialData?: string | null;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ onSave, initialData }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSignature, setHasSignature] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas && initialData) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                const img = new Image();
                img.onload = () => {
                    ctx.drawImage(img, 0, 0);
                    setHasSignature(true);
                };
                img.src = initialData;
            }
        }
    }, [initialData]);

    const getCoordinates = (event: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;

        if ('touches' in event) {
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        } else {
            clientX = (event as React.MouseEvent).clientX;
            clientY = (event as React.MouseEvent).clientY;
        }

        // Calculate scale factors to map display coordinates to canvas internal coordinates
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    };

    const startDrawing = (event: React.MouseEvent | React.TouchEvent) => {
        event.preventDefault(); // Prevent scrolling on touch
        setIsDrawing(true);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const { x, y } = getCoordinates(event);
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000';
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const draw = (event: React.MouseEvent | React.TouchEvent) => {
        event.preventDefault(); // Prevent scrolling
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const { x, y } = getCoordinates(event);
        ctx.lineTo(x, y);
        ctx.stroke();
        setHasSignature(true);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        // Auto-save on stop or require manual save? Manual save is safer to confirm.
        // implementation: handled by "Apply" button
    };

    const clear = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                setHasSignature(false);
                onSave(null);
            }
        }
    };

    const handleSave = () => {
        const canvas = canvasRef.current;
        if (canvas && hasSignature) {
            const dataUrl = canvas.toDataURL('image/png');
            onSave(dataUrl);
        } else {
            onSave(null);
        }
    };

    return (
        <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden touch-none bg-white">
                <canvas
                    ref={canvasRef}
                    width={400}
                    height={200}
                    className="w-full h-40 cursor-crosshair block"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                />
            </div>
            <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={clear} className="w-full">
                    <Eraser className="w-4 h-4 mr-2" /> Clear
                </Button>
                <Button size="sm" onClick={handleSave} className="w-full" disabled={!hasSignature}>
                    <Check className="w-4 h-4 mr-2" /> Apply Signature
                </Button>
            </div>
        </div>
    );
};

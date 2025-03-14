import { ColorSwatch, Group } from '@mantine/core';
import Sidebar from '../components/sidebar';
import {useAuth} from '../context/AuthContext';
import { saveCanvas } from '../services/api';

declare global {
    interface Window {
        MathJax: any;
    }
}

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Draggable from 'react-draggable';
import {SWATCHES} from '../../constants';
// import {LazyBrush} from 'lazy-brush';

interface GeneratedResult {
    expression: string;
    answer: string;
}

interface Response {
    expr: string;
    result: string;
    assign: boolean;
}

export default function Home() {
    const {user, setUser} = useAuth();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('rgb(0,0,0)');
    const [reset, setReset] = useState(false);
    const [dictOfVars, setDictOfVars] = useState({});
    const [result, setResult] = useState<GeneratedResult>();
    const [latexPosition, setLatexPosition] = useState({ x: 10, y: 200 });
    const [latexExpression, setLatexExpression] = useState<Array<string>>([]);

    useEffect(() => {
        if (latexExpression.length > 0 && window.MathJax) {
            setTimeout(() => {
                window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
            }, 0);
        }
    }, [latexExpression]);

    useEffect(() => {
        if (result) {
            renderLatexToCanvas(result.expression, result.answer);
        }
    }, [result]);

    useEffect(() => {
        if (reset) {
            resetCanvas();
            setLatexExpression([]);
            setResult(undefined);
            setDictOfVars({});
            setReset(false);
        }
    }, [reset]);

    //consider it as the start of the main logic, it loads the mathjax script
    //and configures it to render the latex expressions
    useEffect(() => {
        const canvas = canvasRef.current;
    
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight - canvas.offsetTop;
                ctx.lineCap = 'round';
                ctx.lineWidth = 3;
            }

        }
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-MML-AM_CHTML';
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            window.MathJax.Hub.Config({
                tex2jax: {inlineMath: [['$', '$'], ['\\(', '\\)']]},
            });
        };

        return () => {
            document.head.removeChild(script);
        };

    }, []);

    const renderLatexToCanvas = (expression: string, answer: string) => {
        const latex = `\\(\\LARGE{${expression} = ${answer}}\\)`;
        setLatexExpression([...latexExpression, latex]);

        // Clear the main canvas
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    };

    const resetCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    }
    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (canvas) {
            // canvas.style.background = 'black';
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.beginPath();
                ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                setIsDrawing(true);
            }
        }
    };
    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) {
            return;
        }
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.strokeStyle = color;
                ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                ctx.stroke();
            }
        }
    };
    const stopDrawing = () => {
        setIsDrawing(false);
    };  

    const runRoute = async () => {
        const canvas = canvasRef.current;

        console.log('sending request to', import.meta.env.VITE_API_URL);
        if (canvas) {
            const response = await axios({
                method: 'post',
                url: `${import.meta.env.VITE_API_URL}/calculate`,
                data: {
                    image: canvas.toDataURL('image/png'),
                    dict_of_vars: dictOfVars
                }
            });

            // console.log('Response', resp);
            response.data.result.forEach((data: Response) => {
                if (data.assign === true) {
                    // dict_of_vars[resp.result] = resp.answer;
                    setDictOfVars({
                        ...dictOfVars,
                        [data.expr]: data.result
                    });
                }
            });
            const ctx = canvas.getContext('2d');
            const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);
            let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;

            for (let y = 0; y < canvas.height; y++) {
                for (let x = 0; x < canvas.width; x++) {
                    const i = (y * canvas.width + x) * 4;
                    if (imageData.data[i + 3] > 0) {  // If pixel is not transparent
                        minX = Math.min(minX, x);
                        minY = Math.min(minY, y);
                        maxX = Math.max(maxX, x);
                        maxY = Math.max(maxY, y);
                    }
                }
            }

            const centerX = (minX + maxX) / 2;
            const centerY = (minY + maxY) / 2;

            setLatexPosition({ x: centerX, y: centerY });
            response.data.result.forEach((data: Response) => {
                setTimeout(() => {
                    setResult({
                        expression: data.expr,
                        answer: data.result
                    });
                }, 1000);
            });
        }
    };
    const [isOpen, setIsOpen] = useState(false);
    const toggleSidebar = () =>{
        setIsOpen(!isOpen);
    }
    const save = async () =>{
        const data = await saveCanvas({canvas: canvasRef.current, user: user});
        console.log('data -> ', data);
        setUser(data);
    }
    
    return (
        <>
            {/* Top Menu Bar */}
            <div className="absolute top-4 left-4 z-50">
                {isOpen? <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} /> :
                <button 
                    type="button" 
                    onClick={toggleSidebar}
                    className="text-white bg-gray-700 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-4 py-2"
                >
                    ☰
                </button>}
            </div>
    
            {/* Toolbar */}
            <div className="absolute top-2 left-16 right-16 flex items-center justify-between gap-4 z-40 p-2 rounded-full">
                {/* Reset Button */}
                <button 
                    type="button" 
                    onClick={() => setReset(true)}
                    className="text-white bg-gray-700 hover:bg-gray-900 font-medium rounded-full text-sm px-6 py-2"
                >
                    Reset
                </button>
    
                {/* Color Swatches */}
                <Group className="flex gap-3">
                    {SWATCHES.map((swatch: string) => (
                        <ColorSwatch 
                        className={`cursor-pointer rounded-full border-2 transition-all ${
                            swatch === color ? "border-black outline-dashed outline-30 ": "border-transparent"
                        }`}
                        key={swatch} 
                        color={swatch} 
                        onClick={() => setColor(swatch)} />
                    ))}
                </Group>
                {/* Save canvas */}
                <button 
                    type="button" 
                    onClick={save}
                    className="text-white bg-gray-700 hover:bg-black font-medium rounded-full text-sm px-6 py-2"
                >
                    Save Canvas
                </button>
                {/* Run Button */}
                <button 
                    type="button" 
                    onClick={runRoute}
                    className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-full text-sm px-6 py-2"
                >
                    Run
                </button>
            </div>
    
            {/* Full-Screen Canvas */}
            <canvas
                ref={canvasRef}
                id="canvas"
                className="absolute top-0 left-0 w-full h-full"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
            />
    
            {/* Draggable LaTeX Expressions */}
            {latexExpression && latexExpression.map((latex, index) => (
                <Draggable
                    key={index}
                    defaultPosition={latexPosition}
                    onStop={() => setLatexPosition({ x: 0, y: 0 })}
                >
                    <div className="absolute p-2 text-black rounded shadow-md bg-white">
                        <div className="latex-content">{latex}</div>
                    </div>
                </Draggable>
            ))}
        </>
    );
    
}
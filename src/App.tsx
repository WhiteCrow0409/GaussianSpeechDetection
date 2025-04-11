import React, { useState, useRef, useEffect } from 'react';
import { Mic, Upload, Sun, Moon } from 'lucide-react';
import { GaussianDFTAudioDetector } from './lib/AudioDetector';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<{
    speechPercentage: number;
    duration: number;
    logLikelihood: number[];
    speechFrames: boolean[];
  } | null>(null);
  const detectorRef = useRef<GaussianDFTAudioDetector | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    setIsProcessing(true);
    setError(null);
    setResults(null);

    try {
      if (!detectorRef.current) {
        detectorRef.current = new GaussianDFTAudioDetector();
      }

      const startTime = performance.now();
      const { speechFrames, logLikelihood } = await detectorRef.current.detectSpeech(selectedFile);
      const endTime = performance.now();

      const speechPercentage = (speechFrames.filter(Boolean).length / speechFrames.length) * 100;
      
      setResults({
        speechPercentage,
        duration: (endTime - startTime) / 1000,
        logLikelihood,
        speechFrames
      });
    } catch (error) {
      console.error('Error processing audio:', error);
      setError('Failed to process audio file. Please try again with a different file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type.startsWith('audio/')) {
      const input = document.getElementById('audio-input') as HTMLInputElement;
      input.files = e.dataTransfer.files;
      handleFileChange({ target: input } as any);
    } else {
      setError('Please drop an audio file.');
    }
  };

  const chartData = results ? {
    labels: Array.from({ length: results.logLikelihood.length }, (_, i) => i),
    datasets: [
      {
        label: 'Log Likelihood Ratio',
        data: results.logLikelihood,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Speech Detection',
        data: results.speechFrames.map(v => v ? 1 : 0),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0
      }
    ]
  } : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Speech Detection Results'
      }
    },
    scales: {
      y: {
        min: -2,
        max: 2
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 max-w-4xl w-full">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center justify-center">
            <Mic className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 ml-3">
              Speech Detector
            </h1>
          </div>
          <button onClick={toggleTheme} className="focus:outline-none">
            {theme === 'dark' ? (
              <Sun className="w-6 h-6 text-gray-100" />
            ) : (
              <Moon className="w-6 h-6 text-gray-800" />
            )}
          </button>
        </div>

        <div className="space-y-6">
          <div 
            className="relative"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="hidden"
              id="audio-input"
              disabled={isProcessing}
            />
            <label
              htmlFor="audio-input"
              className={`
                flex items-center justify-center px-6 py-4 border-2 border-dashed
                rounded-lg cursor-pointer transition-colors dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300
                ${isProcessing
                  ? 'bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600'
                  : 'border-indigo-300 hover:border-indigo-400 hover:bg-indigo-50 dark:border-indigo-500 dark:hover:border-indigo-400 dark:hover:bg-indigo-900'}
              `}
            >
              <Upload className="w-6 h-6 text-indigo-500 dark:text-indigo-400 mr-2" />
              <span className="text-gray-600 dark:text-gray-300">
                {file ? file.name : 'Upload or drop audio file'}
              </span>
            </label>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-400 p-4 rounded-lg">
              {error}
            </div>
          )}

          {isProcessing && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Processing audio...</p>
            </div>
          )}

          {results && (
            <>
              <div className="bg-indigo-50 dark:bg-indigo-900 rounded-lg p-6 space-y-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Results</h2>
                <div className="space-y-2">
                  <p className="text-gray-600 dark:text-gray-300">
                    Speech detected in{' '}
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                      {results.speechPercentage.toFixed(1)}%
                    </span>
                    of the audio
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Processing time:
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                      {results.duration.toFixed(2)}s
                    </span>
                  </p>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                {chartData && <Line data={chartData} options={chartOptions} />}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
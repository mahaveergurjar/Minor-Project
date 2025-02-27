import React from "react";

interface SummaryLengthSliderProps {
  summaryLength: string;
  setSummaryLength: (length: string) => void;
}

const SummaryLengthSlider: React.FC<SummaryLengthSliderProps> = ({
  summaryLength,
  setSummaryLength,
}) => {
  const options = ["Short", "Normal", "Long"];

  return (
    <div className="w-full max-w-md mb-4">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-700">Summary Length</label>
        <span className="text-sm font-medium px-2 py-1 bg-gray-100 rounded-md">
          {summaryLength}
        </span>
      </div>
      
      <div className="relative h-5 flex items-center">
        {/* Hidden input slider */}
        <input
          type="range"
          min="0"
          max="2"
          value={options.indexOf(summaryLength)}
          onChange={(e) => setSummaryLength(options[Number(e.target.value)])}
          className="absolute w-full h-5 z-10 opacity-0 cursor-pointer"
        />
        
        {/* Track */}
        <div className="absolute w-full h-1 bg-gray-100 rounded-full">
          <div 
            className="h-full bg-gray-300 rounded-full"
            style={{ 
              width: `${(options.indexOf(summaryLength) / (options.length - 1)) * 100}%` 
            }}
          />
        </div>
        
        {/* Dots */}
        <div className="absolute w-full flex justify-between px-0">
          {options.map((option, index) => (
            <div 
              key={option}
              onClick={() => setSummaryLength(option)}
              className={`h-3 w-3 rounded-full cursor-pointer border ${
                index <= options.indexOf(summaryLength)
                  ? 'bg-gray-700 border-gray-500' 
                  : 'bg-white border-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
      
      {/* Labels */}
      <div className="flex justify-between mt-2">
        {options.map((option) => (
          <span 
            key={option}
            onClick={() => setSummaryLength(option)}
            className={`text-xs cursor-pointer ${
              option === summaryLength ? 'font-semibold text-gray-900' : 'text-gray-500'
            }`}
          >
            {option}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SummaryLengthSlider;
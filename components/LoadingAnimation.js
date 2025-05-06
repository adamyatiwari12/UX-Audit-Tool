// components/LoadingAnimation.js
export default function LoadingAnimation() {
    return (
      <div className="flex flex-col items-center justify-center my-8">
        <div className="relative w-20 h-20">
          <div className="absolute w-16 h-16 border-4 border-dashed rounded-full border-blue-400 animate-spin"></div>
          <div className="absolute w-20 h-20 border-4 border-t-4 border-blue-500 rounded-full animate-spin" style={{ animationDuration: '1.5s' }}></div>
        </div>
        <div className="mt-6 flex flex-col items-center">
          <p className="text-gray-700 font-medium mb-2">Analyzing your landing page...</p>
          <ul className="text-sm text-gray-500 animate-pulse">
            <li className="inline-block mx-1">Checking CTAs</li>
            <li className="inline-block mx-1">•</li>
            <li className="inline-block mx-1">Evaluating hierarchy</li>
            <li className="inline-block mx-1">•</li>
            <li className="inline-block mx-1">Reviewing copy</li>
          </ul>
        </div>
      </div>
    );
  }
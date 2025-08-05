export default function Loading() {
  return (
    <div className="text-white content-above-gradient relative min-h-screen">
      <div className="w-full container-box relative z-10 pt-32">
        <div className="animate-pulse">
          {/* Back button skeleton */}
          <div className="h-6 bg-white/20 rounded w-24 mb-8"></div>
          
          {/* Header skeleton */}
          <div className="h-8 bg-white/20 rounded w-1/3 mb-4"></div>
          <div className="h-12 bg-white/20 rounded w-2/3 mb-4"></div>
          <div className="h-6 bg-white/20 rounded w-3/4 mb-8"></div>
          
          {/* Main content grid skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - image */}
            <div className="lg:col-span-2">
              <div className="h-96 bg-white/20 rounded-2xl"></div>
            </div>
            
            {/* Right column - details */}
            <div className="space-y-6">
              {/* Event details card */}
              <div className="bg-white/10 rounded-2xl p-6">
                <div className="h-6 bg-white/20 rounded w-1/2 mb-4"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-white/20 rounded w-3/4"></div>
                  <div className="h-4 bg-white/20 rounded w-2/3"></div>
                  <div className="h-4 bg-white/20 rounded w-4/5"></div>
                </div>
              </div>
              
              {/* Registration card */}
              <div className="bg-white/10 rounded-2xl p-6">
                <div className="h-6 bg-white/20 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-white/20 rounded w-full mb-4"></div>
                <div className="h-12 bg-white/20 rounded"></div>
              </div>
            </div>
          </div>
          
          {/* Description skeleton */}
          <div className="mt-12 bg-white/10 rounded-2xl p-8">
            <div className="h-8 bg-white/20 rounded w-1/3 mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-white/20 rounded w-full"></div>
              <div className="h-4 bg-white/20 rounded w-5/6"></div>
              <div className="h-4 bg-white/20 rounded w-4/5"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
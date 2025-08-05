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
          
          {/* Meta info skeleton */}
          <div className="flex flex-wrap gap-6 mb-8">
            <div className="h-4 bg-white/20 rounded w-24"></div>
            <div className="h-4 bg-white/20 rounded w-32"></div>
            <div className="h-4 bg-white/20 rounded w-28"></div>
            <div className="h-4 bg-white/20 rounded w-20"></div>
          </div>
          
          {/* Action buttons skeleton */}
          <div className="flex gap-4 mb-8">
            <div className="h-10 bg-white/20 rounded w-24"></div>
            <div className="h-10 bg-white/20 rounded w-20"></div>
          </div>
          
          {/* Image skeleton */}
          <div className="h-96 bg-white/20 rounded-2xl mb-8"></div>
          
          {/* Tags skeleton */}
          <div className="flex gap-2 mb-8">
            <div className="h-6 bg-white/20 rounded-full w-16"></div>
            <div className="h-6 bg-white/20 rounded-full w-20"></div>
            <div className="h-6 bg-white/20 rounded-full w-18"></div>
          </div>
          
          {/* Content skeleton */}
          <div className="bg-white/10 rounded-2xl p-8">
            <div className="space-y-4">
              <div className="h-4 bg-white/20 rounded w-full"></div>
              <div className="h-4 bg-white/20 rounded w-5/6"></div>
              <div className="h-4 bg-white/20 rounded w-4/5"></div>
              <div className="h-4 bg-white/20 rounded w-full"></div>
              <div className="h-4 bg-white/20 rounded w-3/4"></div>
              <div className="h-4 bg-white/20 rounded w-5/6"></div>
              <div className="h-4 bg-white/20 rounded w-full"></div>
              <div className="h-4 bg-white/20 rounded w-4/5"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
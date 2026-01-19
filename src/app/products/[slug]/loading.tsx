export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="content-container">
        {/* Skeleton für Product Page */}
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-8 mb-12">
          {/* LEFT - Image Skeleton */}
          <div className="space-y-6">
            <div className="w-full aspect-square bg-gray-200 rounded-lg animate-pulse" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
            </div>
          </div>

          {/* RIGHT - Info Skeleton */}
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />

            {/* SetAngebot Skeleton */}
            <div className="bg-gray-200 rounded-md h-64 animate-pulse" />

            {/* Quantity + Price Skeleton */}
            <div className="bg-gray-200 rounded-md h-48 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

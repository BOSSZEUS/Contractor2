export default function QuoteReviewLoading() {
  return (
    <div className="container mx-auto py-6 space-y-4">
      <div className="h-8 w-64 bg-gray-200 animate-pulse rounded-md mb-4"></div>
      <div className="h-40 bg-gray-200 animate-pulse rounded-lg mb-6"></div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-200 animate-pulse rounded-lg"></div>
        ))}
      </div>
    </div>
  )
}

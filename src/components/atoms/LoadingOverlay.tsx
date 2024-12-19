const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-[#B86EFF]/30 rounded-full animate-pulse" />
      <div className="absolute top-0 left-0 w-16 h-16 border-4 border-[#B86EFF] border-t-transparent rounded-full animate-spin" />
    </div>
  </div>
);

export default LoadingOverlay;

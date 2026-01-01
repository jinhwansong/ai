export default function Spinner() {
  return (
     <div className="flex min-h-screen items-center justify-center bg-(--bg-main)">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-(--primary) border-t-transparent"></div>
        <p className="text-sm font-medium text-(--text-muted)">
          브리핑을 준비하고 있습니다...
        </p>
      </div>
    </div>
  );
}
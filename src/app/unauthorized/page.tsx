// app/unauthorized/page.tsx or pages/unauthorized.tsx
export default function UnauthorizedPage() {
  return (
    <div className="text-center mt-20">
      <h1 className="text-4xl font-bold text-red-600">Access Denied</h1>
      <p className="mt-4">You do not have permission to view this page.</p>
    </div>
  );
}

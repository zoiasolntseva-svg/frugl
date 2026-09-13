import Link from "next/link";

export default function Success() {
  const { searchParams } = new URL(window.location.href);
  const sessionId = searchParams.get("session_id");

  return (
    <main className="min-h-screen bg-paper text-ink flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Success! ??</h1>
      <p className="text-lg mb-4">
        Your subscription has been activated.{${
          sessionId
            ? ` (Session ID: ${sessionId})`
            : ""
        }}
      </p>
      <Link 
        href="/" 
        className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
      >
        Back to Home
      </Link>
    </main>
  );
}

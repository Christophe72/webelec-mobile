"use client";

export default function DebugEnvPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Debug Environment Variables</h1>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(
          {
            NEXT_PUBLIC_API_AUTH_DISABLED: process.env.NEXT_PUBLIC_API_AUTH_DISABLED,
            NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE,
          },
          null,
          2
        )}
      </pre>
      <div className="mt-4 p-4 bg-green-100 rounded">
        <p className="font-bold text-green-800">✓ Mode dev sans authentification activé!</p>
        <p className="text-sm text-green-700">Tu peux naviguer librement dans l&apos;application.</p>
      </div>
    </div>
  );
}

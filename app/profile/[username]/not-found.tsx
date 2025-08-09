import Link from 'next/link';

export default function NotFoundProfile() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-2xl font-semibold text-white">Profile not found</h1>
        <p className="mt-2 text-sm text-white/70">We couldn't find that user. Check the username and try again.</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link href="/" className="px-4 py-2 rounded-md bg-white/10 border border-white/10 text-white hover:bg-white/15">Go home</Link>
          <Link href="/profile/nexus" className="px-4 py-2 rounded-md bg-[#9945FF] text-white hover:bg-[#7A35D9]">View example</Link>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function NotAuthorized() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.replace('/auth/login');
        }, 3000);
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-sm w-full">
                <div className="text-5xl mb-4">❌</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Anda belum login</h2>
                <p className="text-gray-500 text-sm mb-6">Silakan login terlebih dahulu.</p>
                <button
                    onClick={() => router.replace('/auth/login')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors"
                >
                    ← Kembali
                </button>
            </div>
        </div>
    );
}

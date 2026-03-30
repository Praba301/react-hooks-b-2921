'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthFormWrapper from '../../../components/AuthFormWrapper';
import SocialAuth from '../../../components/SocialAuth';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash, FaSync } from 'react-icons/fa';

type RegisterFormData = {
    username: string;
    email: string;
    nomorTelp: string;
    password: string;
    confirmPassword: string;
    captcha: string;
};

const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const RegisterPage = () => {
    const router = useRouter();
    const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>();

    const [captcha, setCaptcha] = useState('');

useEffect(() => {
    setCaptcha(generateCaptcha());
}, []);
    const [captchaInput, setCaptchaInput] = useState('');
    const [captchaError, setCaptchaError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const password = watch('password', '');

    useEffect(() => {
        const strength = Math.min(
            (password.length > 7 ? 25 : 0) +
            (/[A-Z]/.test(password) ? 25 : 0) +
            (/[0-9]/.test(password) ? 25 : 0) +
            (/[^A-Za-z0-9]/.test(password) ? 25 : 0),
            100
        );
        setPasswordStrength(strength);
    }, [password]);

    const getStrengthColor = () => {
        if (passwordStrength <= 25) return 'bg-red-500';
        if (passwordStrength <= 50) return 'bg-orange-400';
        if (passwordStrength <= 75) return 'bg-yellow-400';
        return 'bg-green-500';
    };

    const refreshCaptcha = () => {
        setCaptcha(generateCaptcha());
        setCaptchaInput('');
        setCaptchaError('');
    };

    const onSubmit = (data: RegisterFormData) => {
        if (captchaInput !== captcha) {
            setCaptchaError('Captcha tidak valid');
            toast.error('Captcha salah', { position: 'top-right' });
            refreshCaptcha();
            return;
        }

        if (data.password !== data.confirmPassword) {
            toast.error('Konfirmasi password tidak cocok', { position: 'top-right' });
            return;
        }

        toast.success('Register Berhasil!', { position: 'top-right' });
        router.push('/auth/login');
    };

    return (
        <AuthFormWrapper title="Register">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">

                {/* Username */}
                <div className="space-y-2">
                    <label htmlFor="username" className="text-sm font-medium text-gray-700">Username</label>
                    <input
                        id="username"
                        {...register('username', {
                            required: 'Username tidak boleh kosong',
                            minLength: { value: 3, message: 'Minimal 3 karakter' },
                            maxLength: { value: 8, message: 'Maksimal 8 karakter' },
                        })}
                        className={`w-full px-4 py-2.5 rounded-lg border ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Masukkan username"
                    />
                    {errors.username && <p className="text-red-600 text-sm italic mt-1">{errors.username.message}</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                    <input
                        id="email"
                        type="text"
                        {...register('email', {
                            required: 'Email tidak boleh kosong',
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.(com|net|co)$/,
                                message: 'Format email tidak valid',
                            },
                        })}
                        className={`w-full px-4 py-2.5 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Masukkan email"
                    />
                    {errors.email && <p className="text-red-600 text-sm italic mt-1">{errors.email.message}</p>}
                </div>

                {/* Nomor Telepon */}
                <div className="space-y-2">
                    <label htmlFor="nomorTelp" className="text-sm font-medium text-gray-700">Nomor Telepon</label>
                    <input
                        id="nomorTelp"
                        type="tel"
                        {...register('nomorTelp', {
                            required: 'Nomor telepon tidak boleh kosong',
                            minLength: { value: 10, message: 'Minimal 10 karakter' },
                            pattern: { value: /^[0-9]+$/, message: 'Hanya boleh angka' },
                        })}
                        onInput={(e) => {
                            e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
                        }}
                        className={`w-full px-4 py-2.5 rounded-lg border ${errors.nomorTelp ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Masukkan nomor telepon"
                    />
                    {errors.nomorTelp && <p className="text-red-600 text-sm italic mt-1">{errors.nomorTelp.message}</p>}
                </div>

                {/* Password */}
                <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            {...register('password', {
                                required: 'Password tidak boleh kosong',
                                minLength: { value: 8, message: 'Minimal 8 karakter' },
                            })}
                            className={`w-full px-4 py-2.5 rounded-lg border pr-10 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Masukkan password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(prev => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    {/* Strength bar */}
                    <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1">
                        <div
                            className={`h-1.5 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                            style={{ width: `${passwordStrength}%` }}
                        />
                    </div>
                    <p className="text-xs text-gray-500">Strength: {passwordStrength}%</p>
                    {errors.password && <p className="text-red-600 text-sm italic mt-1">{errors.password.message}</p>}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</label>
                    <div className="relative">
                        <input
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            {...register('confirmPassword', {
                                required: 'Konfirmasi password tidak boleh kosong',
                                validate: (val) => val === password || 'Password tidak cocok',
                            })}
                            className={`w-full px-4 py-2.5 rounded-lg border pr-10 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Masukkan konfirmasi password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(prev => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-600 text-sm italic mt-1">{errors.confirmPassword.message}</p>}
                </div>

                {/* Captcha */}
                <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-700">Captcha:</span>
                        <span className="font-mono text-lg font-bold text-gray-800 bg-gray-100 px-3 py-1.5 rounded select-none">
                            {captcha}
                        </span>
                        <button
                            type="button"
                            onClick={refreshCaptcha}
                            className="text-blue-500 hover:text-blue-700 transition-colors"
                            title="Refresh captcha"
                        >
                            <FaSync />
                        </button>
                    </div>
                    <input
                        type="text"
                        value={captchaInput}
                        onChange={(e) => {
                            setCaptchaInput(e.target.value);
                            setCaptchaError('');
                        }}
                        className={`w-full px-4 py-2.5 rounded-lg border ${captchaError ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Masukkan captcha"
                    />
                    {captchaError && <p className="text-red-600 text-sm italic mt-1">{captchaError}</p>}
                </div>

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg">
                    Register
                </button>

                <SocialAuth />
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
                Sudah punya akun?{' '}
                <Link href="/auth/login" className="text-blue-600 hover:text-blue-800 font-semibold">Login</Link>
            </p>
        </AuthFormWrapper>
    );
};

export default RegisterPage;

import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function ResetPassword({ token, email }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <div className="relative">
                        <TextInput
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full pr-12"
                            autoComplete="new-password"
                            isFocused={true}
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
                        >
                            {showPassword ? (
                                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                                    <path
                                        fill="currentColor"
                                        d="M2 5.27L3.28 4L20 20.72L18.73 22L16.92 20.19A11 11 0 0 1 12 21C7 21 2.73 17.89 1 13.5c.71-1.82 1.9-3.39 3.4-4.63zM12 7c5 0 9.27 3.11 11 7.5c-.43 1.1-1.05 2.1-1.82 2.98l-2.12-2.12A6 6 0 0 0 12 9a6 6 0 0 0-2.36.49L7.7 7.53C9.02 7.18 10.48 7 12 7m0 4a2 2 0 0 1 2 2c0 .25-.05.49-.14.71l-2.57-2.57c.22-.09.46-.14.71-.14m-7.2 2.5c.78 1.73 2.2 3.2 4 4.09l-1.42-1.42A4 4 0 0 1 7 12c0-.37.05-.74.14-1.09z"
                                    />
                                </svg>
                            ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                                    <path
                                        fill="currentColor"
                                        d="M12 5c5 0 9.27 3.11 11 7.5C21.27 16.89 17 20 12 20S2.73 16.89 1 12.5C2.73 8.11 7 5 12 5m0 3a4.5 4.5 0 1 0 0 9a4.5 4.5 0 0 0 0-9m0 2a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                    />

                    <div className="relative">
                        <TextInput
                            type={showConfirm ? 'text' : 'password'}
                            id="password_confirmation"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full pr-12"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            aria-label={showConfirm ? "Sembunyikan password" : "Lihat password"}
                        >
                            {showConfirm ? (
                                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                                    <path
                                        fill="currentColor"
                                        d="M2 5.27L3.28 4L20 20.72L18.73 22L16.92 20.19A11 11 0 0 1 12 21C7 21 2.73 17.89 1 13.5c.71-1.82 1.9-3.39 3.4-4.63zM12 7c5 0 9.27 3.11 11 7.5c-.43 1.1-1.05 2.1-1.82 2.98l-2.12-2.12A6 6 0 0 0 12 9a6 6 0 0 0-2.36.49L7.7 7.53C9.02 7.18 10.48 7 12 7m0 4a2 2 0 0 1 2 2c0 .25-.05.49-.14.71l-2.57-2.57c.22-.09.46-.14.71-.14m-7.2 2.5c.78 1.73 2.2 3.2 4 4.09l-1.42-1.42A4 4 0 0 1 7 12c0-.37.05-.74.14-1.09z"
                                    />
                                </svg>
                            ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                                    <path
                                        fill="currentColor"
                                        d="M12 5c5 0 9.27 3.11 11 7.5C21.27 16.89 17 20 12 20S2.73 16.89 1 12.5C2.73 8.11 7 5 12 5m0 3a4.5 4.5 0 1 0 0 9a4.5 4.5 0 0 0 0-9m0 2a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <PrimaryButton className="ms-4" disabled={processing}>
                        Reset Password
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}

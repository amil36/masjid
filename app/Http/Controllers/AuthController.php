<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\LogAktivitas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function showLogin()
    {
        if (Auth::check()) {
            return redirect()->route('admin.dashboard');
        }
        return Inertia::render('Auth/Login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'login'    => 'required|string',
            'password' => 'required|string',
        ], [
            'login.required'    => 'Username atau email wajib diisi.',
            'password.required' => 'Password wajib diisi.',
        ]);

        $field = filter_var($request->login, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        $credentials = [
            $field     => $request->login,
            'password' => $request->password,
        ];

        if (!Auth::attempt($credentials, $request->boolean('remember'))) {
            throw ValidationException::withMessages([
                'login' => 'Username/email atau password salah.',
            ]);
        }

        $user = Auth::user();

        if (!$user->is_active) {
            Auth::logout();
            throw ValidationException::withMessages([
                'login' => 'Akun Anda telah dinonaktifkan. Hubungi administrator.',
            ]);
        }

        LogAktivitas::create([
            'user_id'    => $user->id,
            'aksi'       => 'login',
            'modul'      => 'auth',
            'deskripsi'  => "User {$user->name} berhasil login",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        $request->session()->regenerate();

        return redirect()->intended(route('admin.dashboard'));
    }

    public function logout(Request $request)
    {
        $user = Auth::user();

        LogAktivitas::create([
            'user_id'    => $user->id,
            'aksi'       => 'logout',
            'modul'      => 'auth',
            'deskripsi'  => "User {$user->name} logout",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }

    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'name'   => 'required|string|max:255',
            'email'  => 'required|email|unique:users,email,' . $user->id,
            'avatar' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $data = $request->only('name', 'email');

        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                \Storage::disk('public')->delete($user->avatar);
            }
            $data['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        $user->update($data);

        return back()->with('success', 'Profil berhasil diperbarui.');
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'password'         => 'required|string|min:8|confirmed',
        ]);

        $user = Auth::user();

        if (!Hash::check($request->current_password, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => 'Password saat ini tidak sesuai.',
            ]);
        }

        $user->update(['password' => Hash::make($request->password)]);

        return back()->with('success', 'Password berhasil diperbarui.');
    }
}

<?php

namespace App\Http\Middleware;

use App\Models\MasjidProfile;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    'id'          => $request->user()->id,
                    'name'        => $request->user()->name,
                    'username'    => $request->user()->username,
                    'email'       => $request->user()->email,
                    'role'        => $request->user()->role,
                    'avatar_url'  => $request->user()->avatar_url,
                ] : null,
            ],
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error'   => fn() => $request->session()->get('error'),
            ],
            'masjid' => fn() => cache()->remember('masjid_profile', 3600, function () {
                return MasjidProfile::first()?->toArray();
            }),
            'ziggy' => fn() => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
        ];
    }
}

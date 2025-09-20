<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\UserLink;
use Illuminate\Support\Facades\DB;

class BioLinkController extends Controller
{
    public function getUserByUsername($username)
    {
        try {
            $user = User::where('username', $username)->first();

            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }

            return response()->json([
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'bio' => $user->bio,
                'photo_url' => $user->photo_url,
                'created_at' => $user->created_at
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch user'], 500);
        }
    }

    public function getUserLinks($userId)
    {
        try {
            $links = UserLink::where('user_id', $userId)
                ->orderBy('created_at', 'asc')
                ->get();

            return response()->json($links->map(function ($link) {
                return [
                    'id' => $link->id,
                    'user_id' => $link->user_id,
                    'name' => $link->name,
                    'url' => $link->url,
                    'count' => $link->click_count ?? 0,
                    'created_at' => $link->created_at
                ];
            }));
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch links'], 500);
        }
    }

    public function incrementLinkClick($linkId)
    {
        try {
            $link = UserLink::find($linkId);

            if (!$link) {
                return response()->json(['error' => 'Link not found'], 404);
            }

            // Increment the click count
            $link->increment('count');

            return response()->json([
                'success' => true,
                'count' => $link->click_count
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to increment click count'], 500);
        }
    }

    public function createLink(Request $request, $userId)
    {
        try {
            // Validate request
            $request->validate([
                'name' => 'required|string|max:255',
                'url' => 'required|url|max:500',
                'icon' => 'nullable|string|max:50'
            ]);

            // Verify user exists and matches authenticated user if applicable
            $user = User::find($userId);
            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }

            // Create the link
            $link = UserLink::create([
                'user_id' => $userId,
                'name' => $request->name,
                'url' => $request->url,
                'icon' => $request->icon ?? null,
                'click_count' => 0
            ]);

            return response()->json([
                'success' => true,
                'link' => [
                    'id' => $link->id,
                    'user_id' => $link->user_id,
                    'name' => $link->name,
                    'url' => $link->url,
                    'icon' => $link->icon,
                    'count' => $link->click_count,
                    'created_at' => $link->created_at
                ]
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => 'Validation failed', 'details' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create link'], 500);
        }
    }

    public function deleteLink($linkId)
    {
        try {
            $link = UserLink::find($linkId);

            if (!$link) {
                return response()->json(['error' => 'Link not found'], 404);
            }

            // Optional: Add authorization check to ensure user owns this link
            // if (Auth::check() && $link->user_id !== Auth::id()) {
            //     return response()->json(['error' => 'Unauthorized'], 403);
            // }

            $link->delete();

            return response()->json([
                'success' => true,
                'message' => 'Link deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete link'], 500);
        }
    }
}

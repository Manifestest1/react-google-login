<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Admin;
use Validator;
use Laravel\Socialite\Facades\Socialite;
use Hash;

class UserController extends Controller
{
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);
    
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
    
        // Retrieve the user by email
        $user = Admin::where('email', $request->email)->first();
        return $user;
    
        // Check if the user exists and if the password is correct
        // if (!$user || !Hash::check($request->password, $user->password)) {
        //     return response()->json([
        //         'message' => 'The provided credentials are incorrect.',
        //     ], 401);
        // }
        // Generate an access token
        $token = $user->createToken('auth_token')->plainTextToken;
      
        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }
    public function logout(Request $request, $id) {
        \Log::info('Logout ID: ' . $id);
    
        $user = Admin::find($id);
        if ($user) {
            // Assuming that Auth::logout() will handle the current logged-in user
            Auth::logout(); 
    
            // Optionally, you can also invalidate the user's token here if using token-based authentication
            // Token::where('user_id', $id)->delete();
    
            return response()->json(['message' => 'Successfully logged out']);
        } else {
            \Log::error('User not found for ID: ' . $id);
            return response()->json(['message' => 'User not found'], 404);
        }
    }
    
}

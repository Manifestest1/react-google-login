<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Http\Request;
use App\Models\User;
use Auth;
use Validator;
use Hash;
use Password;

class GoogleController extends Controller
{
   public function checkUser(Request $request)
    {
        // Validate the request
        $request->validate([
            'email' => 'required|email',
        ]);
        $user = User::where('email', $request->email)->first();
        if ($user) {
            return response()->json(['exists' => true, 'user' => $user]);
        } else {
            return response()->json(['exists' => false]);
        }
    }
    public function registerUser(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'google_id' => 'required',
            'name' => 'required',
            'password' => 'required',
        ]);

        $user = User::create([
            'email' => $request->email,
            'name' => $request->name,
            'google_id' => $request->google_id,
            'password' => bcrypt($request->password),
            'imageurl' => $request->imageurl,
        ]);

        $token = $user->createToken('YourAppName')->accessToken;
        return response()->json(['token' => $token, 'user' => $user]);
    } 

    public function edit($id)
    {
        $user = User::find($id); 
        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }
    
        return response()->json([
            'user' => $user
        ], 200);
    }
    public function update(Request $request, $id)
    {
        // Log the ID for debugging
        \Log::info('User ID: ' . $id);
        localStorage.setItem('token', 'authToken ');
    
        // Validate the incoming request data
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$id,
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }
    
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }
    
        // Update the user's information
        $user->name = $request->input('name');
        $user->email = $request->input('email');
        $user->save();
        
        // Return a success response
        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user
        ], 200);
    }
    public function logout(Request $request, $id) {
        \Log::info('Logout ID: ' . $id);
    
        $user = User::find($id);
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

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            // 'email' => 'required|string|email',
            // 'password' => 'required|string',
        ]);
    
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
    
        // Retrieve the user by email
        $user = User::where('email', $request->email)->first();
        
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }
    
        $token = $user->createToken('auth_token')->plainTextToken;
       
        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }
    

    public function ragister(Request $request){
          
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|string',
           
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }
        $existingEmail = User::where('email', $request->email)->first();
        if ($existingEmail) {
                return response()->json(['message' => 'Email already exists.'], 409);
            }else{
     
        $user = User::create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'password' => Hash::make($request->input('password')),
        ]);
    }
       return response()->json([
        'message'=>'user ragister succesfully',
        'user'=>$user
       ]);
    }
    public function forgot_password(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Invalid email address'], 400);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status == Password::RESET_LINK_SENT) {
            return response()->json(['message' => 'Password reset link sent successfully'], 200);
        } else {
            return response()->json(['message' => 'Failed to send password reset link'], 500);
        }
    }

    public function reset(Request $request)
    {
        $validator = Validator::make($request->all(), [
             'token' => 'required',
            'password' => 'required|confirmed|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        }

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation',),
            function ($user, $password) {
                $user->password = Hash::make($password);
                $user->save();
            }
        );
        if ($status == Password::PASSWORD_RESET) {
            return response()->json(['message' => 'Password has been reset successfully'], 200);
        } else {
            return response()->json(['message' => 'Invalid token'], 400);
        }
    }
    // public function showuser(){
    //     $user = Name::get();
    //     return $user;
    // }
    }
    

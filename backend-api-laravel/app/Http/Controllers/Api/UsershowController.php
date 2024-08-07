<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Validator;

class UsershowController extends Controller
{
    public function showuser(){
        $user = User::get();
        return $user;
    }
    public function edit($id)
    {
        $user = User::find($id);
        return $user;
    
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
    
        return response()->json(['user' => $user], 200);
    }
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'nullable|string|max:255',
        ]);
    
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }
        
        $user = User::find($id);
    
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        if($request->type == 'status_update') {
            $user->is_active = $request->input('is_active', $user->is_active);
        }else{
            $user->name = $request->input('name', $user->name);
        }
        $user->save();
        
    
        return response()->json(['message' => 'User updated successfully', 'user' => $user], 200);        
    }
    public function delete($id){
        $user = User::find($id);
        return  $user->delete();
    }
}

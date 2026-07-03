<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'file' => ['required', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:10240'], // Allow up to 10MB images
        ]);

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            
            // Native Laravel Storage upload on the public disk
            $path = Storage::disk('public')->putFile('uploads', $file);
            $url = Storage::disk('public')->url($path);
            
            return response()->json([
                'success' => true,
                'message' => 'Image uploaded successfully.',
                'url' => $url,
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'No file uploaded.',
        ], 400);
    }
}

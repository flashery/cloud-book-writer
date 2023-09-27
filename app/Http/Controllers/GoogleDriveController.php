<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Google_Client;
use Google_Service_Drive;
use Google_Service_Drive_DriveFile;
use Google_Service_Drive_Permission;

class GoogleDriveController extends Controller
{
    private function getClient()
    {
        $client = new Google_Client();
        $client->setClientId(env('GOOGLE_DRIVE_CLIENT_ID'));
        $client->setClientSecret(env('GOOGLE_DRIVE_CLIENT_SECRET'));
        $client->setRedirectUri(url('/google-drive/callback'));
        $client->addScope(Google_Service_Drive::DRIVE_FILE);
        return $client;
    }

    public function redirectToProvider(Request $request)
    {
        session(['previous-url' => url()->previous()]);
        $client = $this->getClient();
        $authUrl = $client->createAuthUrl();
        return redirect($authUrl);
    }

    public function checkAuthStatus() {
        $token = session('token');
        if ($token) {
            // Here, you can also add further checks to see if the token is still valid.
            return response()->json(['authenticated' => true]);
        } else {
            return response()->json(['authenticated' => false]);
        }
    }

    public function handleProviderCallback()
    {
        $client = $this->getClient();
        $client->authenticate(request()->get('code'));
        session(['token' => $client->getAccessToken()]);
        return redirect(session('previous-url'));
    }

    public function upload(Request $request)
    {
        $result = $request->validate([
            'file' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $client = $this->getClient();
        $client->setAccessToken(session('token'));
        $driveService = new Google_Service_Drive($client);
        $file = new Google_Service_Drive_DriveFile();
        $file->setName(time() . '.' . $request->file->extension());
        $file->setMimeType('image/jpeg');  // set accordingly to your file
    
        $fileData = file_get_contents($request->file->path());

        $createdFile = $driveService->files->create($file, [
            'data' => $fileData,
            'uploadType' => 'multipart',
            'fields' => 'id'
        ]);

        $fileId = $createdFile->getId();

        $permission = new Google_Service_Drive_Permission();
        $permission->setRole('reader');  // 'reader' role allows read-only access
        $permission->setType('anyone');  // allows anyone to access the file

        $driveService->permissions->create($fileId, $permission);

        $url = "https://drive.google.com/uc?export=view&id={$fileId}"; // This will give you a link to view the file in Google Drive

        // Return the file name and URL as a response
        return response()->json(['url' => $url]);
    }
}

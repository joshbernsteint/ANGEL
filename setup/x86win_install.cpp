#include <windows.h>
#include <stdio.h>
#include <tchar.h>
#include <iostream>
#include <Lmcons.h>
#include <fileapi.h>
using namespace std;



/**
 * Creates a child process
 * @param cmd: Path to the executable
 * @param args: Command line arguments to the executable
 * @return Integer value representing if the process creation was a success(0) or failure(-1)
*/
int makeProcess(const char* cmd,const char* args ,STARTUPINFO &si, PROCESS_INFORMATION &pi){
    char* real_cmd = (char*)cmd;
    char* real_args = (char*)args;
    ZeroMemory( &si, sizeof(si) );
    si.cb = sizeof(si);
    ZeroMemory( &pi, sizeof(pi) );

    if(!CreateProcess(real_cmd, real_args, NULL, NULL, 0, CREATE_NO_WINDOW, NULL, NULL, &si, &pi))
    {
        //If there was an error in process creation
        printf("Error: makeProcess failed: %s %s returned an error.\n",cmd, args);
        return -1;
    }
    else{
        return 0;//The proccess was made successfully
    }
}



int main(){
    //Gets the username of the current user
    char username[UNLEN+1];
    DWORD username_len = UNLEN+1;
    GetUserName(username, &username_len);


    

    //Locates the Installation directory
    string install_path = string("C:\\Users\\") + string(username);
    string link = "https://github.com/joshbernsteint/ANGEL/releases/download/v0.1.1/Angel.zip"; //To be replaced with the latest download link
    cout << "Creating Installation Directory at: " << install_path << endl;

    STARTUPINFO zip_si;
    PROCESS_INFORMATION zip_pi;

    STARTUPINFO shortcut_si;
    PROCESS_INFORMATION shortcut_pi;
    
    string zip_path = install_path + string("\\Angel.zip");

    /**
     * For downloading the zip file
    */
    cout << "Downloading Zip File..." << endl;
    string zip_download_call = string("powershell.exe -Command ")+ string("(new-object System.Net.WebClient).DownloadFile('") + link + string("','") + zip_path + string("') \"\"");
    makeProcess(NULL,zip_download_call.c_str(), zip_si, zip_pi);
    WaitForSingleObject( zip_pi.hProcess, INFINITE);
    cout << "Zip file download!" << endl << "Extracting zip file...";


    /**
     * For extracting the zip file downloaded beforehand
    */
    string extract_call = string("powershell.exe -Command Expand-Archive '")+ zip_path + string("' '") + install_path + string("' \"\"");
    makeProcess(NULL,extract_call.c_str(), zip_si, zip_pi);
    WaitForSingleObject(zip_pi.hProcess, INFINITE);
    cout << "Zip file extracted!" << endl << "Removing Zip file..." << endl;
    if(remove(zip_path.c_str()) != 0){
        cout << "Error: Angel.zip was not able to be removed" << endl;
    }

    /**
     * Makes the shortcut for the executable
    */
    string shortcut_call = string("powershell.exe -Command $WshShell = New-Object -comObject WScript.Shell; $user = $Env:UserName; $location = 'C:/Users/' + $user + '/OneDrive/Desktop/Angel.lnk';$Shortcut = $WshShell.CreateShortcut($location);$Shortcut.IconLocation = '")
            + install_path + string("\\Angel\\Angel.ico';$Shortcut.TargetPath = '") + install_path + string("\\Angel\\Angel.exe';$Shortcut.Save() \"\"");
    cout << "Creating shortcut..." << endl;
    makeProcess(NULL,shortcut_call.c_str(), shortcut_si, shortcut_pi);
    WaitForSingleObject(shortcut_pi.hProcess, INFINITE);
    
    CloseHandle(zip_pi.hProcess);
    CloseHandle(zip_pi.hThread);
    CloseHandle(shortcut_pi.hProcess);
    CloseHandle(shortcut_pi.hThread);


    return 0;
}
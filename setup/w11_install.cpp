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
int makeProcess(char* cmd,char* args ,STARTUPINFO &si, PROCESS_INFORMATION &pi){
    ZeroMemory( &si, sizeof(si) );
    si.cb = sizeof(si);
    ZeroMemory( &pi, sizeof(pi) );

    if(!CreateProcess(cmd, args, NULL, NULL, 0, CREATE_NO_WINDOW, NULL, NULL, &si, &pi))
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

    //Creates the Installation directory
    string base_path = "C:\\Users\\";
    string install_path = base_path + string(username) + "\\Angel";
    cout << install_path << endl;
    CreateDirectory(install_path.c_str(), NULL);



    return 0;
}
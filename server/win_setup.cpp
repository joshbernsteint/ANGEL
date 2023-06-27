/*

Joshua Bernstein
6/27/2023

*/
#include <windows.h>
#include <stdio.h>
#include <tchar.h>

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

/**
 * Fills an empty array of chars with the values of a cha* cosnt
 * @param str: A const char*
 * @param target: A pointer to an array of chars
 * @param len: The size of the array of chars
 * @return An integer representing if filling the array was successful(0) or not(-1)
*/
int fillArray(const char* str,char* target,size_t len){
    size_t str_length = strlen(str)+1;
    if(str_length > len){
        return -1;
    }
    else{
        memset(target,'\0',len);
        memcpy(target,str,str_length);
        return 0;
    }
}

int _tmain()
{
    STARTUPINFO server_si;
    PROCESS_INFORMATION server_pi;

    STARTUPINFO app_si;
    PROCESS_INFORMATION app_pi;

    bool windowOpened = true;
    HWND windowReturn;

    const char* app_c = "./electron-app.exe";
    const char* server_c = "C:/Program Files/nodejs/node.exe";
    const char* server_a = " yt_server/server";

    const char* window_name = "__PLACEHOLDER__";

    char app_call[32];
    char server_call[64];
    char server_args[32];

    fillArray(app_c,app_call,32);
    fillArray(server_c,server_call,64);
    fillArray(server_a,server_args,32);

    FreeConsole();
    // Start the processes. 
    printf("Starting Processes\n");
    makeProcess(app_call,NULL,app_si,app_pi);
    makeProcess(server_call,server_args,server_si,server_pi);
    printf("Processes Created\n");
    
    

    // Wait until child process exits.
    while(windowOpened){
        WaitForSingleObject( app_pi.hProcess, INFINITE ); //Wait for the app to be closed by the user
        windowReturn = FindWindow(NULL,window_name);//Making sure the window was actually closed
        if(windowReturn == NULL){
            printf("App closed\n");
            windowOpened = false;
        }
        else{
            printf("App continuing to run!");
        }
    }
    printf("Server Terminating\n"); 
    TerminateProcess(server_pi.hProcess, 0);//Terminates the server downloading the videos
    

    // Close process and thread handles. 
    CloseHandle( app_pi.hProcess );
    CloseHandle( app_pi.hThread );
    CloseHandle( server_pi.hProcess );
    CloseHandle( server_pi.hThread );


    printf("Exiting Parent...\n"); 
    exit(0);
}
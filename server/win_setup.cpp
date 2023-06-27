#include <windows.h>
#include <stdio.h>
#include <tchar.h>
#include <iostream>


int makeProcess(char* cmd,char* args ,STARTUPINFO &si, PROCESS_INFORMATION &pi){
    ZeroMemory( &si, sizeof(si) );
    si.cb = sizeof(si);
    ZeroMemory( &pi, sizeof(pi) );

    if( !CreateProcess( cmd,   // No module name (use command line)
        args,        // Command line
        NULL,           // Process handle not inheritable
        NULL,           // Thread handle not inheritable
        FALSE,          // Set handle inheritance to FALSE
        CREATE_NO_WINDOW,              // No creation flags
        NULL,           // Use parent's environment block
        NULL,           // Use parent's starting directory 
        &si,            // Pointer to STARTUPINFO structure
        &pi )           // Pointer to PROCESS_INFORMATION structure
    )
    {
        printf( "CreateProcess failed (%d): %s.\n", GetLastError(),cmd );
        return -1;
    }
    else{
        return 0;
    }
}

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

int _tmain( int argc, TCHAR *argv[] )
{
    STARTUPINFO server_si;
    PROCESS_INFORMATION server_pi;


    STARTUPINFO app_si;
    PROCESS_INFORMATION app_pi;

    bool windowOpened = true;

    HWND windowReturn;
    bool firstTime = false;

    // char app_call[32] = {'.','/','e','l','e','c','t','r','o','n','-','a','p','p','.','e','x','e','\0'};
    // char app_call[32] = {'e','l','e','c','t','r','o','n','-','a','p','p','.','e','x','e','\0'};
    // char server_call[64] = {'n','o','d','e',' ','.','/','y','t','_','s','e','r','v','e','r','/','s','e','r','v','e','r','\0'};

    const char* app_c = "./electron-app.exe";
    const char* server_c = "C:/Program Files/nodejs/node.exe";
    const char* server_a = " yt_server/server";



    char app_call[64];
    char server_call[64];
    char server_args[64];

    fillArray(app_c,app_call,64);
    printf("%s\n",app_call);

    fillArray(server_c,server_call,64);
    fillArray(server_a,server_args,32);
    printf("%s\n",server_call);
    printf("%s\n",server_args);
    


    // Start the app process. 
    printf("Starting Processes\n");
    makeProcess(app_call,NULL,app_si,app_pi);
    makeProcess(server_call,server_args,server_si,server_pi);
    printf("Processes Created\n");
    
    

    // Wait until child process exits.
    FreeConsole();
    while(windowOpened){
        WaitForSingleObject( app_pi.hProcess, INFINITE );
        windowReturn = FindWindow(NULL,"__PLACEHOLDER__");
        if(windowReturn == NULL){
            printf("App closed\n");
            windowOpened = false;
        }
        else{
            printf("App continuing to run!");
        }
    }
    printf("App Terminating\n"); 
    printf("Server Terminating\n"); 
    TerminateProcess(server_pi.hProcess, 0);
    

    // Close process and thread handles. 
    CloseHandle( app_pi.hProcess );
    CloseHandle( app_pi.hThread );
    CloseHandle( server_pi.hProcess );
    CloseHandle( server_pi.hThread );


    printf("Exiting Parent...\n"); 
    exit(0);
}
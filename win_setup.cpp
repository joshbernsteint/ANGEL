/*

Joshua Bernstein
6/27/2023

*/
#include <windows.h>
#include <stdio.h>
#include <tchar.h>

#define window_name "ANGEL"
#define server_call_const "./server.exe"
#define RUN_PROCS 0

/**
 * @struct server_data
 * @brief Contains fields for the thread function to execute
*/
typedef struct server_data {
    STARTUPINFO server_info;
    PROCESS_INFORMATION server;
} processes_data;



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


/**
 * Checks if the window specified by window is open on the desktop
 * @param window: The name of the window that will be searched on the desktop
 * @return True if the window exists, false otherwise
*/
bool isOpen(const char* window){
    HWND windowReturn;
    windowReturn = FindWindow(NULL,window);
    if(windowReturn == NULL){
        return false;
    }
    else{
        return true;
    }
}

/**
 * Thread function to ensure the server process is continously running while the app is active
 * @param server_info: A pointer to a server_data struct
 * @return 0
*/
DWORD maintainServer(LPVOID server_info){
    processes_data* info = (processes_data*)server_info;
    char call[64];
    fillArray(server_call_const,call,64);

    bool appOpen = true;
    while(appOpen){
        WaitForSingleObject(info->server.hProcess, INFINITE);
        if((appOpen = isOpen(window_name))){
            makeProcess(call,NULL,info->server_info,info->server);
            printf("Restarting server...\n");
        }
    }

    return 0;
}


int _tmain()
{
    FreeConsole();
    STARTUPINFO server_si;
    PROCESS_INFORMATION server_pi;

    STARTUPINFO app_si;
    PROCESS_INFORMATION app_pi;

    server_data thread_struct;
    HANDLE thread_handle;

    const char* app_c = "./electron-app.exe";
    const char* server_c = server_call_const;
    // const char* server_a = "";
    bool windowOpened = true;

    char app_call[32];
    char server_call[64];
    // char server_args[32];

    fillArray(app_c,app_call,32);
    fillArray(server_c,server_call,64);
    // fillArray(server_a,server_args,32);

    // Start the processes. 
    #ifdef RUN_PROCS
    printf("Starting Processes\n");
    makeProcess(server_call,NULL,server_si,server_pi);
    makeProcess(app_call,NULL,app_si,app_pi);
    printf("Processes Created\n");

    thread_handle = CreateThread(NULL,0,maintainServer,&thread_struct,0, NULL);
    #endif

    thread_struct.server = server_pi;
    thread_struct.server_info = server_si;
    
    #ifdef RUN_PROCS
    // Wait until app process exits.
    while(windowOpened){
        WaitForSingleObject( app_pi.hProcess, INFINITE ); //Wait for the app to be closed by the user
        windowOpened = isOpen(window_name);
    }
    printf("Server Terminating\n"); 
    TerminateProcess(server_pi.hProcess, 0);//Terminates the server that downloads the videos
    TerminateThread(thread_handle, 0);


    // Close process and thread handles. 
    CloseHandle( app_pi.hProcess );
    CloseHandle( app_pi.hThread );
    CloseHandle( server_pi.hProcess );
    CloseHandle( server_pi.hThread );
    #endif


    printf("Exiting Parent...\n"); 
    exit(0);
}
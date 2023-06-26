#include <windows.h>
#include <stdio.h>
#include <tchar.h>

int _tmain( int argc, TCHAR *argv[] )
{
    STARTUPINFO si;
    PROCESS_INFORMATION pi;

    ZeroMemory( &si, sizeof(si) );
    si.cb = sizeof(si);
    ZeroMemory( &pi, sizeof(pi) );

    // char server_call[32] = {'n','o','d','e',' ','s','e','r','v','e','r','\0'};
    char app_call[32] = {'.','/','e','l','e','c','t','r','o','n','-','a','p','p','.','e','x','e','\0'};
    // Start the child process. 
    if( !CreateProcess( NULL,   // No module name (use command line)
        app_call,        // Command line
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
        printf( "CreateProcess failed (%d).\n", GetLastError() );
        return -1;
    }

    // Wait until child process exits.
    FreeConsole();
    WaitForSingleObject( pi.hProcess, INFINITE );

    // Close process and thread handles. 
    CloseHandle( pi.hProcess );
    CloseHandle( pi.hThread );

    fclose(stdout);

    return 0;
}
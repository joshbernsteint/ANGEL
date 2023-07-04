/*
Joshua Bernstein
6/29/2023
*/

#include <unistd.h>
#include <signal.h>
#include <sys/wait.h>
#include <stdio.h>
#include <pthread.h>



#define PRINT(str) printf("%s\n",str);
#define CreateProcess(exe_path,var) if((var = fork()) != -1){execlp(exe_path,NULL);}else{printf("Fork on path: %s failed.\n",exe_path); exit(1);}

int main(){

    pid_t app = 0, server = 0;

    char* app_path = "";
    char* server_path = "";

    // close(stdout);

    PRINT("Starting Processes...");
    CreateProcess(server_path,server);
    CreateProcess(app_path,app);
    PRINT("Processes successfully started");


    waitpid(app,NULL,0);
    PRINT("App closed");
    PRINT("Server Terminating");
    kill(server_path,SIGKILL);
    wait(NULL);

    PRINT("Exiting Parent...");

    return 0;
}
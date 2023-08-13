/*
This file contains macros used for printing efficiently and with colors
*/

//Color Macros
#define     BASE                    "\x1B[0m"
#define     RED                     "\x1B[31m"
#define     GREEN                   "\x1B[32m"
#define     YELLOW                  "\x1B[33m"
#define     BLUE                    "\x1B[34m"
#define     PURPLE                  "\x1B[35m"
#define     CYAN                    "\x1B[36m"
#define     WHITE                   "\x1B[37m"


//Printing Macros
#define     TOCONSOLE(str)          printf("%s\n",str);
#define     PRINTC(color,str)       printf("%s%s%s\n",color,str,BASE);
#define     PRINTE(str)             fprintf(stderr, "%sError: %s%s\n",RED,str,BASE);
#define     DEBUG(i)                printf("%d\n",i);

//Communication buffers
#define     BUF_LEN                 64
#define     TOKEN_ERROR             "1"
#define     TOKEN_CORRECT           "0"
#define     TOKEN_ERROR_MSG         "Connection Stopped - Verification Token Refused"
#define     TOKEN_CORRECT_MSG       "Connection sustained - Token Correct"
#define windows


#include <windows.h>
#include <conio.h>
#define changeColor(color) SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), color);



#include "printing.h"
#include "utils.h"
#include <iostream>
#include <fstream>
#include <string>
#include <stdio.h>
using namespace std;


/**
 * Encodes the version string as an integer for easier comparison
 * @param version Software version represented as a string of numbers and decimals (ex: 0.6.2)
 * @returns An integer that is an encoded version of that string
*/
int encodeVersion(const string version){
    int result = 0;
    int place = 1;
    char cur = '0';
    const size_t str_length = version.length();
    for (int i = str_length-1; i >= 0; i--){
        cur = version[i];
        if(cur == '.'){
            place *= 100;
        }
        else{
            result += (cur-48)*place;
        }
    }
    return result;
}



int main(){
    const string file_name = "cur.version";
    string cur_line;
    int version_code = 0;


    //User window
    changeColor(RED)
    cout << "ANGEL";
    changeColor(CYAN);
    cout << " Update Utility" << endl << endl;
    changeColor(YELLOW);
    cout << "Determining current version..." << endl;


    //Checking if version is the current version
    ifstream version_file;
    version_file.open(file_name);
    //If cur.version is not found
    if(version_file.fail()){
        changeColor(RED);
        cout << "Error: Opening Version File failed" << endl;
        changeColor(YELLOW);
        cout << "Current saved version (Possibly not accurate): " << VERSION << ". Using that value as proxy" << endl;
        version_code = encodeVersion(VERSION);
        
    }
    else{
        getline(version_file, cur_line);
        changeColor(GREEN);
        cout << "Current Version: " << cur_line << endl << endl;

        changeColor(YELLOW);
        cout << "Searching for updates..." << endl;
        version_code = encodeVersion(cur_line);
    }

    



    changeColor(BASE);
    return 0;
}

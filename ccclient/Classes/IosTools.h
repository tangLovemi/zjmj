//
//  IosTools.h
//  scmjclient
//
//  Created by 马超 on 16/4/27.
//
//

#ifndef IosTools_h
#define IosTools_h

#include <iostream>
class IosTools
{
public:
    static std::string getBuildVersion();
    static std::string getVersion();
    static std::string getFullVersion();
};

#endif /* IosTools_h */

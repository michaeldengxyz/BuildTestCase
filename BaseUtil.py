#Pyhton 3.x
# -*- coding: UTF-8 -*-

import pymysql

import traceback
import sys,os
import time
import datetime
import random
import hashlib
import re


def ConnectDB():
    db = None
    
    config={
        "host":"127.0.0.1",
        'port':3306,
        "user":"we2",
        "password":"12345$9876",
        "database":"build_story",
        'charset':'utf8mb4',
    }
    
    try:
        db = pymysql.connect(**config)
    except:
        print("\n.... Failed to connect database:")
        print(traceback.format_exc())
        
    if not db:                                             
        sys.exit(0) 
                   
    return db

        
def RepleaseSysConfig():
    db = ConnectDB()
    cursor = db.cursor()
    
    sql = "SELECT `id`,`prere` from `testcases` WHERE idx in (SELECT distinct `idx` from  `testcases` where `module` = 'ID07-Checklist') AND `prere` is not null Limit 10"    
    try:                                                                                                                                          
        cursor.execute(sql)
        results = cursor.fetchall() 
        #print(results)
        for p in results:
            if re.match(r'', p[1], re.M):
                print(p)

    except:
        error = traceback.format_exc()
        print(error)

    if db:  
        cursor.close()
        db.close() 



def printStruct(struc, indent=0):
    if isinstance(struc, dict):
        print('  '*indent+'{')
        for key,val in struc.items():
            if isinstance(val, (dict, list, tuple)):
              print ('  '*(indent+1) + str(key) + '=> ')
              printStruct(val, indent+2)
            else:
              print('  '*(indent+1) + str(key) + '=> ' + str(val))
        print('  '*indent+'}')
        
    elif isinstance(struc, list):
        print('  '*indent + '[')
        for item in struc:
            printStruct(item, indent+1)
        print('  '*indent + ']')
      
    elif isinstance(struc, tuple):
        print('  '*indent + '(')
        for item in struc:
          printStruct(item, indent+1)
        print('  '*indent + ')')
        
    else: 
        print ('  '*indent + str(struc))         
             
    
if __name__ == "__main__":
    RepleaseSysConfig()
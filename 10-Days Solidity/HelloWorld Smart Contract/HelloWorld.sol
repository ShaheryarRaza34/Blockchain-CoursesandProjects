//SPDX-License-Identifier: UNLICENSED
pragma solidity >= 0.8.0;
contract HelloWorls{
    event messagechanged(string oldmessage,string newmessage);
    string public message;
    constructor (string memory firstmessage){
        message=firstmessage;
    }
    function update(string memory newmessage)public{
        string memory oldmessage= message; 
        message=newmessage;
        emit messagechanged(oldmessage,newmessage);
    }
    function updateNoInput()public{
        string memory oldmessage=message;
        message="Hello World";
        emit messagechanged(oldmessage,message);
    }
}
// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/utils/Counters.sol";

contract hasingDapp{

    using Counters for Counters.Counter;
    Counters.Counter private peopleCounter;
    Counters.Counter private messageCounter;

    struct Person{
        string name;
        address personAddress;
    }

    struct message{
        uint id;
        string  text;
        bytes32 signature;
        address sender;
        address to;
        bool verified;
    }

    string[] public persons;

    message[] public messages;

    mapping(string=>address) persontoAddressMapping;
    mapping(address=>bool)  doesAddressExist;
    mapping(string=>bool) doesNameExist;

    


    function register(string calldata name) public {
        require(!doesNameExist[name],"name already registered");
         require(!doesAddressExist[msg.sender],"name already registered");
        persons.push(name);
        peopleCounter.increment();
        persontoAddressMapping[name] = msg.sender;
        doesAddressExist[msg.sender] = true;
        doesNameExist[name]= true;    
    }

    function sign(string memory body, address to ) public{
  
     bytes32 hashResult = getMessageHash(to,body);
     bytes32 signature = getEthSignedMessageHash(hashResult);
        messages.push(message(messageCounter.current(),body,signature,msg.sender,to,false));
         messageCounter.increment();
    }

      function getMessageHash(
        address _to,
        string memory _message
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_to, _message));
    }


    function getEthSignedMessageHash(bytes32 _messageHash)
        public
        pure
        returns (bytes32)
    {
        /*
        Signature is produced by signing a keccak256 hash with the following format:
        "\x19Ethereum Signed Message\n" + len(msg) + msg
        */
        return
            keccak256(
                abi.encodePacked("\x19Ethereum Signed Message:\n32", _messageHash)
            );
    }


   function verify(
        uint id,
        address _signer,
        address _to,
        string memory _message,
        bytes memory signature
    ) public  returns (bool) {
        bytes32 messageHash = getMessageHash(_to,_message );
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);

        if(recoverSigner(ethSignedMessageHash, signature) == _signer){
            messages[id].verified = true;
            return true;
        }
        else{
            return false;
        }
    }

    function recoverSigner(bytes32 _ethSignedMessageHash, bytes memory _signature)
        public
        pure
        returns (address)
    {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);

        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

    function splitSignature(bytes memory sig)
        public
        pure
        returns (
            bytes32 r,
            bytes32 s,
            uint8 v
        )
    {
        require(sig.length == 65, "invalid signature length");

        assembly {
            /*
            First 32 bytes stores the length of the signature

            add(sig, 32) = pointer of sig + 32
            effectively, skips first 32 bytes of signature

            mload(p) loads next 32 bytes starting at the memory address p into memory
            */

            // first 32 bytes, after the length prefix
            r := mload(add(sig, 32))
            // second 32 bytes
            s := mload(add(sig, 64))
            // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(sig, 96)))
        }

        // implicitly return (r, s, v)
    }

     function getTotalMessageCount() public view returns(uint){
         return messageCounter.current();
     }

     function getTotalPeopleCount() public view returns(uint){
         return peopleCounter.current();
     }

     function getPeople() public view returns(string[] memory){
         return persons;
     }

     function getMessages() public view returns(message[] memory){
         return messages;
     }


}


import React, { useState, useEffect} from "react";
import { Link } from "react-router-dom";

// components

import Navbar from "components/Navbars/newAuthNavbar";
import Footer from "components/Footers/Footer.js";
import hashingDapp from "../contracts/hashingDapp.json";
import { ethers } from "ethers";
import { useHistory } from "react-router-dom";
import CryptoJS from "crypto-js";

export default function Landing() {
// web2
const history = useHistory();
const [people,setpeople] = useState([]);
const [messageFor,setMessageFor] = useState('agent poles');
const [messageText,setMessageText]= useState('');
const [encodedText, setEncodedText] = useState('');
const [messageSig,setMessageSig]= useState('');
const [messageto,setMessageto] = useState('');
const [messageVerified,setMessageVerified]= useState(false);
const [messageId,setMessageId]= useState(0);
const [dvibe,setDvibe] = useState('');
const [messageSender,setMessageSender] = useState('');
const [messageread,setMessageread]= useState('');
// const [message,setMessage] = useState({});
const [finalMessage, setFinalMessage] = useState("");


//web 3 stuff
const contractAddress = '0x67f35FC44DeD112e9E841027e7Bd3B59f6494e58';
const contractAbi = hashingDapp.abi;

//web 3 related states
const [isWalletConnected, setIsWalletConnected] = useState(false);
const [userAddress, setUserAddress] = useState('');




const checkIfWalletIsConnected = async () => {
  try {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];
     
      setUserAddress(account);
      // checkIfUserIsRegistered();
      console.log("Account Connected: ", account);
      setIsWalletConnected(true);
    } else {
      alert("no wallet detected")
    }
  } catch (error) {alert('error')};
};


const checkIfUserIsRegistered = async () =>{
if(window.ethereum && isWalletConnected){
  try{
  
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const hashContract = new ethers.Contract(
    contractAddress,
    contractAbi,
    signer
  );
  let userState = await hashContract.getIfAddressExists(userAddress);
  if(userState){
//  history.push('/dapp')
  }
  else{
    history.push('/')

  }
 }catch (e){
  alert(e);
 }
}
else{
  alert('please connect wallet')
}
 
}

const getVibes = async(name)=>{
  if(window.ethereum && isWalletConnected){
    try{
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const hashContract = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );
    let vibe = await hashContract.getAddress(name);
    setDvibe(vibe);
    console.log(vibe);
    return vibe;
   
   }catch (e){
    alert(e);
   }
  }
  else{
    alert('please connect wallet')
  }
   

}
const sendMessage = async (text,vibee)=>{
  if(window.ethereum && isWalletConnected){
    try{
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const hashContract = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );
    // console.log(dvibe);
     await hashContract.sign(text,vibee);
    
    getMessage();
   
   }catch (e){
    alert(e);
   }
  }
  else{
    alert('please connect wallet')
  }
   
}


const getMessage = async ()=>{
  if(window.ethereum && isWalletConnected){
    try{
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const hashContract = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );
    let messagee =  await hashContract.getMessage();
    let stringOutput = messagee.toString();
    let array = stringOutput.split(',');
    setMessageText(array[1]);
    setMessageId(array[0]);
    setMessageSig(array[2]);
    setMessageSender(array[3]);
    setMessageto(array[4]);
    setMessageVerified(array[5]);
    console.log(array[4])
    await getReaderName(array[4]);
    console.log(messagee.toString())
    // console.log(encodedText);
    
    
   
   }catch (e){
    alert(e);
   }
  }
  else{
    alert('please connect wallet')
  }
}


const getReaderName = async (address)=>{
  if(window.ethereum && isWalletConnected){
    try{
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const hashContract = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );
    let messagee =  await hashContract.getUserName(address);
    console.log(messagee);
   let output = messagee.toString();
   setMessageFor(output);
  
    
    
   
   }catch (e){
    alert(e);
   }
  }
  else{
    alert('please connect wallet')
  }

}


 //background operation
 useEffect(() => {
       
  checkIfWalletIsConnected();
  if(isWalletConnected){checkIfUserIsRegistered();
  getMessage();
  }
  
//   getTotalNumberOfMembers();
//   getTotalNumberOfProposals();
//   getTotalVoteCount();
//   getCurrentState();
//   getListOfProposals();
//   setWatchStates(1);

}, [
isWalletConnected,
// totalNumberOfMember,
// totalNumberOfProposal,
// totalVoteCount,
// currentState,
// watchStates,
]);



  //web 2 stuff





  //web 2 functions

  const prep = (body,vibe) =>{
    sendMessage(CryptoJS.AES.encrypt(body, vibe).toString(),vibe);
  
   
  
    
    // console.log(messageText);
  }

const readMessage = (e)=>{

  
  // console.log(userAddress);
  // console.log(messageText);
  // if(isWalletConnected){
  // const bytes = CryptoJS.AES.decrypt(messageText, userAddress);
  
  // console.log(bytes.toString(CryptoJS.enc.Utf8));
  // // setMessageread(originalText);
  // // console.log(originalText);
  // // return originalText;}
  // }
  let output = encryptWithAES("hello");
  console.log(output);
  let newoutput = decryptWithAES(output);
  console.log(newoutput);
  

}

const writeMessage = async (e)=>{
  e.preventDefault();
  if(messageText.length>0&&messageFor.length>0){
      let vibe = await getVibes(messageFor);
      
      prep(messageText,vibe);
     
    //  await getMessage();
      
  }
}

const verifyMessage = (e)=>{

}

const handleNameInputChange = (e)=>{
setMessageFor(e.target.value);
}

const handleMessageInputChange = (e)=>{
//  setMessage(...message.text=e.target.value);
 setMessageText(e.target.value);

}


const encryptWithAES = (text) => {
  const passphrase = '123';
  return CryptoJS.AES.encrypt(text, passphrase).toString();
};

const decryptWithAES = (ciphertext) => {
  const passphrase = '123';
  const bytes = CryptoJS.AES.decrypt(ciphertext, passphrase);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
};

  return (
    <>
      <Navbar transparent connected= {isWalletConnected} checkConnection={checkIfWalletIsConnected} />
      <main>
        <section className="pb-10 bg-blueGray-800">
          <div className="bottom-auto top-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden -mt-20 h-20">
            <svg
              className="absolute bottom-0 overflow-hidden"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon
                className="text-blueGray-800 fill-current"
                points="2560 0 2560 100 0 100"
              ></polygon>
            </svg>
          </div>

          <div className="container mx-auto px-4 lg:pt-24 lg:pb-64">
            <div className="flex flex-wrap text-center justify-center">
              <div className="w-full lg:w-6/12 px-4">
                <h2 className="text-4xl font-semibold text-white">
                  Encrypted 🛡
                </h2>
                <p className="text-lg leading-relaxed mt-4 mb-4 text-blueGray-400">
                  Send messages trustlessly over the decentralized web
                </p>
              </div>
            </div>
            <div className="flex flex-wrap mt-12 mb-20 justify-center">
              <div className="w-full lg:w-3/12 px-4 text-center">
                <div className="text-blueGray-800 p-3 w-12 h-12 shadow-lg rounded-full bg-white inline-flex items-center justify-center">
                  <i className="fas fa-medal text-xl"></i>
                </div>
                <h6 className="text-xl mt-5 font-semibold text-white">
                  write a message
                </h6>
                <p className="mt-2 mb-4 text-blueGray-400">
                  you write something to anyone
                </p>
              </div>
              <div className="w-full lg:w-3/12 px-4 text-center">
                <div className="text-blueGray-800 p-3 w-12 h-12 shadow-lg rounded-full bg-white inline-flex items-center justify-center">
                  <i className="fas fa-poll text-xl"></i>
                </div>
                <h5 className="text-xl mt-5 font-semibold text-white">
                  Sign it
                </h5>
                <p className="mt-2 mb-4 text-blueGray-400">
                  leverage our signing algorithm
                </p>
              </div>
              <div className="w-full lg:w-3/12 px-4 text-center">
                <div className="text-blueGray-800 p-3 w-12 h-12 shadow-lg rounded-full bg-white inline-flex items-center justify-center">
                  <i className="fas fa-lightbulb text-xl"></i>
                </div>
                <h5 className="text-xl mt-5 font-semibold text-white">
                  Send it
                </h5>
                <p className="mt-2 mb-4 text-blueGray-400">
                  share freely across the web, only the intended person can read
                  it
                </p>
              </div>
            </div>
            <div className="mt-20 mx-auto lg:w-6/12 sm:pt-0  justify-center container">
              <h2 className="font-semibold text-4xl text-white">
               Message 
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-white">
               this is a message for 
                <a
                  href=""
                  className="text-blueGray-600"
                  target="_blank"
                >
                  {" "+messageFor+" "}
                </a>
                {messageText}
              </p>
              <p>messageOutput</p>
              <p>{messageread}</p>
              <div className="mt-12">
                <button
                 onClick={(e)=>verifyMessage(e)}
                  className="get-started text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-1 bg-lightBlue-500 active:bg-lightBlue-600 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150"
                >
                  verify
                </button>
                <button
                  onClick={(e)=>readMessage(e)}
                  className="github-star ml-1 text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-1 bg-blueGray-700 active:bg-blueGray-600 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150"
                  
                >
                  read
                </button>
              </div>
            </div>
          </div>
         
        </section>
  
        <section className="py-24 lg:pt-20 bg-blueGray-800">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center lg:-mt-64 -mt-48">
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200">
                  <div className="flex-auto p-5 lg:p-10">
                    <h4 className="text-2xl font-semibold">
                      Write your message
                    </h4>
                    <p className="leading-relaxed mt-1 mb-4 text-blueGray-500">
                     we leverage the blockchain to keep you safe
                    </p>
                    <div className="relative w-full mb-3 mt-8">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="full-name"
                      >
                        receipient
                      </label>
                      <input
                        type="text"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Name"
                        name="to"
                        onChange={(e)=>handleNameInputChange(e)}
                      />
                    </div>

                   

                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="message"
                      >
                        Message
                      </label>
                      <textarea
                        rows="4"
                        cols="80"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                        placeholder="Type a message..."
                        name="text"
                        onChange={(e)=>handleMessageInputChange(e)}
                      />
                    </div>
                    <div className="text-center mt-6">
                      <button
                        className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={(e)=>writeMessage(e)}
                      >
                        Send Message
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
          <div className="mx-auto w-6/12 block pb-6 mt-10">

            {people.map((person)=>{
 <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blueGray-500 bg-white uppercase last:mr-0 mr-2 mt-2">
 {person}
</span>
            })}
               
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blueGray-500 bg-white uppercase last:mr-0 mr-2 mt-2">
                  Dropdowns
                </span>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blueGray-500 bg-white uppercase last:mr-0 mr-2 mt-2">
                  Menus
                </span>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blueGray-500 bg-white uppercase last:mr-0 mr-2 mt-2">
                  Modals
                </span>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blueGray-500 bg-white uppercase last:mr-0 mr-2 mt-2">
                  Navbars
                </span>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blueGray-500 bg-white uppercase last:mr-0 mr-2 mt-2">
                  Popovers
                </span>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blueGray-500 bg-white uppercase last:mr-0 mr-2 mt-2">
                  Tabs
                </span>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blueGray-500 bg-white uppercase last:mr-0 mr-2 mt-2">
                  Tooltips
                </span>
              </div>
        </section>
       
      </main>
    </>
  );
}

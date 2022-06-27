import React, { useState, useEffect} from "react";
import Navbar from "components/Navbars/newAuthNavbar";
import FooterSmall from "components/Footers/FooterSmall.js";
import metamsk from "../assets/img/metamsk.png"
import hashingDapp from "../contracts/hashingDapp.json";
import { ethers } from "ethers";
import { useHistory } from "react-router-dom";

export default function Register() {

//web3 variables
const contractAddress = '0x67f35FC44DeD112e9E841027e7Bd3B59f6494e58';
const contractAbi = hashingDapp.abi;

//web 3 related states
const [isWalletConnected, setIsWalletConnected] = useState(false);
const [userAddress, setUserAddress] = useState('');
const [contractInstance, setContractInstance] = useState({});

    //web 2 states
    const [username,setUsername] = useState("")
    const history = useHistory();



//web 3 functions
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
   history.push('/dapp')
    }
    else{

    }
   }catch (e){
    alert(e);
   }
}
else{
    alert('please connect wallet')
}
   
  }

  const getContractInstance = () =>{

    try{

        if(window.ethereum && isWalletConnected){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const hashContract = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );

    setContractInstance(hashContract);
        }else{
            alert('no wallet detected');
        }
    }
    catch (e){
        alert(e);
    }
  }

  const doRegisteration = async() =>{
   
    if(isWalletConnected&&window.ethereum){

    
    try{
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const hashContract = new ethers.Contract(
          contractAddress,
          contractAbi,
          signer
        );
    await hashContract.register(username);
    checkIfUserIsRegistered();
  }
  catch (e){
    alert(e);
  }
}else{
    alert('please connect wallet')
}
  }
    
    
    
    //web 2 functions
    
    const registerUser = (e)=>{
     if(username.length>0){
        e.preventDefault();
    doRegisteration();
     }
     else{
        alert('please enter a proper name');
     }
    }

    const handleUseNameChange = (e)=>{
        setUsername(e.target.value)

    }



    //background operation
    useEffect(() => {
       
          checkIfWalletIsConnected();
          if(isWalletConnected){checkIfUserIsRegistered();}
          
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




  return (
    <>
    <Navbar transparent connected= {isWalletConnected} checkConnection={checkIfWalletIsConnected}/>
      <main>
        <section className="relative w-full h-full py-40 min-h-screen">
          <div
            className="absolute top-0 w-full h-full bg-blueGray-800 bg-no-repeat bg-full"
            style={{
              backgroundImage:
                "url(" + require("assets/img/register_bg_2.png").default + ")",
            }}
          ></div>
      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
              <div className="rounded-t mb-0 px-6 py-6">
                <div className="text-center mb-3">
                  <h6 className="text-blueGray-500 text-sm font-bold">
                    Register
                  </h6>
                </div>
                <div className="btn-wrapper text-center">
                  <span
                    className="bg-white active:bg-blueGray-50 text-blueGray-700 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-2 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
                    type="button"
                  >
                    <img
                      alt="..."
                      className="w-5 mr-1"
                      src={metamsk}
                    />
                    Encrypted
                  </span>
               
                </div>
                <hr className="mt-6 border-b-1 border-blueGray-300" />
              </div>
              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <div className="text-blueGray-400 text-center mb-3 font-bold">
                  <small>what name should people message you with</small>
                </div>
                <form>
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Name
                    </label>
                    <input
                      type="email"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Name"
                      onChange={(e)=>handleUseNameChange(e)}
                    />
                  </div>

            

              

                  <div>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        id="customCheckLogin"
                        type="checkbox"
                        className="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                      />
                      <span className="ml-2 text-sm font-semibold text-blueGray-600">
                        I agree with the{" "}
                        <a
                          href="#pablo"
                          className="text-lightBlue-500"
                          onClick={(e) => e.preventDefault()}
                        >
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                  </div>

                  <div className="text-center mt-6">
                    <button
                      className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                      type="button"
                      onClick={(e)=>registerUser(e)}
                    >
                      Create Account
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    
      </section>
      </main>
    </>
  );
}

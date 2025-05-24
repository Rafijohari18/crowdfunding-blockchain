import { useEthers } from "@usedapp/core";
import { ChevronDown, LogIn, LogOut } from "lucide-react";
import React, { useState } from "react";
import ProgramSelection from "./components/ProgramSelection";

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const {
    activateBrowserWallet,
    account,
    deactivate
  } = useEthers();

  let formattedAccount = '';
  if (account) {
    formattedAccount = `${account.slice(0, 6)}...${account.slice(-4)}`;
  }

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <div className="header-wrapper flex justify-between items-center py-4">
            <a
              className="relative inline-flex items-center tap-highlight-transparent outline-none focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2 text-medium text-primary no-underline hover:opacity-80 active:opacity-disabled transition-opacity"
              href="/"
            >
              {/* Logo placeholder */}
            </a>
              {
                account ?
                  <div className="relative inline-block text-left">
                    <button
                      onClick={() => setIsOpen(!isOpen)}
                      className="px-4 py-2 bg-blue-600 rounded-full text-white shadow-sm flex items-center gap-2"
                    >
                      Profile <ChevronDown size={16} />
                    </button>
                    {isOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white border rounded-md shadow-lg">
                        <div className="p-4">
                          <p className="text-sm text-gray-500">Account </p>
                          <p className="text-sm font-medium truncate max-w-[150px] overflow-hidden text-ellipsis">{formattedAccount}</p>
                        </div>
                        {/* <div className="py-2">
                          <button className="w-full text-left px-4 py-2 hover:bg-gray-100" >Disconnect</button>
                        </div> */}
                        <div className="border-t">
                          <button
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500 flex items-center gap-2"
                            onClick={() => deactivate()}
                          >
                            <LogOut size={16} />
                            Putuskan
                          </button>
                        </div>

                      </div>
                    )}
                  </div>
                  :

                  <button
                    onClick={() => activateBrowserWallet()}
                    className="px-4 py-2 bg-blue-600 rounded-full text-white shadow-sm flex items-center gap-2"
                  >
                    Hubungkan <LogIn size={16} />
                  </button>
              }
          </div>
        </div>
      </header>

      <div className="container-mobile p-4">
        <div className="app-wrapper">
          <div className="info-wrapper text-center">
            <div className="info-wrapper-item flex flex-col items-center">
              <img
                src="https://app.nucare.global/static/donation_receive_3768928.svg"
                alt=""
                className="w-16 h-16"
              />
              <span className="mt-2 font-semibold">Infaq/Sadaqah</span>
            </div>
            <span className="app-description block mt-2 text-gray-700">
            Let's share kindness and purify our hearts by contributing through Infaq/Sadaqah at Babagi Yuk.
            </span>
          </div>

          <ProgramSelection account={account} />
        </div>
      </div>
    </div>
  );
};

export default App;

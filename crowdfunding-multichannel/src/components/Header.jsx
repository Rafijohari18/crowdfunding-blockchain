import { useEthers } from "@usedapp/core";
import { BookText, ChevronDown, LogIn, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false);
    const { activateBrowserWallet, account, deactivate } = useEthers();

    let formattedAccount = account
        ? `${account.slice(0, 6)}...${account.slice(-4)}`
        : "";

    return (
        <header className="header">
        <div className="container">
            <div className="header-wrapper flex justify-between items-center py-4">
            <a
                className="relative inline-flex items-center tap-highlight-transparent outline-none focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2 text-medium text-primary no-underline hover:opacity-80 active:opacity-disabled transition-opacity"
                href="/"
            >
                {/* Logo placeholder */}
            </a>

            {account ? (
                <div className="relative inline-block text-left">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="px-4 py-2 bg-blue-600 rounded-full text-white shadow-sm flex items-center gap-2"
                >
                    Profile <ChevronDown size={16} />
                </button>

                {isOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border rounded-md shadow-lg z-1">
                        <div className="p-4">
                            <p className="text-sm text-gray-500">Account</p>
                            <p className="text-sm font-medium truncate max-w-[150px] overflow-hidden text-ellipsis">
                            {formattedAccount}
                            </p>
                        </div>

                        <div className="border-t">
                            <button
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                            onClick={() => navigate('/report')}
                            >
                            <BookText size={16} className="text-green-500" />
                            Report
                            </button>
                            <button
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                            onClick={() => deactivate()}
                            >
                            <LogOut size={16} className="text-red-500" />
                            Disconnect
                            </button>
                        </div>
                    </div>
                )}
                </div>
            ) : (
                <button
                onClick={() => activateBrowserWallet()}
                className="px-4 py-2 bg-blue-600 rounded-full text-white shadow-sm flex items-center gap-2"
                >
                <img class="walletconnect" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAASNSURBVHgBvVVpaFxVFD7nvm3eLJmkHVMSbaNJCkWsJEqgDRiNxZBoNSpUIUixFJEqQusvfyj4x1+xVQuCUlBQpEUQUrCmwaVu1ZB0LBqUNE3StGnTJjXL7G/mvXuP9700k8lMGhC0B4Z37z37d5YBuBV0bN99e6YPN9fBf0BEgJfebmw5sqeh073joV3bTVIzl8MBKH+gVjldbrIPK/c/dhTxTfGvDH9yb+DadWP3XEZ09V/gzTEL51/97GwED3Y17EKAz12hoA7UsFGhmvXsMgk6Sqb6QdW+/om1or16sHkTMudlhdELozMiHJ0UaHPy+BpTW/GdroaP5fX5QsWt1YzuqVaQSc+qBieDAZYutS4glcaqnE3bpD4OTnAavS6wUAQR3lIJAYFW6g5NCZycF9RSr2IIsF04whVeQVwCKI1D0iI4dZ5DwiIszRDDjBGOwiq0kAH8doTDtYSgrF3Kz2YBJucE9f7lGV/NhBvUWYZMjMBNKJUl+GaYY/QCJyqy0T/O6acxnsd7NVKRxplgbBLWILcOmEsiCJHvKp5zQOMppDX0XJ6EaEZVCHTnJkK6ZG6vSsLtQRsE+VEB5r0LwWFrJAM+RcAfsyZkHVai6xaEO8zHLEU9J73Fir1XBoVor4mRa9x748tFXMJrc0UW2msSVG7CasmMlwWS59WwLmbTOfhdYdiyIQxQexuD2krpPRZnwl6etcIiyBnJnwMax84tGXB8Ibg0SzA2I2BqweNH9350LuFFNd7d9Ny6EH3q0xaDTMczkImnvVyWejhQEQLD7/POmWQaMrFUPluQyfnLg2CGFvnpHIFF7KnqlwZ6VPfhjvX4iChMUvFDimsSa/IMuG41oYFxg20Lk+K2loeMyU4IaGpe3a8jhBg0yWMPo686DAlEWyF4pp8gXGbAlRSj7t90GJ5noLDlQiqKgr9cVeD9IR2mMwqFwwb4fLCCHE573S9mjzQ9SwyOQRHlcu6Ig7gYB5aQaG2JMDBN7vFSKRXOTDtUF0GsNEC47aVppXVWdKVVBQUfdbfWEhRL5CoIgVgfWVTMWpQXYbI9H6xzzwScIypKQQPc+HptmhUdqmXBQ9zxNqP3y+WIYjEH3d1TUa6SP4Co6e7SWzai68KLyZYdHI9xSCa5p1tRoQpVlTsSvTUhoaQ21c6J7+XE7V6OHNEwUEhHTEiGZSFkKUAnJnQaHIu7iti40RRP1FlItuPi6PYy+k0mZGnYUqAuyXn8lckFMFiMXTCkuhmQVABedqdINeyH4yM+EZ1CPHMF4Ythg5KNryE31oEmRRW5dEw/K9mmmoEncOq9+zdpxC4Wz6JtU5w2dwRzNW1M8kTvqR+95eLVw3bEk+07FDdUfaIPYPRkVteZUagvm47mMGJ6Cn+/2/SnlL1bRj0vr8dlpj0LwvzB2vZ6p/T7BhLdlc5kChYOgd/0S2Aoqilad93pA30LYDxOKNokXjulrXL5D/LdhgMDOzwHC4eanrEZWRGTevHFaMn2H/r566c5t1tXPHLxZcPDO/uKZelwvZFg62RnApW9MtAD/zf9A/oRGbW7so+mAAAAAElFTkSuQmCC" alt="Metamask"></img>
                Connect Via Metamask
                </button>
            )}
            </div>
        </div>
        </header>
    );
};

export default Header;

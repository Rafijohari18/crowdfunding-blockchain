import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useContractFunction, useEtherBalance, useEthers } from "@usedapp/core";
import { ethers, utils } from "ethers";
import { abi } from "../abi/abi";
import { Contract } from '@ethersproject/contracts'

const TransferPage = () => {
    const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
    const selectedPrograms = JSON.parse(localStorage.getItem("selectedPrograms")) || [];
    const [amount, setAmount] = useState("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [price, setPrice] = useState(null);
    const [countdown, setCountdown] = useState(10);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { activateBrowserWallet, account, chainId, library } = useEthers();

    const Interface = new utils.Interface(abi);

    // Use signer when create contract
    const contract = useMemo(() => {
        if (!library) return null;
        const signer = library.getSigner();
        return new Contract(contractAddress, Interface, signer);
    }, [library, chainId]);

    const { state: contractState, send: onGetDonationCounter, resetState } = useContractFunction(
        contract,
        "donate",
        {
            transactionName: "donate",
        }
    );

    const handleTransaction = async () => {
        try {
            if (!contract) {
                setError("Kontrak belum siap");
                return;
            }
            setLoading(true);
            setError(null);

            const goals = selectedPrograms.map((res) => res.id);
            const donationValue = estimatedCryptoValue || "0.002554";
            resetState();

            const estimatedGas = await contract.estimateGas.donate(goals, {
                value: ethers.utils.parseEther(donationValue),
            });
            await onGetDonationCounter(goals, {
                value: ethers.utils.parseEther(donationValue),
                gasLimit: estimatedGas.mul(2),
            });
        
            console.log("Transaksi terkirim (pending)");
        } catch (err) {
            console.error("Transaksi gagal:", err);
            setError(err.message || "Terjadi kesalahan saat transaksi");
            setLoading(false);
            }
        };

    useEffect(() => {
        console.log('contractState', contractState);
    
        if (contractState.status === "Exception" || contractState.status === "Fail") {
            console.error("TX error", contractState.errorMessage);
        }
    
        if (contractState.status === "Success" && contractState.receipt) {
            const receipt = contractState.receipt;
            const transactionHash = receipt.transactionHash;
            const gasUsed = receipt.gasUsed.toString();
            const blockNumber = receipt.blockNumber;
            const status = receipt.status;
        
            // Jika butuh nilai transaksi asli dari transaction, bisa juga cek contractState.transaction
            const tx = contractState.transaction;
            const from = tx?.from || null;
            const value = tx?.value ? ethers.utils.formatEther(tx.value) : null;
        
            const payloadRaw = JSON.stringify(contractState);
        
            const payload = {
                fullName,
                trxFullName: fullName,
                trxEmail: email || null,
                email: email || null,
                sender: from,
                recipient: contractAddress,
                transactionHash,
                gasUsed,
                blockNumber,
                status,
                coinValue: value ? Number(value) : 0,
                payloadRaw,
                // Tambahkan data lain sesuai kebutuhan kamu
        };
    
            console.log("Payload transaksi sukses:", payload);
    
        // Kirim payload ke backend
        // onSubmitTransaction(payload);
    
            resetState();
        }
    }, [contractState]);

    const fetchPrice = async () => {
        try {
            const response = await axios.get('https://indodax.com/api/ticker/POLIDR');
            const maticPrice = parseFloat(response.data.ticker.last);
            setPrice(maticPrice);
        } catch (err) {
            setError("Gagal mengambil data harga MATIC.");
            setPrice(null);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchPrice(); // get first amount

        const interval = setInterval(() => {
            setCountdown((prev) => {
            if (prev === 1) {
                fetchPrice(); // Fetch price when countdown = 1 (going to 0)
                return 10; // Reset countdown to 10
            }
            return prev - 1; // lower the countdown
            });
        }, 1000); // Update every second

        return () => clearInterval(interval); // Remove interval when unmounting
    }, []);

    const handleAmountChange = (e) => {
        let rawValue = e.target.value.replace(/[^0-9]/g, ""); // Hanya angka
        const formatCurrency = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        setAmount(formatCurrency);
    };

    const estimatedCryptoValue = useMemo(() => {
        if (!price || !amount) return "0.00";
        return (parseFloat(amount.replace(/,/g, "")) / price).toFixed(6);
    }, [amount, price]);

    const isAmountValid = useMemo(() => {
        const cleanAmount = parseFloat(amount.replace(/,/g, ""));
        return !isNaN(cleanAmount) && cleanAmount >= 1;
    }, [amount]);

    
    const formatCurrencyIDR = (num) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(num);

    return ( 
        <div className="main-wrapper">
            {!account ? (
                <button onClick={() => activateBrowserWallet()}>
                Hubungkan Wallet
                </button>
            ) : (
                <div>
                {/* {etherBalance && parseFloat(formatEther(etherBalance)).toFixed(3)} ETH

                <p>Account: {account}</p>
                <p>Chain ID: {chainId}</p>
                <p>Message : {message}</p> */}
                </div>
            )}
            <div className="info-wrapper">
                <img src="public/donation.jpg" alt="" />
                    <span>You support for: {selectedPrograms.map(program => program.title).join(", ")}</span>
            </div>
            <div className="form-order">
                <div className="form-group icon-group">
                    <label htmlFor="idrInput">Amount of infaq/sadaqah</label>
                    <input
                        placeholder="0,00"
                        type="text"
                        value={amount}
                        onChange={handleAmountChange}
                        inputMode="numeric"
                    />
                    <img className="icon" src="data:image/svg+xml,%3csvg%20width='73'%20height='74'%20viewBox='0%200%2073%2074'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3ccircle%20cx='36.5'%20cy='37'%20r='36.5'%20fill='%23FF0000'/%3e%3cpath%20d='M13.6962%2049.731V21.3673H24.8865C27.0285%2021.3673%2028.8567%2021.7505%2030.3709%2022.5168C31.8943%2023.2739%2033.053%2024.3496%2033.8471%2025.7437C34.6503%2027.1287%2035.052%2028.7583%2035.052%2030.6326C35.052%2032.5161%2034.6457%2034.1365%2033.8332%2035.4937C33.0207%2036.8418%2031.8435%2037.8758%2030.3016%2038.596C28.769%2039.3162%2026.9131%2039.6763%2024.7342%2039.6763H17.2416V34.8567H23.7647C24.9096%2034.8567%2025.8606%2034.6997%2026.6177%2034.3858C27.3748%2034.0719%2027.938%2033.601%2028.3073%2032.9731C28.6859%2032.3453%2028.8751%2031.5651%2028.8751%2030.6326C28.8751%2029.6908%2028.6859%2028.8968%2028.3073%2028.2505C27.938%2027.6042%2027.3702%2027.1148%2026.6038%2026.7824C25.8467%2026.4408%2024.8911%2026.27%2023.737%2026.27H19.693V49.731H13.6962ZM29.0136%2036.8233L36.063%2049.731H29.443L22.5459%2036.8233H29.0136ZM39.1791%2057.7082V28.4582H44.9959V32.0314H45.259C45.5175%2031.4589%2045.8915%2030.8773%2046.3808%2030.2864C46.8794%2029.6862%2047.5257%2029.1876%2048.3197%2028.7906C49.123%2028.3844%2050.1202%2028.1812%2051.3112%2028.1812C52.8623%2028.1812%2054.2935%2028.5875%2055.6045%2029.4C56.9156%2030.2033%2057.9636%2031.4174%2058.7484%2033.0424C59.5332%2034.6582%2059.9256%2036.6848%2059.9256%2039.1223C59.9256%2041.4952%2059.5424%2043.4987%2058.7761%2045.1329C58.019%2046.7579%2056.9849%2047.9905%2055.6738%2048.8307C54.3719%2049.6617%2052.9131%2050.0772%2051.2974%2050.0772C50.1525%2050.0772%2049.1784%2049.8879%2048.3751%2049.5094C47.5811%2049.1308%2046.9302%2048.6553%2046.4224%2048.0829C45.9146%2047.5012%2045.5268%2046.9149%2045.259%2046.324H45.079V57.7082H39.1791ZM44.9543%2039.0946C44.9543%2040.3595%2045.1298%2041.4628%2045.4806%2042.4046C45.8315%2043.3464%2046.3393%2044.0804%2047.004%2044.6067C47.6688%2045.1237%2048.4767%2045.3822%2049.4277%2045.3822C50.3879%2045.3822%2051.2004%2045.1191%2051.8652%2044.5928C52.53%2044.0573%2053.0332%2043.3187%2053.3748%2042.3769C53.7256%2041.4259%2053.9011%2040.3318%2053.9011%2039.0946C53.9011%2037.8666%2053.7302%2036.7864%2053.3886%2035.8538C53.047%2034.9213%2052.5438%2034.1919%2051.879%2033.6656C51.2143%2033.1393%2050.3972%2032.8762%2049.4277%2032.8762C48.4675%2032.8762%2047.655%2033.1301%2046.9902%2033.6379C46.3347%2034.1457%2045.8315%2034.8659%2045.4806%2035.7984C45.1298%2036.731%2044.9543%2037.8297%2044.9543%2039.0946Z'%20fill='white'/%3e%3c/svg%3e" alt="Rp" />
                </div>
                {amount !== "" && !isAmountValid && (
                    <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                        The minimum transaction amount Rp100,000
                    </p>
                )}
                <div className="form-group text-center-arrow">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAPCAYAAADtc08vAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACYSURBVHgB7Y7ZDYMwEER9NJASSAkuIR3QaUogBVh2OohLSAdmBhkJwdpG4peVRvIx72mVakwIITOtjlEX5xYUQYxxRIazELoPMovAez/mnN/IdEbCDrqRDCXGWvvBe0KGnqTAE7uF+Rrn3F9r/epJ9jAZsEm3Crj/+IfzU4KXv86K6yZJgg8CQbKdAywKKhIRrgp2ElWDOTNw7IQUgv8SBQAAAABJRU5ErkJggg==" height="18" width="18" alt="Down" />
                </div>
                <div className="form-group">
                    <label htmlFor="crypto">Estimated value of crypto assets</label>
                    <div id="crypto" className="crypto-wrapper">
                        <div className="dropdown-content-selected">
                            <img className="img-provider" src="data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='utf-8'?%3e%3c!--%20Generator:%20Adobe%20Illustrator%2024.0.0,%20SVG%20Export%20Plug-In%20.%20SVG%20Version:%206.00%20Build%200)%20--%3e%3csvg%20version='1.1'%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20x='0px'%20y='0px'%20viewBox='0%200%2038.4%2033.5'%20style='enable-background:new%200%200%2038.4%2033.5;'%20xml:space='preserve'%3e%3cstyle%20type='text/css'%3e%20.st0{fill:%238247E5;}%20%3c/style%3e%3cg%3e%3cpath%20class='st0'%20d='M29,10.2c-0.7-0.4-1.6-0.4-2.4,0L21,13.5l-3.8,2.1l-5.5,3.3c-0.7,0.4-1.6,0.4-2.4,0L5,16.3%20c-0.7-0.4-1.2-1.2-1.2-2.1v-5c0-0.8,0.4-1.6,1.2-2.1l4.3-2.5c0.7-0.4,1.6-0.4,2.4,0L16,7.2c0.7,0.4,1.2,1.2,1.2,2.1v3.3l3.8-2.2V7%20c0-0.8-0.4-1.6-1.2-2.1l-8-4.7c-0.7-0.4-1.6-0.4-2.4,0L1.2,5C0.4,5.4,0,6.2,0,7v9.4c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7%20c0.7,0.4,1.6,0.4,2.4,0l5.5-3.2l3.8-2.2l5.5-3.2c0.7-0.4,1.6-0.4,2.4,0l4.3,2.5c0.7,0.4,1.2,1.2,1.2,2.1v5c0,0.8-0.4,1.6-1.2,2.1%20L29,28.8c-0.7,0.4-1.6,0.4-2.4,0l-4.3-2.5c-0.7-0.4-1.2-1.2-1.2-2.1V21l-3.8,2.2v3.3c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7%20c0.7,0.4,1.6,0.4,2.4,0l8.1-4.7c0.7-0.4,1.2-1.2,1.2-2.1V17c0-0.8-0.4-1.6-1.2-2.1L29,10.2z'/%3e%3c/g%3e%3c/svg%3e" alt="matic"/>
                            
                            <span>MATIC</span>
                        </div>
                        <span className="crypto-value">
                            {estimatedCryptoValue}
                        </span>
                    </div>
                </div>
                <div className="spacer"></div>
                <div className="form-group icon-group icon-user">
                <input
                    type="text"
                    id="fullName"
                    className="form-control"
                    placeholder="Name of Infaq/Sedakah Giver..."
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)} 
                />                
                <img className="icon" src="data:image/svg+xml,%3csvg%20width='14'%20height='15'%20viewBox='0%200%2014%2015'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M7%200C5.63975%200.00258443%204.30961%200.400679%203.17159%201.14579C2.03357%201.89091%201.13679%202.95088%200.590485%204.19661C0.0441786%205.44234%20-0.128076%206.82005%200.0947024%208.16193C0.317481%209.50382%200.925677%2010.752%201.84521%2011.7543C2.50195%2012.4662%203.29903%2013.0344%204.18621%2013.4229C5.07339%2013.8115%206.03145%2014.0121%207%2014.0121C7.96855%2014.0121%208.92661%2013.8115%209.81379%2013.4229C10.701%2013.0344%2011.498%2012.4662%2012.1548%2011.7543C13.0743%2010.752%2013.6825%209.50382%2013.9053%208.16193C14.1281%206.82005%2013.9558%205.44234%2013.4095%204.19661C12.8632%202.95088%2011.9664%201.89091%2010.8284%201.14579C9.69039%200.400679%208.36025%200.00258443%207%200ZM7%2012.624C5.54717%2012.6218%204.15183%2012.0561%203.10761%2011.046C3.42464%2010.2742%203.96396%209.61407%204.65703%209.1495C5.3501%208.68493%206.16563%208.43689%207%208.43689C7.83437%208.43689%208.6499%208.68493%209.34297%209.1495C10.036%209.61407%2010.5754%2010.2742%2010.8924%2011.046C9.84817%2012.0561%208.45283%2012.6218%207%2012.624ZM5.59734%205.61066C5.59734%205.33324%205.6796%205.06205%205.83373%204.83138C5.98785%204.60071%206.20692%204.42093%206.46322%204.31476C6.71953%204.2086%207.00156%204.18082%207.27365%204.23494C7.54574%204.28907%207.79567%204.42266%207.99183%204.61882C8.188%204.81499%208.32159%205.06492%208.37571%205.33701C8.42984%205.6091%208.40206%205.89113%208.29589%206.14743C8.18973%206.40374%208.00995%206.6228%207.77928%206.77693C7.54861%206.93106%207.27742%207.01332%207%207.01332C6.62799%207.01332%206.27122%206.86554%206.00817%206.60249C5.74512%206.33944%205.59734%205.98267%205.59734%205.61066ZM11.8462%209.81865C11.2196%208.74685%2010.2552%207.91315%209.104%207.44815C9.46109%207.04324%209.69377%206.54389%209.7741%206.01002C9.85443%205.47615%209.77901%204.93044%209.55688%204.43838C9.33476%203.94631%208.97536%203.52879%208.52183%203.23592C8.06829%202.94305%207.53988%202.78727%207%202.78727C6.46012%202.78727%205.93171%202.94305%205.47817%203.23592C5.02464%203.52879%204.66524%203.94631%204.44312%204.43838C4.22099%204.93044%204.14557%205.47615%204.2259%206.01002C4.30623%206.54389%204.53891%207.04324%204.896%207.44815C3.74484%207.91315%202.78041%208.74685%202.1538%209.81865C1.65441%208.96801%201.39055%207.99972%201.38934%207.01332C1.38934%205.52528%201.98046%204.09819%203.03267%203.04599C4.08487%201.99379%205.51196%201.40266%207%201.40266C8.48804%201.40266%209.91513%201.99379%2010.9673%203.04599C12.0195%204.09819%2012.6107%205.52528%2012.6107%207.01332C12.6095%207.99972%2012.3456%208.96801%2011.8462%209.81865Z'%20fill='black'/%3e%3c/svg%3e" alt="Rp" />
                </div>
                <div className="form-group icon-group icon-user">
                <input
                    type="email"
                    id="email"
                    className="form-control"
                    placeholder="Email of Infaq/Sedakah Giver..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                /> 
                <img className="icon" src="data:image/svg+xml,%3csvg%20width='14'%20height='15'%20viewBox='0%200%2014%2015'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M7.06842%200C3.18079%200%200%203.18079%200%207.06842C0%2010.956%203.18079%2014.1368%207.06842%2014.1368C8.34073%2014.1368%209.54236%2013.7834%2010.6026%2013.2179C10.956%2013.0059%2011.0267%2012.5818%2010.8854%2012.2284C10.6733%2011.8749%2010.2492%2011.8043%209.89578%2011.9456C7.20978%2013.5007%203.74626%2012.5818%202.19121%209.89578C0.636157%207.20978%201.55505%203.74626%204.24105%202.19121C6.92705%200.636157%2010.3906%201.55505%2011.9456%204.24105C12.4404%205.08926%2012.7231%206.07884%2012.7231%207.06842V7.63389C12.7231%208.34073%2012.1577%208.9062%2011.4508%208.9062C10.744%208.9062%2010.1785%208.34073%2010.1785%207.63389V4.59447C10.1785%204.17037%209.89578%203.88763%209.47168%203.88763C9.11826%203.88763%208.83552%204.09968%208.76484%204.4531C7.35115%203.46352%205.30131%203.81694%204.31173%205.23063C3.32216%206.64431%203.67558%208.69415%205.08926%209.68373C6.43226%2010.6026%208.19936%2010.3906%209.25963%209.18894C10.1785%2010.3199%2011.8043%2010.5319%2012.9352%209.68373C13.5714%209.18894%2013.9955%208.41142%2013.9955%207.5632V7.06842C14.1368%203.18079%2010.956%200%207.06842%200ZM7.06842%208.83552C6.07884%208.83552%205.30131%208.05799%205.30131%207.06842C5.30131%206.07884%206.07884%205.30131%207.06842%205.30131C8.05799%205.30131%208.83552%206.07884%208.83552%207.06842C8.83552%208.05799%208.05799%208.83552%207.06842%208.83552Z'%20fill='black'/%3e%3c/svg%3e" alt="Rp" />
                </div>
                <div className="form-group">
                    <div className="information-wrapper">
                        <span>Transaction Information</span>
                    </div>
                    <div className="information-wrapper-open">
                        <div className="information-wrapper-open-item">
                            <span>Estimation Rate</span>
                            <span>1 MATIC = {price ? formatCurrencyIDR(price) : "Loading..."}</span>
                        </div>
                        {/* <div className="information-wrapper-open-item">
                            <span className="help">Perkiraan Biaya Jaringan
                                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADXSURBVHgBnVGxDcIwELQDDR0jwAZQUsWMwAahozNskExAskFGgAkwHR3ZAEZISWfuo7MwEQiJl05+v8+++7dWjDzPx1pr67032BqWG6DCWR14muQJlhNrFYkSM8AyX4J3DxduWM7AFnmrohBlLCWQAvMBChktrAK5KAprjFk45y7AA7lDeQOMEkpW8cvoQ/dUWlpNE/ps1HvUwKFXE44Zqs8hnj2w7h+IgqPKr+icyAWZjuU0YvmjevUgZ12vmpsrlXZfxroX/8in/31c9FpGQujJ0XIZlJ85SlhiZWYZPwAAAABJRU5ErkJggg==" width="12" height="12" alt="Help" />
                            </span>
                            <span>0,00</span>
                        </div> */}
                        <div className="information-wrapper-open-item mb-2">
                            <span className="help">Updated on</span>
                            <span>{countdown} s</span>
                        </div>
                        {/* <p>Status: {status}</p> */}

                    </div>
                </div>
                <div className="form-group">
                    <button 
                        onClick={handleTransaction}
                        className={`btn-primary w-full mt-6 py-2 text-white rounded-lg ${
                            !isAmountValid ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                        disabled={!isAmountValid}
                        >Transfer
                    </button>
                </div>
                <div className="form-group">
                    <button 
                        onClick={() => navigate('/')}
                        type="button" 
                        className="btn-bordered"
                        >Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransferPage;

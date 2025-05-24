import React, { useState, useMemo, useEffect } from "react";
import DataTable from "react-data-table-component";
import { fetchTransactions, fetchStatistics } from "../services/transactionService";

const FilterComponent = ({ filterText, onFilter, onClear }) => (
	<>
		<input
			className="input input-bordered w-full max-w-xs"
			type="text"
			placeholder="Filter By From"
			value={filterText}
			onChange={onFilter}
		/>
		<button onClick={onClear} className="btn ml-2">X</button>
	</>
);

const ReportPage = () => {
	const [filterText, setFilterText] = useState("");
	const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const [transactionDatas, setTransactionDatas] = useState([]);
    const [error, setError] = useState(null);
    const [loadingCount, setLoadingCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [statistics, setStatistics] = useState({
        totalZis: 0,
        totalZisDistributed: 0,
        totalPrograms: 0,
        totalDonors: 0,
    });

    // Todo: get from api
	const data = [
		{ id: 1, from: 'R**i Jo**ri', transaction: '5.6742 MATIC', zis: 'Rp 103.820,84', program: 'Mandiri, Cendekia, Sejahtera, Lestari, Harmoni', datetime: '6 Mei 2025 21:44' },
		{ id: 2, from: 'Ab**l Ak**n', transaction: '2.2762 MATIC', zis: 'Rp 41.647,63', program: 'Sejahtera, Lestari, Harmoni', datetime: '4 Mei 2025 20:12' },
		{ id: 3, from: 'Ca**K Gu**a', transaction: '1,6727 MATIC', zis: 'Rp 30.605,39', program: 'Hijau', datetime: '1 Mei 2025 20:19' },
	];

	const columns = [
		{ name: 'Dari', selector: row => row.donor },
		{ name: 'Transaksi Ethereum (MATIC)', selector: row => `${row.amount} MATIC` },
        { 
            name: 'Infaq/Sadaqah/Zakat Amount', 
            selector: row => new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
            }).format(row.amountIdr) 
        },
        { name: 'Tujuan Program', selector: row => row.listCampaigns.join(', ') },
        { 
            name: 'Tanggal/Waktu', 
            selector: row => {
            const date = new Date(row.timestamp);
            return date.toLocaleString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
                timeZone: 'Asia/Jakarta'
            });
            } 
        },	
        ];

    const startLoading = () => {
        setLoadingCount(prev => {
            const newCount = prev + 1;
            if (newCount > 0) setLoading(true);
            return newCount;
        });
    };
    
    const stopLoading = () => {
        setLoadingCount(prev => {
            const newCount = prev - 1;
            if (newCount <= 0) setLoading(false);
            return newCount;
        });
    };
    
    const getTransactions = async () => {
        startLoading();
        try {
            const response = await fetchTransactions();
            setTransactionDatas(response.data ?? []);
        } catch (err) {
            setError("Gagal mengambil data transactions.");
            setTransactionDatas([]);
        } finally {
            stopLoading();
        }
    };
    
    const getStatics = async () => {
        startLoading();
        try {
            const response = await fetchStatistics();
            const data = response.data ?? {};
            setStatistics({
                totalZis: data.total_zis ?? 0,
                totalZisDistributed: data.total_zis ?? 0, // diasumsikan sama
                totalPrograms: data.total_programs ?? 0,
                totalDonors: data.total_donors ?? 0,
            });
        } catch (err) {
            setError("Gagal mengambil data statistics.");
            setStatistics({
                totalZis: 0,
                totalZisDistributed: 0,
                totalPrograms: 0,
                totalDonors: 0,
            });
        } finally {
            stopLoading();
        }
    };
    
    useEffect(() => {
        getTransactions();
        getStatics();
    }, []);

	const filteredItems = data.filter(
		item => item.from && item.from.toLowerCase().includes(filterText.toLowerCase())
	);

	const subHeaderComponentMemo = useMemo(() => {
		const handleClear = () => {
			if (filterText) {
				setResetPaginationToggle(!resetPaginationToggle);
				setFilterText('');
			}
		};

		return (
			<FilterComponent
				onFilter={e => setFilterText(e.target.value)}
				onClear={handleClear}
				filterText={filterText}
			/>
		);
	}, [filterText, resetPaginationToggle]);

	return (
		<div className="p-4">
            <div className="grid grid-cols gap-4 mb-4">
                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-figure text-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        </div>
                        <div className="stat-title">Total Donors</div>
                        <div className="stat-value">{statistics.totalDonors}</div>
                    </div>

                    <div className="stat">
                        <div className="stat-figure text-secondary">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="24" height="24" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="#000000" 
                            stroke-width="2" 
                            stroke-linecap="round" 
                            stroke-linejoin="round">
                                <line x1="12" y1="1" x2="12" y2="23"></line>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                        </div>
                        <div className="stat-title">Total Zis</div>
                        <div className="stat-value">
                                Rp. {statistics.totalZis.toLocaleString('id-ID')}
                        </div>
                    </div>
                    <div className="stat">
                        <div className="stat-figure text-secondary">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="24" height="24" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="#000000" 
                            stroke-width="2" 
                            stroke-linecap="round" 
                            stroke-linejoin="round">
                                <line x1="12" y1="1" x2="12" y2="23"></line>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                        </div>
                        <div className="stat-title">Total Zis Distributed</div>
                        <div className="stat-value">
                                Rp. {statistics.totalZis.toLocaleString('id-ID')}
                        </div>
                    </div>
                    <div className="stat">
                        <div className="stat-figure text-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M15 21V9"/></svg>
                        </div>
                        <div className="stat-title">Total Program</div>
                        <div className="stat-value">{statistics.totalPrograms}</div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols">
                <DataTable
                    title="Transaksi"
                    columns={columns}
                    data={transactionDatas}
                    pagination
                    subHeader
                    subHeaderComponent={subHeaderComponentMemo}
                    paginationResetDefaultPage={resetPaginationToggle}
                    persistTableHead
                    keyField="id"
                />
            </div>
		</div>
	);
};

export default ReportPage;

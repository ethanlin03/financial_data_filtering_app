import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import Modal from "./modal.jsx";

const App = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currFilter, setCurrFilter] = useState("null");
  const [currInputs, setCurrInputs] = useState({});
  const [filters, setFilters] = useState({
    dateRange: { start: 2020, end: 2025 },
    revenueRange: { min: 0, max: Infinity },
    netIncomeRange: { min: 0, max: Infinity },
  });

  const [columnHeaders, setColumnHeaders] = useState([
    { key: "date", label: "Date", sortable: true },
    { key: "revenue", label: "Revenue", sortable: true },
    { key: "netIncome", label: "Net Income", sortable: true },
    { key: "grossProfit", label: "Gross Profit", sortable: false },
    { key: "eps", label: "EPS", sortable: false },
    { key: "operatingIncome", label: "Operating Income", sortable: false },
  ]);

  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "asc" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFilterSubmit = (formData) => {
    setCurrInputs(formData);
    console.log("Received form data in App:", formData);
  };

  useEffect(() => {
    const fetchData = async () => {
      const apiKey = "hmoI680tLxFOLiVkrvFlDlzGgLZHBcKN";
      const url = `https://financialmodelingprep.com/api/v3/income-statement/AAPL?period=annual&apikey=${apiKey}`;
      try {
        const response = await axios.get(url);
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (currFilter !== "null") {
      if (currInputs.startingYear && currInputs.endingYear) {
        setFilters((prevFilters) => ({
          ...prevFilters,
          dateRange: {
            start: currInputs.startingYear,
            end: currInputs.endingYear,
          },
          revenueRange: { min: 0, max: Infinity },
          netIncomeRange: { min: 0, max: Infinity },
        }));
      } else if (currInputs.netIncomeMin && currInputs.netIncomeMax) {
        setFilters((prevFilters) => ({
          ...prevFilters,
          netIncomeRange: {
            min: currInputs.netIncomeMin,
            max: currInputs.netIncomeMax,
          },
          revenueRange: { min: 0, max: Infinity },
          dateRange: { start: 2020, end: 2025 },
        }));
      } else if (currInputs.revenueMin && currInputs.revenueMax) {
        setFilters((prevFilters) => ({
          ...prevFilters,
          revenueRange: {
            min: currInputs.revenueMin,
            max: currInputs.revenueMax,
          },
          netIncomeRange: { min: 0, max: Infinity },
          dateRange: { start: 2020, end: 2025 },
        }));
      }
    }
  }, [currFilter, currInputs]);
  
  useEffect(() => {
    setFilteredData(
      data.filter((row) => {
        const year = parseInt(row.date.split("-")[0]);
        const withinDateRange =
          year >= filters.dateRange.start && year <= filters.dateRange.end;
        const withinRevenueRange =
          row.revenue >= filters.revenueRange.min &&
          row.revenue <= filters.revenueRange.max;
        const withinNetIncomeRange =
          row.netIncome >= filters.netIncomeRange.min &&
          row.netIncome <= filters.netIncomeRange.max;
  
        return withinDateRange && withinRevenueRange && withinNetIncomeRange;
      })
    );
  }, [filters, data]);  

  const sortedData = [...filteredData].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const filterDate = (startDate, endDate) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      dateRange: { start: startDate, end: endDate },
    }));
  }

  const filterRevenue = (minRevenue, maxRevenue) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      revenueRange: { min: minRevenue, max: maxRevenue },
    }));
  }

  const filterNetIncome = (minIncome, maxIncome) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      netIncomeRange: { min: minIncome, max: maxIncome },
    }));
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-xl font-bold mt-10 mb-20">Apple Financial Data</h1>
      <div className="flex flex-row">

        <table className="table-auto border-collapse border border-gray-300 m-10">
          <thead>
          <tr className="bg-gray-200">
            {columnHeaders.map((header) => (
              <th
                key={header.key}
                className="p-4 text-left border border-gray-300"
                onClick={() => header.sortable && handleSort(header.key)}
              >
                <button
                  className={`arrow-button ${header.sortable ? "" : "cursor-default"}`}
                  disabled={!header.sortable}
                >
                  {header.label}
                  {(header.key === "date" || header.key === "revenue" || header.key === "netIncome") && header.sortable && (
                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 20V10m0 10-3-3m3 3 3-3m5-13v10m0-10 3 3m-3-3-3 3"/>
                    </svg>                
                  )}
                </button>
              </th>
            ))}
          </tr>
          </thead>
          <tbody>
            {sortedData.map((row) => (
              <tr key={row.date} className="border border-gray-300">
              <td className="p-4 text-left">{row.date}</td>
              <td className="p-4 text-left">{row.revenue.toLocaleString()}</td>
              <td className="p-4 text-left">{row.netIncome.toLocaleString()}</td>
              <td className="p-4 text-left">{row.grossProfit.toLocaleString()}</td>
              <td className="p-4 text-left">{row.eps}</td>
              <td className="p-4 text-left">{row.operatingIncome.toLocaleString()}</td>
            </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={openModal}
          className="mb-72"
        >
        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M1 5h1.424a3.228 3.228 0 0 0 6.152 0H19a1 1 0 1 0 0-2H8.576a3.228 3.228 0 0 0-6.152 0H1a1 1 0 1 0 0 2Zm18 4h-1.424a3.228 3.228 0 0 0-6.152 0H1a1 1 0 1 0 0 2h10.424a3.228 3.228 0 0 0 6.152 0H19a1 1 0 0 0 0-2Zm0 6H8.576a3.228 3.228 0 0 0-6.152 0H1a1 1 0 0 0 0 2h1.424a3.228 3.228 0 0 0 6.152 0H19a1 1 0 0 0 0-2Z"/>
        </svg>
      </button>

      <Modal isOpen={isModalOpen} onClose={closeModal} updateFilter={setCurrFilter} onApply={handleFilterSubmit}/>
      
      </div>
    </div>
  );
};

export default App;

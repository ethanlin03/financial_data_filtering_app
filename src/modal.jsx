import React, { useState, useEffect } from "react";

const Modal = ({ isOpen, onClose, updateFilter, onApply, resetFilters }) => {
  const [currentFilter, setCurrentFilter] = useState("date");
  const [formData, setFormData] = useState({});
  const [formattedValues, setFormattedValues] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData({});
      setFormattedValues({});
      setCurrentFilter("date");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClickOutside = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatNumber = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("en-US").format(value);
  };

  const handleInputChange = (field, value) => {
    const rawValue = value.replace(/,/g, "");
    if (!isNaN(rawValue)) {
      setFormData((prev) => ({
        ...prev,
        [field]: rawValue,
      }));
      setFormattedValues((prev) => ({
        ...prev,
        [field]: formatNumber(rawValue),
      }));
    }
  };

  const handleReset = (e) => {
    e.preventDefault();
    resetFilters();
    onClose();
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    updateFilter(currentFilter);
    onApply(formData);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50"
      onClick={handleClickOutside}
    >
      <div className="bg-white p-6 rounded-lg w-[80]">
        <div className="flex flex-row justify-between">
          <h2 className="text-2xl font-semibold mb-4">Filters</h2>
          <button onClick={onClose} className="mb-8">
            <svg className="w-6 h-6 text-gray-900 hover:text-gray-400 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
            </svg>
          </button>
        </div>
        <div className="flex flex-row justify-between space-x-2">
          <button
            className={`px-4 py-2 rounded border-2 ${
              currentFilter === "date"
                ? "bg-gray-200 text-gray-500"
                : "bg-transparent text-gray-500 hover:bg-gray-200"
            }`}
            onClick={() => setCurrentFilter("date")}
          >
            Filter by Date
          </button>
          <button
            className={`px-4 py-2 rounded border-2 ${
              currentFilter === "revenue"
                ? "bg-gray-200 text-gray-500"
                : "bg-transparent text-gray-500 hover:bg-gray-200"
            }`}
            onClick={() => setCurrentFilter("revenue")}
          >
            Filter by Revenue
          </button>
          <button
            className={`px-4 py-2 rounded border-2 ${
              currentFilter === "netIncome"
                ? "bg-gray-200 text-gray-500"
                : "bg-transparent text-gray-500 hover:bg-gray-200"
            }`}
            onClick={() => setCurrentFilter("netIncome")}
          >
            Filter by Net Income
          </button>
        </div>

        <form className="mt-4 p-4 border rounded" onSubmit={handleSubmit}>
          {currentFilter === "date" && (
            <div>
              <label htmlFor="startingYear" className="block text-gray-700 mb-2">
                Select Starting Year:
              </label>
              <input
                type="number" id="startingYear" placeholder="Enter year (e.g., 2023)" className="border px-4 py-2 rounded w-full mb-4"
                onChange={(e) =>
                  handleInputChange("startingYear", e.target.value)
                }
              />
              <label htmlFor="endingYear" className="block text-gray-700 mb-2">
                Select Ending Year:
              </label>
              <input
                type="number" id="endingYear" placeholder="Enter year (e.g., 2023)" className="border px-4 py-2 rounded w-full"
                onChange={(e) => handleInputChange("endingYear", e.target.value)}
              />
            </div>
          )}

          {currentFilter === "netIncome" && (
            <div>
              <label htmlFor="netIncome" className="block text-gray-700 mb-2">
                Enter Net Income Range (USD):
              </label>
              <input
                type="text" id="netIncomeMin" placeholder="Minimum Net Income" className="border px-4 py-2 rounded w-full mb-2" value={formattedValues.netIncomeMin || ""}
                onChange={(e) => handleInputChange("netIncomeMin", e.target.value)}
              />
              <input
                type="text" id="netIncomeMax" placeholder="Maximum Net Income" className="border px-4 py-2 rounded w-full" value={formattedValues.netIncomeMax || ""}
                onChange={(e) => handleInputChange("netIncomeMax", e.target.value)}
              />
            </div>
          )}

          {currentFilter === "revenue" && (
            <div>
              <label htmlFor="revenue" className="block text-gray-700 mb-2">
                Enter Revenue Range (USD):
              </label>
              <input
                type="text" id="revenueMin" placeholder="Minimum Revenue" className="border px-4 py-2 rounded w-full mb-2" value={formattedValues.revenueMin || ""}
                onChange={(e) => handleInputChange("revenueMin", e.target.value)}
              />
              <input
                type="text" id="revenueMax" placeholder="Maximum Revenue" className="border px-4 py-2 rounded w-full" value={formattedValues.revenueMax || ""}
                onChange={(e) => handleInputChange("revenueMax", e.target.value)}
              />
            </div>
          )}

          <div className="flex justify-between mt-4">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Apply Filter
            </button>
            <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600" onClick={handleReset}>
              Reset
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default Modal;

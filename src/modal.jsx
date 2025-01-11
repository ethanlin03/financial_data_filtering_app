import React from "react";
import { useState, useEffect } from "react";

const Modal = ({ isOpen, onClose, updateFilter, onApply }) => {
  const [currentFilter, setCurrentFilter] = useState("date");
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData({});
      setCurrentFilter("date");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClickOutside = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateFilter(currentFilter);
    onApply(formData);
    onClose();    
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50"
      onClick={handleClickOutside}
    >
      <div className="bg-white p-6 rounded-lg w-[80]">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl text-gray-700 hover:text-gray-900"
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-4">Filter</h2>
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
              currentFilter === "netIncome"
                ? "bg-gray-200 text-gray-500"
                : "bg-transparent text-gray-500 hover:bg-gray-200"
            }`}
            onClick={() => setCurrentFilter("netIncome")}
          >
            Filter by Net Income
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
        </div>
        <form className="mt-4 p-4 border rounded" onSubmit={handleSubmit}>
          {currentFilter === "date" && (
            <div>
              <label htmlFor="startingYear" className="block text-gray-700 mb-2">
                Select Starting Year:
              </label>
              <input
                type="number"
                id="startingYear"
                placeholder="Enter year (e.g., 2023)"
                className="border px-4 py-2 rounded w-full mb-4"
                onChange={(e) =>
                  handleInputChange("startingYear", e.target.value)
                }
              />
              <label htmlFor="endingYear" className="block text-gray-700 mb-2">
                Select Ending Year:
              </label>
              <input
                type="number"
                id="endingYear"
                placeholder="Enter year (e.g., 2023)"
                className="border px-4 py-2 rounded w-full"
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
                type="number"
                id="netIncomeMin"
                placeholder="Minimum Net Income"
                className="border px-4 py-2 rounded w-full mb-2"
                onChange={(e) =>
                  handleInputChange("netIncomeMin", e.target.value)
                }
              />
              <input
                type="number"
                id="netIncomeMax"
                placeholder="Maximum Net Income"
                className="border px-4 py-2 rounded w-full"
                onChange={(e) =>
                  handleInputChange("netIncomeMax", e.target.value)
                }
              />
            </div>
          )}

          {currentFilter === "revenue" && (
            <div>
              <label htmlFor="revenue" className="block text-gray-700 mb-2">
                Enter Revenue Range (USD):
              </label>
              <input
                type="number"
                id="revenueMin"
                placeholder="Minimum Revenue"
                className="border px-4 py-2 rounded w-full mb-2"
                onChange={(e) =>
                  handleInputChange("revenueMin", e.target.value)
                }
              />
              <input
                type="number"
                id="revenueMax"
                placeholder="Maximum Revenue"
                className="border px-4 py-2 rounded w-full"
                onChange={(e) =>
                  handleInputChange("revenueMax", e.target.value)
                }
              />
            </div>
          )}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
          >
            Apply Filter
          </button>
        </form>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;

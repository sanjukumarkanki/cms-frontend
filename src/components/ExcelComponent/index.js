import React from "react";
import * as XLSX from "xlsx";
import { FaDownload } from "react-icons/fa6";

const ExcelComponent = ({ data, filename }) => {
  const handleDownload = () => {
    console.log(data, "dfdfdfdfd");
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data());

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename || "data.xlsx";
    link.click();
  };

  return (
    <button className="add-button" onClick={handleDownload}>
      <FaDownload />
    </button>
  );
};

export default ExcelComponent;

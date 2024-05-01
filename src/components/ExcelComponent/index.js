import React from 'react';
import * as XLSX from 'xlsx';
import { IoMdDownload } from "react-icons/io";

const ExcelComponent = ({ data, filename }) => {
  const handleDownload = () => {
    const workbook = XLSX.utils.book_new();

    const worksheet = XLSX.utils.json_to_sheet(data);

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');


    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });


    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename || 'data.xlsx';
    link.click();
  };

  return (
    <button className='add-button' onClick={handleDownload}><IoMdDownload /></button>
  );
};

export default ExcelComponent;

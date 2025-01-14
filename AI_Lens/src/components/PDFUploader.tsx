import React, { useRef } from "react";

function PDFUploader({ onFileSelect }) {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      onFileSelect(file);
    } else {
      alert("Choice PDF-file.");
    }
  };

  return (
    <div>
      <button onClick={handleButtonClick}>Загрузить</button>
      <input
        type="file"
        accept="application/pdf"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
}

export default PDFUploader;

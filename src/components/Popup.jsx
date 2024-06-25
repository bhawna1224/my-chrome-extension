import React from 'react';

const Popup = () => {
  const exportData = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      console.log("Sending message to content script...");
      chrome.tabs.sendMessage(tabs[0].id, { action: "export_data" }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error sending message:", chrome.runtime.lastError);
        } else if (response && response.data) {
          console.log("Received response from content script:", response.data);
          const blob = new Blob([JSON.stringify(response.data)], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = "data.json";
          a.click();
        }
      });
    });
  };

  return (
    <div>
      <button onClick={exportData}>Export Data</button>
    </div>
  );
};

export default Popup;

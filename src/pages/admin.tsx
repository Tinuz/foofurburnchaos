import React from "react";

const AdminPage = () => {
  const handleCreateMaster = async () => {
    const res = await fetch("/api/mint", { method: "POST" });
    const data = await res.json();
    alert(`NFT created! ${data.nftUrl}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <button
        onClick={handleCreateMaster}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 font-bold text-lg"
      >
        Create Master NFT
      </button>
    </div>
  );
};

export default AdminPage;
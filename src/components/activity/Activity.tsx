import React, { useEffect, useState } from "react";
import { Table } from "antd";
import type { TableColumnsType } from "antd";
import "./Activity.css";

interface Transaction {
  key: React.Key;
  serial: number;
  from: string;
  to: string;
  Amount: string;
}

const columns: TableColumnsType<Transaction> = [
  {
    title: "Sr",
    dataIndex: "serial",
    key: "serial",
    fixed: "left",
    width: 50,
  },
  {
    title: "From",
    dataIndex: "from",
    key: "from",
    width: 200,
    render: (text) => (
      <span title={text}>{`${text.slice(0, 6)}...${text.slice(-6)}`}</span>
    ),
  },
  {
    title: "To",
    dataIndex: "to",
    key: "to",
    width: 200,
    render: (text) => (
      <span title={text}>{`${text.slice(0, 6)}...${text.slice(-6)}`}</span>
    ),
  },
  {
    title: "Amount",
    dataIndex: "Amount",
    key: "Amount",
    width: 100,
  },
];

const Activity: React.FC = () => {
  const [data, setData] = useState<Transaction[]>([]);

  useEffect(() => {
    const transactionsData = localStorage.getItem("Transactions");
    if (transactionsData) {
      const transactions: Transaction[] = JSON.parse(transactionsData);
      const transactionsWithSerial = transactions.map((transaction, index) => ({
        ...transaction,
        serial: index + 1,
      }));
      setData(transactionsWithSerial);
    }
  }, []);

  return (
    <div className="activity">
      <div className="header1">
        <h1 style={{ marginTop: "10px", marginLeft: "9rem" }}>Activities</h1>
      </div>
      <div className="table_history">
        <Table
          className="table"
          columns={columns}
          dataSource={data}
          scroll={{ x: "max-content", y: 300 }}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default Activity;

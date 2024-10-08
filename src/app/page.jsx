'use client';
import React, { useState } from "react";
import { PriceChart } from "../components/PriceChart";
import { Button, Form, Spinner } from "react-bootstrap";
import "@styles/Home.css";

export default function Home() {
  const [stockData, setStockData] = useState();
  const [stockA, setStockA] = useState();
  const [stockB, setStockB] = useState();
  const [stockDataB, setStockDataB] = useState();
  const [correlation, setCorrelation] = useState();
  const [isLoading, setIsLoading] = useState(false);

  // 處理表單提交
  const handleSubmit = (event) => {
    event.preventDefault();

    const stockA = event.target.stockA.value;
    const stockB = event.target.stockB.value;
    setStockA(stockA);
    setStockB(stockB);
    fetchStockData(stockA, stockB);
  };
  // 取得股票資料
  const fetchStockData = (stockA, stockB) => {
    setIsLoading(true);
    fetch(`/api/candlesticks?stock1=${stockA}&stock2=${stockB}`,{
      headers:{
        accept: 'application/json',
      }
    })
      .then((response) => response.json())
      .then((data) => {
        setStockData(data.stock1);
        setStockDataB(data.stock2);
        setCorrelation(data.correlation);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };

  return (
    <div className="home">
      <Form className="stockForm" onSubmit={handleSubmit}>
        <Form.Group className="mb-3 stockFormGroup" controlId="formStockA">
          <Form.Label>股票代碼A</Form.Label>
          <Form.Control placeholder="請輸入股票代碼A" name="stockA" required />
        </Form.Group>
        <Form.Group className="mb-3 stockFormGroup" controlId="formStockB">
          <Form.Label>股票代碼B</Form.Label>
          <Form.Control placeholder="請輸入股票代碼B" name="stockB" required />
        </Form.Group>
        <Button
          className="stockFormButton"
          variant="outline-secondary"
          type="submit"
        >
          提交
        </Button>
      </Form>
      
      {isLoading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : stockData ? (
        <>
        
        <div className="relateBox">
            <div className="relateItem">兩股票相關性：{correlation}</div>
          </div>
          <div className="stockBox">
            <div className="stockTitle">股票{stockA}</div>
            <div className="stockChart">
              <PriceChart stockData={stockData} />
            </div>
          </div>

          <div className="stockBox">
            <div className="stockTitle">股票{stockB}</div>
            <div className="stockChart">
              <PriceChart stockData={stockDataB} />
            </div>
          </div>

        </>
      ) : (
        <p>請輸入股票代碼</p>
      )}
    </div>
  );
};


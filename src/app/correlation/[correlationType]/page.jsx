import React from 'react';
import { Table } from 'react-bootstrap';
import PaginationComponent from '@components/PaginationComponent';
import '@styles/Correlation.css';
import { fetchCorrelationData } from '@/lib/fetchCorrelationData';

export default async function Correlation({ params, searchParams  }) {
  const { page } = searchParams ;
  const currentPage = parseInt(page) || 1;
  const { correlationType } = params;
  const data = await fetchCorrelationData(correlationType, currentPage);

  let correlationStr = '';
  if (correlationType === 'positive') {
    correlationStr = '正';
  } else if (correlationType === 'negative') {
    correlationStr = '負';
  }

  return (
    <div className="item">
      <h1 className="my-4">{correlationStr}相關排名</h1>
      <Table className="table table-hover table-bordered">
        <thead className="table-dark">
          <tr>
            <th>股票代號1</th>
            <th>股票代號2</th>
            <th>資料比數</th>
            <th>相關性</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((item, index) => (
              <tr key={item.id}>
                <td>{item.stock1}</td>
                <td>{item.stock2}</td>
                <td>{item.quantity}</td>
                <td>{item.correlation}</td>
              </tr>
            ))}
          <tr></tr>
        </tbody>
      </Table>
      <div>
        <PaginationComponent correlationType={correlationType} currentPage={currentPage} />
        <br />
      </div>
    </div>
  );
}

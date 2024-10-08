'use client';
import React, { useState } from 'react';
import Pagination from 'react-bootstrap/Pagination';
import {useRouter} from 'next/navigation';

const PaginationComponent = ({correlationType, currentPage}) => {
  const router = useRouter()

  const handlePageChange = (pageNumber) => {
    router.push(`/correlation/${correlationType}?page=${pageNumber}`);
  };

  let items = [];
  for (let number = 1; number <= 5; number++) {
    items.push(
      <Pagination.Item key={'page' + number} active={number === currentPage} onClick={() => handlePageChange(number)}>
        {number}
      </Pagination.Item>
    );
  }

  return <Pagination>{items}</Pagination>;
};

export default PaginationComponent;

import type { Meta } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { Pagination } from './Pagination';

const meta = {
  title: 'UI/Utility/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Pagination>;

export default meta;

type DemoProps = {
  initialPage?: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
};

// Wrapper component to manage state for interactive demo
function PaginationDemo({ initialPage = 0, ...props }: DemoProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  return (
    <Pagination
      currentPage={currentPage}
      onPageChangeAction={setCurrentPage}
      {...props}
    />
  );
}

export const Default = {
  render: () => (
    <PaginationDemo
      initialPage={0}
      totalPages={12}
      totalItems={240}
      itemsPerPage={10}
    />
  ),
};

export const FirstPage = {
  render: () => (
    <PaginationDemo
      initialPage={0}
      totalPages={12}
      totalItems={240}
      itemsPerPage={10}
    />
  ),
};

export const MiddlePage = {
  render: () => (
    <PaginationDemo
      initialPage={5}
      totalPages={12}
      totalItems={240}
      itemsPerPage={10}
    />
  ),
};

export const LastPage = {
  render: () => (
    <PaginationDemo
      initialPage={11}
      totalPages={12}
      totalItems={240}
      itemsPerPage={10}
    />
  ),
};

export const SinglePage = {
  render: () => (
    <PaginationDemo
      initialPage={0}
      totalPages={1}
      totalItems={8}
      itemsPerPage={10}
    />
  ),
};

export const TwoPages = {
  render: () => (
    <PaginationDemo
      initialPage={0}
      totalPages={2}
      totalItems={15}
      itemsPerPage={10}
    />
  ),
};

export const ManyPages = {
  render: () => (
    <PaginationDemo
      initialPage={0}
      totalPages={50}
      totalItems={1000}
      itemsPerPage={10}
    />
  ),
};

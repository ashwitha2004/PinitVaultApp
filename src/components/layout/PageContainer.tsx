import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, className = '' }) => {
  return (
    <div className={`page ${className}`}>
      <div className="page-content">
        {children}
      </div>
    </div>
  );
};

export default PageContainer;

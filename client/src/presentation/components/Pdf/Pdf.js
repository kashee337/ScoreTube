import { Button, Space } from 'antd/es';
import { useState } from "react";
import { Document, Page } from "react-pdf";
import styled from 'styled-components';
import "./Pdf.css";

const PDFDocumentWrapper = styled.div`
  canvas {
    width: auto !important;
    height: 80vh !important;
  }
`;

const SinglePage = (props) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset) {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  const { pdf_path } = props;

  return (
    <>
      <div className="Pdf">
        <div>
          <PDFDocumentWrapper>
            Page {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
            <Document
              file={pdf_path}
              options={{ workerSrc: "/pdf.worker.js" }}
              onLoadSuccess={onDocumentLoadSuccess}
            >
              <Page pageNumber={pageNumber} />
            </Document>

          </PDFDocumentWrapper>
        </div>
        <div>
          <Space size={[5, 5]}>
            <Button disabled={pageNumber <= 1} onClick={previousPage}>
              Previous
        </Button>
            <Button
              disabled={pageNumber >= numPages}
              onClick={nextPage}
            >
              Next
        </Button>
          </Space>
        </div>
      </div>
    </>
  );
}

export default SinglePage;
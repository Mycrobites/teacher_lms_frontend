import { IoChevronBackSharp, IoChevronForwardSharp } from "react-icons/io5";

const Pagination = ({ totalPages, handlePages, currentPage }) => {
  const pages = [];
  for (let i = 0; i < totalPages; i++) {
    pages.push(i + 1);
  }
  
  return (
    <div className="pagination">
      <button
        onClick={() => handlePages(currentPage - 1)}
        disabled={currentPage === 0}
        className="next-btn"
      >
        <IoChevronBackSharp /> Prev
      </button>
      <button
        onClick={() => handlePages(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className="prev-btn"
      >
        Next <IoChevronForwardSharp />
      </button>
    </div>
  );
};

export default Pagination;
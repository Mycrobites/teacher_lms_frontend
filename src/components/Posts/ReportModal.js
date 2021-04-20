const ReportModal = ({ reportModalText, setShowReportModal }) => {
  return (
    <div className="report-modal">
      <div className="report-modal-div">
        <h2>{reportModalText}!</h2>
        <button onClick={() => setShowReportModal(false)}>Okay</button>
      </div>
    </div>
  );
};

export default ReportModal;

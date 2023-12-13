const ClinicList = ({ clinic, onClinicSelect }) => {
  const handleClinicSelect = () => {
    onClinicSelect(clinic.clinicemail);
  };

  return (
    <>
      <div
        className="card m-2"
        style={{ cursor: "pointer" }}
        onClick={handleClinicSelect}
      >
        <div className="card-header">
          {clinic.clinicname}
        </div>
        <div className="card-body">
          <p>
            <b>District:</b> {clinic.district}
          </p>
        </div>
        <div className="card-body">
          <p>
            <b>Email:</b> {clinic.clinicemail}
          </p>
        </div>
      </div>
    </>
  );
};


export default ClinicList;
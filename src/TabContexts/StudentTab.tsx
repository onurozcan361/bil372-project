import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";
import dummyData from "../dummy.json";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

export const StudentTab = () => {
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  
  const handleUpdateClick = (student: any) => {
    setSelectedStudent(student);
    setOpenUpdateDialog(true);
  };
  
  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSelectedStudent({ ...selectedStudent, [name]: value });
  };
  
  const handleSaveChanges = () => {
    // Buradan backende kaydedicez yapılan değişiklikleri
    console.log("Değişiklikler kaydedildi:", selectedStudent);
    setOpenUpdateDialog(false);
  };
  
  const columns: GridColDef[] = [
    { field: "isim", headerName: "İsim", width: 200 },
    { field: "soyisim", headerName: "Soyisim", width: 200 },
    { field: "id", headerName: "SSN", width: 200 },
    { field: "telefon", headerName: "Telefon", width: 200 },
    { field: "email", headerName: "E-Mail", width: 200 },
    {
      field: "actions",
      headerName: "İşlemler",
      width: 120,
      renderCell: (params) => {
        const handleEditClick = () => {
          handleUpdateClick(params.row);
        };
  
        return <Button onClick={handleEditClick}>Düzenle</Button>;
      },
    },
  ];
  
  return (
    <>
      <DataGrid rows={dummyData} columns={columns} />
  
      <Dialog open={openUpdateDialog} onClose={handleCloseUpdateDialog}>
        <DialogTitle>Öğrenci Düzenleme</DialogTitle>
        <DialogContent>
          {selectedStudent && (
            <>
              <TextField
                label="İsim"
                name="isim"
                value={selectedStudent.isim}
                onChange={handleInputChange}
                fullWidth
				inputProps={{
					readOnly: true,
				}}
				sx={{ marginTop: '16px' }} 
              />
              <TextField
                label="Soyisim"
                name="soyisim"
                value={selectedStudent.soyisim}
                onChange={handleInputChange}
                fullWidth
				inputProps={{
					readOnly: true,
				}}
              />
              <TextField
                label="SSN"
                name="id"
                value={selectedStudent.id}
                onChange={handleInputChange}
                fullWidth
				inputProps={{
					readOnly: true,
				}}
              />
              <TextField
                label="Telefon"
                name="telefon"
                value={selectedStudent.telefon}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                label="E-Mail"
                name="email"
                value={selectedStudent.email}
                onChange={handleInputChange}
                fullWidth
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateDialog}>İptal</Button>
          <Button onClick={handleSaveChanges}>Kaydet</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

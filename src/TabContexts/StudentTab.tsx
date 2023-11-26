import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import dummyData from '../dummy.json';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { DetailedStudent, Student } from '../Types';

const fieldLabels: Record<keyof DetailedStudent, string> = {
  id: 'ID',
  name: 'Ad',
  surname: 'Soyad',
  phoneNumber: 'Telefon Numarasi',
  email: 'Email',
  address: 'Adres',
  birthDate: 'Dogum Tarihi',
  isActive: 'Aktiflik Durumu',
  registrationDate: 'Kayit Tarihi',
  custodianId: 'Veli Id',
};

const initStudent: DetailedStudent = {
  name: '',
  surname: '',
  id: '',
  phoneNumber: '',
  email: '',
  address: '',
  birthDate: '',
  isActive: false,
  registrationDate: '',
  custodianId: '',
};

const StudentTab = () => {
  const [selectedStudent, setSelectedStudent] = useState<DetailedStudent>(initStudent);
  const [openUpdateDialog, setOpenUpdateDialog] = useState<boolean>(false);
  const [students, setStudents] = useState<Student[]>(dummyData as Student[]);

  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [newStudent, setNewStudent] = useState<DetailedStudent>(initStudent);

  const handleUpdateClick = (student: Student) => {
    const detailedStudent: DetailedStudent = students.find(
      (object) => object.id === student.id
    ) as DetailedStudent;
    setSelectedStudent(detailedStudent);
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
    console.log('Değişiklikler kaydedildi:', selectedStudent);
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === selectedStudent.id ? { ...student, ...selectedStudent } : student
      )
    );
    setOpenUpdateDialog(false);
  };

  const handleAddStudentClick = () => {
    setOpenAddDialog(true);
  };

  const handleAddStudentClose = () => {
    setOpenAddDialog(false);
  };

  const handleAddStudentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewStudent({ ...newStudent, [name]: value });
  };

  const handleAddStudentSave = () => {
    //backend e request atilicak
    setStudents((prevStudents) => [...prevStudents, newStudent as Student]);
    setNewStudent(initStudent);
    setOpenAddDialog(false);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Id', width: 200 },
    { field: 'name', headerName: 'İsim', width: 200 },
    { field: 'surname', headerName: 'Soyisim', width: 200 },
    { field: 'phoneNumber', headerName: 'Telefon', width: 200 },
    { field: 'email', headerName: 'E-Mail', width: 200 },
    {
      field: 'actions',
      headerName: '',
      width: 300,
      renderCell: (params) => {
        const handleEditClick = () => {
          handleUpdateClick(params.row);
        };

        const handleDeleteClick = () => {
          //backend e delete requesti atilacak
          const updatedStudents = students.filter((student) => student.id !== params.row.id);
          setStudents(updatedStudents);
        };

        return (
          <>
            <Button onClick={handleEditClick}>Düzenle</Button>
            <Button onClick={() => {}}>Detayli Bilgi</Button>
            <Button onClick={handleDeleteClick} color="error">
              Sil
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <>
      <Button onClick={handleAddStudentClick}>Ekle</Button>
      <Dialog open={openAddDialog} onClose={handleAddStudentClose}>
        <DialogTitle>Öğrenci Ekleme</DialogTitle>
        <DialogContent>
          <>
            {Object.keys(newStudent).map((key: string) => {
              return (
                <TextField
                  key={key}
                  label={fieldLabels[key as keyof DetailedStudent]}
                  name={key}
                  value={newStudent[key as keyof DetailedStudent]}
                  onChange={handleAddStudentInputChange}
                  fullWidth
                  sx={{ marginTop: '16px' }}
                />
              );
            })}
          </>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateDialog}>İptal</Button>
          <Button onClick={handleAddStudentSave}>Kaydet</Button>
        </DialogActions>
      </Dialog>

      <DataGrid rows={students} columns={columns} />
      <Dialog open={openUpdateDialog} onClose={handleCloseUpdateDialog}>
        <DialogTitle>Öğrenci Düzenleme</DialogTitle>
        <DialogContent>
          {selectedStudent && (
            <>
              {Object.keys(selectedStudent).map((key: string) => {
                return (
                  <TextField
                    key={key}
                    label={fieldLabels[key as keyof DetailedStudent]}
                    name={key}
                    value={selectedStudent[key as keyof DetailedStudent]}
                    onChange={handleInputChange}
                    disabled={key === 'id' || key === 'custodian_id'}
                    fullWidth
                    sx={{ marginTop: '16px' }}
                  />
                );
              })}
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

export default StudentTab;

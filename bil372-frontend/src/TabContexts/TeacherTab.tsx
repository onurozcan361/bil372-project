import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import dummyData from '../dummyOgretmen.json';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Teacher } from '../Types';
import { useState } from 'react';

const initTeacher: Teacher = {
  id: '',
  name: '',
  surname: '',
  phoneNumber: '',
  email: '',
  address: '',
  birthDate: '',
  workStatus: '',
  salary: 0,
  workPosition: '',
  profession: '',
};

const fieldLabels: Record<keyof Teacher, string> = {
  id: 'ID',
  name: 'Ad',
  surname: 'Soyad',
  phoneNumber: 'Telefon Numarasi',
  email: 'Email',
  address: 'Adres',
  birthDate: 'Dogum Tarihi',
  workStatus: 'Calisma Durumu',
  salary: 'Maaş',
  workPosition: 'Gorev',
  profession: 'Alani',
};

const TeacherTab = () => {
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher>(initTeacher);
  const [openUpdateDialog, setOpenUpdateDialog] = useState<boolean>(false);
  const [teachers, setTeachers] = useState<Teacher[]>(dummyData as Teacher[]);

  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [newTeacher, setNewTeacher] = useState<Teacher>(initTeacher);

  const handleUpdateClick = (teacher: Teacher) => {
    const updatedTeacher: Teacher = teachers.find((object) => object.id === teacher.id) as Teacher;
    setSelectedTeacher(updatedTeacher);
    setOpenUpdateDialog(true);
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSelectedTeacher({ ...selectedTeacher, [name]: value });
  };

  const handleSaveChanges = () => {
    // Buradan backende kaydedicez yapılan değişiklikleri
    console.log('Değişiklikler kaydedildi:', selectedTeacher);
    setTeachers((prevTeachers) =>
      prevTeachers.map((teacher) =>
        teacher.id === selectedTeacher.id ? { ...teacher, ...selectedTeacher } : teacher
      )
    );
    setOpenUpdateDialog(false);
  };

  const handleAddTeacherClick = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleAddTeacherInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTeacher({ ...newTeacher, [name]: value });
  };

  const handleAddTeacherSave = () => {
    //backend e request atilicak
    setTeachers((prevTeachers) => [...prevTeachers, newTeacher as Teacher]);
    setNewTeacher(initTeacher);
    setOpenAddDialog(false);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'SSN', width: 200 },
    { field: 'name', headerName: 'Isim', width: 200 },
    { field: 'surname', headerName: 'Soyisim', width: 200 },
    { field: 'phoneNumber', headerName: 'Telefon', width: 200 },
    { field: 'email', headerName: 'E-Mail', width: 200 },
    {
      field: 'actions',
      headerName: 'İşlemler',
      width: 300,
      renderCell: (params) => {
        const handleEditClick = () => {
          handleUpdateClick(params.row);
        };

        const handleDeleteClick = () => {
          //backend e delete requesti atilacak
          const updatedTeachers = teachers.filter((teacher) => teacher.id !== params.row.id);
          setTeachers(updatedTeachers);
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
      <Button onClick={handleAddTeacherClick}>Ekle</Button>
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>Ogretmen Ekle</DialogTitle>
        <DialogContent>
          <>
            {Object.keys(newTeacher).map((key: string) => {
              return (
                <TextField
                  key={key}
                  label={fieldLabels[key as keyof Teacher]}
                  name={key}
                  value={newTeacher[key as keyof Teacher]}
                  onChange={handleAddTeacherInputChange}
                  fullWidth
                  sx={{ marginTop: '16px' }}
                ></TextField>
              );
            })}
          </>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>İptal</Button>
          <Button onClick={handleAddTeacherSave}>Kaydet</Button>
        </DialogActions>
      </Dialog>
      <DataGrid columns={columns} rows={teachers}></DataGrid>
      <Dialog open={openUpdateDialog} onClose={handleCloseUpdateDialog}>
        <DialogTitle>Ogretmen Duzenle</DialogTitle>
        <DialogContent>
          {selectedTeacher && (
            <>
              {Object.keys(selectedTeacher).map((key: string) => {
                return (
                  <TextField
                    key={key}
                    label={fieldLabels[key as keyof Teacher]}
                    name={key}
                    value={selectedTeacher[key as keyof Teacher]}
                    onChange={handleInputChange}
                    disabled={key === 'id'}
                    fullWidth
                    sx={{ marginTop: '16px' }}
                  ></TextField>
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

export default TeacherTab;

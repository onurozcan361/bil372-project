import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  TextField,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Teacher } from '../Types';
import { useState } from 'react';
import ApiClient from '../ApiClient';

const initTeacher: Teacher = {
  id: '',
  name: '',
  surname: '',
  phoneNumber: '',
  email: '',
  birthDate: '',
  workStatus: '',
  salary: 0,
  workPosition: '',
};

const fieldLabels: Record<keyof Teacher, string> = {
  id: 'ID',
  name: 'Ad',
  surname: 'Soyad',
  phoneNumber: 'Telefon Numarasi',
  email: 'Email',
  birthDate: 'Dogum Tarihi',
  workStatus: 'Calisma Durumu',
  salary: 'Maaş',
  workPosition: 'Gorev',
};

interface TeacherTabProps {
  teachers: Teacher[];
}
const TeacherTab = (props: TeacherTabProps) => {
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher>(initTeacher);
  const [openUpdateDialog, setOpenUpdateDialog] = useState<boolean>(false);
  const [teachers, setTeachers] = useState<Teacher[]>(props.teachers);

  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [newTeacher, setNewTeacher] = useState<Teacher>(initTeacher);
  const [openDetailedInfoDialog, setOpenDetailedInfoDialog] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

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

  const handleSaveChanges = async () => {
    try {
      const response = await ApiClient.post('/update_calisan', selectedTeacher);
      console.log('Değişiklikler kaydedildi:', selectedTeacher, response);
      setTeachers((prevTeachers) =>
        prevTeachers.map((teacher) =>
          teacher.id === selectedTeacher.id ? { ...teacher, ...selectedTeacher } : teacher
        )
      );
      setOpenUpdateDialog(false);
    } catch (error) {
      console.error(error);
    }
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

  const handleAddTeacherSave = async () => {
    const isTeacherExist = teachers.some((teacher) => teacher.id === newTeacher.id);
    const isEmailExist = teachers.some((teacher) => teacher.email === newTeacher.email);
    const isPhoneExist = teachers.some((teacher) => teacher.phoneNumber === newTeacher.phoneNumber);
    if (isTeacherExist || isEmailExist || isPhoneExist) {
      setError('Hata: Aynı ID, telefon numarası veya e-posta ile öğretmen zaten mevcut.');
    } else {
      try {
        const response = await ApiClient.post('add_calisan', newTeacher);
        console.log(response);
        setTeachers((prevTeachers) => [...prevTeachers, newTeacher as Teacher]);
        setNewTeacher(initTeacher);
        setOpenAddDialog(false);
      } catch (error) {
        console.error(error);
      }
    }
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

        const handleDetailsClick = () => {
          setSelectedTeacher(params.row);
          setOpenDetailedInfoDialog(true);
        };

        const handleDeleteClick = async () => {
          try {
            const response = await ApiClient.delete(`/delete_calisan/${params.row.id}`);
            console.log(response);
            const updatedTeachers = teachers.filter((teacher) => teacher.id !== params.row.id);
            setTeachers(updatedTeachers);
          } catch (error) {
            console.error(error);
          }
        };

        return (
          <>
            <Button onClick={handleEditClick}>Düzenle</Button>
            <Button onClick={handleDetailsClick}>Detayli Bilgi</Button>
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
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={2000}
        onClose={() => setError('')}
        message={error}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      />

      <Button onClick={handleAddTeacherClick}>Ekle</Button>
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>Öğretmen Ekle</DialogTitle>
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
        <DialogTitle>Ögretmen Düzenle</DialogTitle>
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
      <Dialog open={openDetailedInfoDialog} onClose={() => setOpenDetailedInfoDialog(false)}>
        <DialogTitle>
          <strong>Idari Personel Detaylari</strong>
        </DialogTitle>
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
                    disabled
                    fullWidth
                    sx={{ marginTop: '16px' }}
                  ></TextField>
                );
              })}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailedInfoDialog(false)}>Kapat</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TeacherTab;

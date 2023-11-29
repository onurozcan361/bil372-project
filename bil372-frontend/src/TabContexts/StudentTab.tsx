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
import dummyVeli from '../dummyVeli.json';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Custodian, Student } from '../Types';
import ApiClient from '../ApiClient';

const fieldLabels: Record<keyof Student, string> = {
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

const initStudent: Student = {
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

const initCustodian: Custodian = {
  name: '',
  surname: '',
  id: '',
  phoneNumber: '',
  email: '',
};

interface StudentProps {
  students: Student[];
  custodians: Custodian[];
}
const StudentTab = (props: StudentProps) => {
  const [selectedStudent, setSelectedStudent] = useState<Student>(initStudent);
  const [selectedCustodian, setSelectedCustodian] = useState<Custodian>(initCustodian);
  const [openUpdateDialog, setOpenUpdateDialog] = useState<boolean>(false);
  const [openDetailedDialog, setOpenDetailedDialog] = useState<boolean>(false);
  const [students, setStudents] = useState<Student[]>(props.students);
  const [custodians, setCustodians] = useState<Custodian[]>(props.custodians);
  const [veliInfo, setVeliInfo] = useState<any>(null);
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [newStudent, setNewStudent] = useState<Student>(initStudent);
  const [newCustodian, setNewCustodian] = useState<Custodian>(initCustodian);
  const getStudentAndCustodianInfo = (studentId: string) => {
    const selectedStudent = students.find((student) => student.id === studentId);

    if (selectedStudent) {
      const custodianId = selectedStudent.custodianId;
      const custodianInfo = custodians.find((veli) => veli.id === custodianId);

      return { selectedStudent, custodianInfo };
    }

    return { selectedStudent: null, custodianInfo: null };
  };

  const handleUpdateClick = (student: Student) => {
    const detailedStudent: Student = students.find((object) => object.id === student.id) as Student;
    const detailedCustodian: Custodian = custodians.find(
      (object) => object.id === detailedStudent.custodianId
    ) as Custodian;
    setSelectedStudent(detailedStudent);
    setSelectedCustodian(detailedCustodian);
    setOpenUpdateDialog(true);
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
  };

  const handleStudentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(e);
    setSelectedStudent({ ...selectedStudent, [name]: value });
  };

  const handleCustodianInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(e);
    setSelectedCustodian({ ...selectedCustodian, [name]: value });
  };

  const handleSaveChanges = async () => {
    try {
      const response = await ApiClient.post('/update_student', {
        selectedStudent,
        selectedCustodian,
      });
      console.log('Değişiklikler kaydedildi:', selectedStudent, selectedCustodian, response);
      setCustodians((prevCustodians) =>
        prevCustodians.map((custodian) =>
          custodian.id === selectedCustodian.id ? { ...custodian, ...selectedCustodian } : custodian
        )
      );
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === selectedStudent.id ? { ...student, ...selectedStudent } : student
        )
      );
      setOpenUpdateDialog(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddStudentClick = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleAddStudentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewStudent({ ...newStudent, [name]: value });
  };

  const handleAddCustodianInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCustodian({ ...newCustodian, [name]: value });
  };

  const handleAddStudentSave = async () => {
    try {
      const response = await ApiClient.post('/add_student', { newStudent, newCustodian });
      console.log(response);
      setStudents((prevStudents) => [...prevStudents, newStudent as Student]);
      setCustodians((prevCustodians) => [...prevCustodians, newCustodian as Custodian]);
      setNewStudent(initStudent);
      setOpenAddDialog(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDetailedInfoClick = (studentId: string) => {
    const { selectedStudent, custodianInfo } = getStudentAndCustodianInfo(studentId);

    if (selectedStudent && custodianInfo) {
      setSelectedStudent(selectedStudent);
      setOpenDetailedDialog(true);
      setVeliInfo(custodianInfo); // Veli bilgilerini state'e atama
    }
  };

  const handleDetailedInfoCloseDialog = () => {
    setOpenDetailedDialog(false);
    setSelectedStudent(selectedStudent);
    setVeliInfo(null);
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

        const handleDeleteClick = async () => {
          try {
            const response = await ApiClient.delete(`/delete_student/${params.row.id}`);
            console.log(response);
            const updatedStudents = students.filter((student) => student.id !== params.row.id);
            setStudents(updatedStudents);
          } catch (error) {
            console.error(error);
          }
        };

        return (
          <>
            <Button onClick={handleEditClick}>Düzenle</Button>
            <Button onClick={() => handleDetailedInfoClick(params.row.id)}>Detaylı Bilgi</Button>
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
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>Öğrenci Ekleme</DialogTitle>
        <DialogContent>
          <>
            <h3>Öğrenci Bilgileri</h3>
            {Object.keys(newStudent).map((key: string) => {
              return (
                <TextField
                  key={key}
                  label={fieldLabels[key as keyof Student]}
                  name={key}
                  value={newStudent[key as keyof Student]}
                  onChange={handleAddStudentInputChange}
                  fullWidth
                  sx={{ marginTop: '16px' }}
                />
              );
            })}
            <h3>Veli Bilgileri</h3>
            {Object.keys(newCustodian).map((key: string) => {
              return (
                <TextField
                  key={key}
                  label={fieldLabels[key as keyof Student]}
                  name={key}
                  value={newCustodian[key as keyof Custodian]}
                  onChange={handleAddCustodianInputChange}
                  fullWidth
                  sx={{ marginTop: '16px' }}
                />
              );
            })}
          </>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>İptal</Button>
          <Button onClick={handleAddStudentSave}>Kaydet</Button>
        </DialogActions>
      </Dialog>

      <DataGrid
        rows={students}
        columns={columns}
        initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
        pageSizeOptions={[25, 50, 100]}
      />
      <Dialog open={openUpdateDialog} onClose={handleCloseUpdateDialog}>
        <DialogTitle>Öğrenci Düzenleme</DialogTitle>
        <DialogContent>
          <h3>Öğrenci Bilgileri</h3>
          {selectedStudent && (
            <>
              {Object.keys(selectedStudent).map((key: string) => {
                return (
                  <TextField
                    key={key}
                    label={fieldLabels[key as keyof Student]}
                    name={key}
                    value={selectedStudent[key as keyof Student]}
                    onChange={handleStudentInputChange}
                    disabled={key === 'id' || key === 'custodian_id'}
                    fullWidth
                    sx={{ marginTop: '16px' }}
                  />
                );
              })}
            </>
          )}
          <h3>Veli Bilgileri</h3>
          {selectedCustodian &&
            Object.keys(selectedCustodian).map((key: string) => {
              return (
                <TextField
                  key={key}
                  label={fieldLabels[key as keyof Student]}
                  name={key}
                  value={selectedCustodian[key as keyof Custodian]}
                  onChange={handleCustodianInputChange}
                  disabled={key === 'id' || key === 'custodian_id'}
                  fullWidth
                  sx={{ marginTop: '16px' }}
                />
              );
            })}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateDialog}>İptal</Button>
          <Button onClick={handleSaveChanges}>Kaydet</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDetailedDialog} onClose={handleDetailedInfoCloseDialog}>
        <DialogTitle>Öğrenci ve Veli Detayları</DialogTitle>
        <DialogContent>
          {selectedStudent && (
            <>
              <h3>Öğrenci Bilgileri</h3>
              {Object.keys(selectedStudent).map((key: string) => (
                <TextField
                  key={key}
                  label={fieldLabels[key as keyof Student]}
                  name={key}
                  value={selectedStudent[key as keyof Student]}
                  disabled
                  fullWidth
                  margin="normal"
                />
              ))}

              <h3>Veli Bilgileri</h3>
              {veliInfo && (
                <div>
                  <TextField
                    label="Veli Adı"
                    value={veliInfo.name}
                    fullWidth
                    disabled
                    margin="normal"
                  />
                  <TextField
                    label="Veli Soyadı"
                    value={veliInfo.surname}
                    disabled
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Veli Telefon Numarası"
                    value={veliInfo.phoneNumber}
                    disabled
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Veli Email"
                    value={veliInfo.email}
                    fullWidth
                    disabled
                    margin="normal"
                  />
                  {/* İhtiyaca göre diğer veli bilgilerini de gösterebilirsiniz */}
                </div>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDetailedInfoCloseDialog}>Kapat</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StudentTab;

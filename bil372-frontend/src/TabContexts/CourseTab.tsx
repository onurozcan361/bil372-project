import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import ApiClient from '../ApiClient';
import { Course } from '../Types';

const initCourse: Course = {
  id: '',
  name: '',
  weeklyHour: 0,
  demand: 0,
  teacherId: '',
  teacherName: '',
  teacherSurname: '',
};

const fieldLabels: Record<keyof Course, string> = {
  id: 'Ders Kodu',
  name: 'Ders Adi',
  weeklyHour: 'Haftalik Ders Saati',
  demand: 'Talep',
  teacherId: 'Ogretmen Id',
  teacherName: 'Ogretmen Adi',
  teacherSurname: 'Ogretmen Soyadi',
};

interface CourseTabProps {
  courses: Course[];
}
const CourseTab = (props: CourseTabProps) => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>(props.courses);
  const [openUpdateDialog, setOpenUpdateDialog] = useState<boolean>(false);
  const [openTeacherDialog, setOpenTeacherDialog] = useState<boolean>(false);
  const [newCourse, setNewCourse] = useState<Course>(initCourse);
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState<boolean>(false);

  const handleUpdateClick = (course: Course) => {
    const updatedCourse: Course = courses.find((object) => object.id === course.id) as Course;
    setSelectedCourse(updatedCourse);
    setOpenUpdateDialog(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (selectedCourse) {
      setSelectedCourse({ ...selectedCourse, [name]: value });
    }
  };

  const handleSaveChanges = async () => {
    if (selectedCourse) {
      console.log(selectedCourse);
      try {
        const response = await ApiClient.post('/update_ders', selectedCourse);
        console.log('Değişiklikler kaydedildi:', selectedCourse, response.data);
        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course.id === selectedCourse.id ? { ...course, ...selectedCourse } : course
          )
        );
        setOpenUpdateDialog(false);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log('Hata: Seçili bir kurs yok.');
    }
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
  };

  const handleAddCourseClick = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleAddCourseInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCourse({ ...newCourse, [name]: value });
  };

  const handleAddCourseSave = () => {
    const isCourseExist = courses.some((course) => course.id === newCourse.id);

    if (isCourseExist) {
      setErrorDialogOpen(true);
    } else {
      addCourseRequest(newCourse);
      setCourses((prevCourses) => [...prevCourses, newCourse as Course]);
      setNewCourse(initCourse);
      setOpenAddDialog(false);
    }
  };

  const addCourseRequest = async (course: Course) => {
    try {
      const response = await ApiClient.post('/add_ders', course);
      console.log('Response', response.data);
    } catch (error) {
      console.error('Error sending data', error);
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'DersKodu', width: 200 },
    { field: 'name', headerName: 'Ders Adi', width: 200 },
    { field: 'weeklyHour', headerName: 'Haftalik Ders Saati', width: 200 },
    { field: 'demand', headerName: 'Ders Talebi', width: 200 },
    { field: 'teacherId', headerName: 'Ogretmen Id', width: 200 },
    {
      field: 'actions',
      headerName: '',
      width: 300,
      renderCell: (params) => {
        const handleDetailsClick = () => {
          setSelectedCourse(params.row);
          setOpenTeacherDialog(true);
        };

        const handleDeleteClick = async () => {
          try {
            const response = await ApiClient.delete(`/delete_ders/${params.row.id}`);
            console.log(response);
            const updatedCourses = courses.filter((course) => course.id !== params.row.id);
            setCourses(updatedCourses);
          } catch (error) {
            console.error(error);
          }
        };

        return (
          <>
            <Button onClick={() => handleUpdateClick(params.row)}>Duzenle</Button>
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
      <Button onClick={handleAddCourseClick}>Ekle</Button>
      <DataGrid rows={courses} columns={columns}></DataGrid>

      {/* Error Dialog */}
      <Dialog open={errorDialogOpen} onClose={() => setErrorDialogOpen(false)}>
        <DialogTitle>
          <strong>HATA</strong>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Aynı ID ile kurs zaten mevcut.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorDialogOpen(false)}>OK</Button>
        </DialogActions>
      </Dialog>

      {/* Teacher Details Dialog */}
      <Dialog open={openTeacherDialog} onClose={() => setOpenTeacherDialog(false)}>
        <DialogTitle>
          <strong>Ders ve Öğretmen Detayları</strong>
        </DialogTitle>
        <DialogContent>
          {selectedCourse && (
            <>
              <p>
                <strong>Ders Bilgileri:</strong>
              </p>
              <p>Ders Kodu: {selectedCourse.id}</p>
              <p>Ders Adı: {selectedCourse.name}</p>
              <p>Haftalık Ders Saati: {selectedCourse.weeklyHour}</p>
              <p>Ders Talebi: {selectedCourse.demand}</p>
              <p>
                <strong>Öğretmen: </strong>
                {selectedCourse.teacherName} {selectedCourse.teacherSurname}
              </p>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTeacherDialog(false)}>Kapat</Button>
        </DialogActions>
      </Dialog>

      {/* Add Course Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>Ders Ekleme</DialogTitle>
        <DialogContent>
          <>
            {Object.keys(newCourse)
              .filter((key: string) => key !== 'teacherName')
              .filter((key: string) => key !== 'teacherSurname')
              .map((key: string) => {
                return (
                  <TextField
                    key={key}
                    label={fieldLabels[key as keyof Course]}
                    name={key}
                    value={newCourse[key as keyof Course]}
                    onChange={handleAddCourseInputChange}
                    fullWidth
                    sx={{ marginTop: '16px' }}
                  />
                );
              })}
          </>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>İptal</Button>
          <Button onClick={handleAddCourseSave}>Kaydet</Button>
        </DialogActions>
      </Dialog>

      {/* Update Course Dialog */}
      <Dialog open={openUpdateDialog} onClose={handleCloseUpdateDialog}>
        <DialogTitle>Ders Düzenleme</DialogTitle>
        <DialogContent>
          {selectedCourse && (
            <>
              {Object.keys(selectedCourse)
                .filter((key: string) => key !== 'teacherName')
                .filter((key: string) => key !== 'teacherSurname')
                .map((key: string) => {
                  return (
                    <TextField
                      key={key}
                      label={fieldLabels[key as keyof Course]}
                      name={key}
                      value={selectedCourse[key as keyof Course]}
                      onChange={handleInputChange}
                      fullWidth
                      disabled={key === 'id' || key === 'demand'}
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

export default CourseTab;
function setError(arg0: string) {
  throw new Error('Function not implemented.');
}

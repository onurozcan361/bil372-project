import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import dummyDers from '../dummyDers.json';
import dummyOgretmen from '../dummyOgretmen.json';
import ApiClient from '../ApiClient';

interface Course {
  id: string;
  name: string;
  weeklyHour: number;
  demand: number;
  teacherId: string;
}

const initCourse: Course = {
  id: '',
  name: '',
  weeklyHour: 0,
  demand: 0,
  teacherId: '',
};

const fieldLabels: Record<keyof Course, string> = {
  id: 'Ders Kodu',
  name: 'Ders Adi',
  weeklyHour: 'Haftalik Ders Saati',
  demand: 'Talep',
  teacherId: 'Ogretmen Id',
};

const CourseTab = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>(dummyDers);
  const [openUpdateDialog, setOpenUpdateDialog] = useState<boolean>(false);
  const [openTeacherDialog, setOpenTeacherDialog] = useState<boolean>(false);
  const [teachers, setTeachers] = useState<any[]>(dummyOgretmen);
  const [newCourse, setNewCourse] = useState<Course>(initCourse);
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);

  const getTeacherName = (teacherId: string): string => {
    const teacher = teachers.find((teacher) => teacher.id === teacherId);
    return teacher ? `${teacher.name} ${teacher.surname}` : 'Öğretmen Bulunamadı';
  };

  const handleUpdateClick = (course: Course) => {
    const updatedCourse: Course = courses.find((object) => object.id === course.id) as Course;
    setSelectedCourse(updatedCourse);
    setOpenUpdateDialog(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // selectedCourse null kontrolü yapılıyor
    if (selectedCourse) {
      setSelectedCourse({ ...selectedCourse, [name]: value });
    }
  };

  const handleSaveChanges = () => {
    if (selectedCourse) {
      // selectedCourse null değilse, backende kaydedicez yapılan değişiklikleri
      console.log('Değişiklikler kaydedildi:', selectedCourse);
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === selectedCourse.id ? { ...course, ...selectedCourse } : course
        )
      );
      setOpenUpdateDialog(false);
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
    //backend e request atilicak
    addCourseRequest(newCourse);
    setCourses((prevCourses) => [...prevCourses, newCourse as Course]);
    setNewCourse(initCourse);
    setOpenAddDialog(false);
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
          const teacherName = getTeacherName(params.row.teacherId);
          setSelectedCourse(params.row);
          setOpenTeacherDialog(true);
        };

        const handleDeleteClick = () => {
          //backend e delete requesti atilacak
          const updatedCourses = courses.filter((course) => course.id !== params.row.id);
          setCourses(updatedCourses);
        };

        return (
          <>
            <Button onClick={() => handleUpdateClick(params.row)}>Duzenle</Button>
            <Button onClick={handleDetailsClick}>Detayli Bilgi</Button>
            <Button onClick={handleDeleteClick} color="error">Sil</Button>
          </>
        );
      },
    },
  ];

  return (
    <>
      <Button onClick={handleAddCourseClick}>Ekle</Button>
      <DataGrid rows={courses} columns={columns}></DataGrid>

      {/* Teacher Details Dialog */}
      <Dialog open={openTeacherDialog} onClose={() => setOpenTeacherDialog(false)}>
      <DialogTitle><strong>Ders ve Öğretmen Detayları</strong></DialogTitle>
        <DialogContent>
          {selectedCourse && (
            <>
              <p><strong>Ders Bilgileri:</strong></p>
              <p>Ders Kodu: {selectedCourse.id}</p>
              <p>Ders Adı: {selectedCourse.name}</p>
              <p>Haftalık Ders Saati: {selectedCourse.weeklyHour}</p>
              <p>Ders Talebi: {selectedCourse.demand}</p>
              <p><strong>Öğretmen: </strong>{getTeacherName(selectedCourse.teacherId)}</p>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTeacherDialog(false)}>Kapat</Button>
        </DialogActions>
      </Dialog>

      {/* Add Course Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>Öğrenci Ekleme</DialogTitle>
        <DialogContent>
          <>
            {Object.keys(newCourse).map((key: string) => {
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
        <DialogTitle>Ders Duzenleme</DialogTitle>
        <DialogContent>
          {selectedCourse && (
            <>
              {Object.keys(selectedCourse).map((key: string) => {
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

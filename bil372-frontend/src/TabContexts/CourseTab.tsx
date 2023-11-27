import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import dummyDers from '../dummyDers.json';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { Course } from '../Types';
import { useState } from 'react';

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
  const [selectedCourse, setSelectedCourse] = useState<Course>(initCourse);
  const [courses, setCourses] = useState<Course[]>(dummyDers);
  const [openUpdateDialog, setOpenUpdateDialog] = useState<boolean>(false);

  const [newCourse, setNewCourse] = useState<Course>(initCourse);
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);

  const handleUpdateClick = (course: Course) => {
    const updatedCourse: Course = courses.find((object) => object.id === course.id) as Course;
    setSelectedCourse(updatedCourse);
    setOpenUpdateDialog(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSelectedCourse({ ...selectedCourse, [name]: value });
  };

  const handleSaveChanges = () => {
    // Buradan backende kaydedicez yapılan değişiklikleri
    console.log('Değişiklikler kaydedildi:', selectedCourse);
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === selectedCourse.id ? { ...course, ...selectedCourse } : course
      )
    );
    setOpenUpdateDialog(false);
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
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
        const handleClick = () => {
          handleUpdateClick(params.row);
        };

        const handleDeleteClick = () => {
          //backend e delete requesti atilacak
          const updatedCourses = courses.filter((course) => course.id !== params.row.id);
          setCourses(updatedCourses);
        };

        return (
          <>
            <Button onClick={handleClick}>Duzenle</Button>
            <Button onClick={() => {}}>Detayli Bilgi</Button>
            <Button onClick={handleDeleteClick} color="error">
              Sil
            </Button>
          </>
        );
      },
    },
  ];

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
    setCourses((prevCourses) => [...prevCourses, newCourse as Course]);
    setNewCourse(initCourse);
    setOpenAddDialog(false);
  };

  return (
    <>
      <Button onClick={handleAddCourseClick}>Ekle</Button>
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
      <DataGrid rows={courses} columns={columns}></DataGrid>

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

export default CourseTab;

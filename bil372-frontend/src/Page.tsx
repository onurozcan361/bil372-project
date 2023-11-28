import { TabContext, TabPanel } from '@mui/lab';
import { Box, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import StudentTab from './TabContexts/StudentTab';
import TeacherTab from './TabContexts/TeacherTab';
import CourseTab from './TabContexts/CourseTab';
import AdministrativeStaff from './TabContexts/AdministrativeStaffTab';
import CleaningStaffTab from './TabContexts/CleaningStaffTab';
import StockTab from './TabContexts/StockTab';
import ApiClient from './ApiClient';
import { Course, Custodian, Student, Teacher } from './Types';
import StudentAvaliableTimesTab from './TabContexts/StudentAvaliableTimesTab';

export const Page = () => {
  const [value, setValue] = useState('1');
  const [students, setStudents] = useState<Student[] | undefined>([]);
  const [custodians, setCustodians] = useState<Custodian[] | undefined>([]);
  const [courses, setCourses] = useState<Course[] | undefined>([]);
  const [teachers, setTeachers] = useState<Teacher[] | undefined>([]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    if (newValue === '1') {
      getStudents();
    } else if (newValue === '2') {
    } else if (newValue === '3') {
      getCourses();
    } else if (newValue === '4') {
    } else if (newValue === '5') {
    } else if (newValue === '6') {
    } else if (newValue === '7') {
    }
  };

  const getStudents = async () => {
    try {
      const response = await ApiClient.get('/get_students');
      setStudents(response.data[0]);
      setCustodians(response.data[1]);
    } catch (error) {
      console.error(error);
    }
  };

  const getCourses = async () => {
    try {
      const response = await ApiClient.get('/get_ders');
      setCourses(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // const getTeachers = async () => {
  //   try {
  //     const response = await ApiClient.get('/get_students');
  //     setTeachers(response.data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: 'background.paper',
        display: 'flex',
        height: '100%',
      }}
    >
      <TabContext value={value}>
        <Tabs onChange={handleChange} variant="scrollable" value={value} orientation="vertical">
          <Tab label="Ogrenci" value="1" />
          <Tab label="Ogretmen" value="2" />
          <Tab label="Ders" value="3" />
          <Tab label="Idari Personel" value="4" />
          <Tab label="Temizlik Gorevlileri" value="5" />
          <Tab label="Stok" value="6" />
          <Tab label="Gider" value="7" />
          <Tab label="Ogrenci Musaitlik Zamanlari" value="8"></Tab>
        </Tabs>
        <TabPanel value="1">
          <StudentTab students={students as Student[]} custodians={custodians as Custodian[]} />
        </TabPanel>
        <TabPanel value="2">
          <TeacherTab />
        </TabPanel>
        <TabPanel value="3">
          <CourseTab />
        </TabPanel>
        <TabPanel value="4">
          <AdministrativeStaff />
        </TabPanel>
        <TabPanel value="5">
          <CleaningStaffTab />
        </TabPanel>
        <TabPanel value="6">
          <StockTab />
        </TabPanel>
        <TabPanel value="7">Giderler</TabPanel>
        <TabPanel value="8">
          <StudentAvaliableTimesTab />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

import { TabContext, TabPanel } from '@mui/lab';
import { Box, CircularProgress, Tab, Tabs } from '@mui/material';
import { useEffect, useState } from 'react';
import StudentTab from './TabContexts/StudentTab';
import TeacherTab from './TabContexts/TeacherTab';
import CourseTab from './TabContexts/CourseTab';
import AdministrativeStaffTab from './TabContexts/AdministrativeStaffTab';
import CleaningStaffTab from './TabContexts/CleaningStaffTab';
import StockTab from './TabContexts/StockTab';
import ApiClient from './ApiClient';
import {
  AdministrativeStaff,
  CleaningStaff,
  Course,
  Custodian,
  Expenditure,
  Stock,
  Student,
  Teacher,
} from './Types';
import StudentScheduleViewer from './TabContexts/AvailableTabComponents/StudentScheduleViewer';
import ExpeditureTab from './TabContexts/ExpenditureTab';
import TeacherScheduleViewer from './TabContexts/AvailableTabComponents/TeacherScheduleViewer';

export const Page = () => {
  const [value, setValue] = useState('1');
  const [students, setStudents] = useState<Student[] | undefined>([]);
  const [custodians, setCustodians] = useState<Custodian[] | undefined>([]);
  const [courses, setCourses] = useState<Course[] | undefined>([]);
  const [teachers, setTeachers] = useState<Teacher[] | undefined>([]);
  const [administrativeStaffs, setAdministrativeStaffs] = useState<
    AdministrativeStaff[] | undefined
  >([]);
  const [cleaningStaffs, setCleaningStaffs] = useState<CleaningStaff[] | undefined>([]);
  const [stocks, setStocks] = useState<Stock[] | undefined>([]);
  const [expenditures, setExpenditures] = useState<Expenditure[] | undefined>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getStudents();
  }, []);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    if (newValue === '1') {
      getStudents();
    } else if (newValue === '2') {
      getTeachers();
    } else if (newValue === '3') {
      getCourses();
    } else if (newValue === '4') {
      getAdministrativeStaff();
    } else if (newValue === '5') {
      getCleaningStaff();
    } else if (newValue === '6') {
      getStocks();
    } else if (newValue === '7') {
      getExpenditure();
    }
  };

  const getStudents = async () => {
    setLoading(true);
    try {
      const response = await ApiClient.get('/get_students');
      setStudents(response.data[0]);
      setCustodians(response.data[1]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getCourses = async () => {
    setLoading(true);
    try {
      const response = await ApiClient.get('/get_ders');
      setCourses(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getTeachers = async () => {
    setLoading(true);
    try {
      const response = await ApiClient.get('/get_ogretmenler');
      setTeachers(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getAdministrativeStaff = async () => {
    setLoading(true);
    try {
      const response = await ApiClient.get('/get_idari_personel');
      setAdministrativeStaffs(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getCleaningStaff = async () => {
    setLoading(true);
    try {
      const response = await ApiClient.get('/get_temizlik_gorevlileri');
      setCleaningStaffs(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStocks = async () => {
    setLoading(true);
    try {
      const response = await ApiClient.get('/get_malzeme');
      setStocks(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getExpenditure = async () => {
    setLoading(true);
    try {
      const response = await ApiClient.get('/get_gider');
      setExpenditures(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
          <Tab label="Ogretmen Musaitlik Zamanlari" value="9"></Tab>
        </Tabs>
        {loading ? (
          <Box
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}
          >
            <CircularProgress /> {/* Yükleme göstergesi */}
          </Box>
        ) : (
          <>
            <TabPanel value="1">
              <StudentTab students={students as Student[]} custodians={custodians as Custodian[]} />
            </TabPanel>
            <TabPanel value="2">
              <TeacherTab teachers={teachers as Teacher[]} />
            </TabPanel>
            <TabPanel value="3">
              <CourseTab courses={courses as Course[]} />
            </TabPanel>
            <TabPanel value="4">
              <AdministrativeStaffTab
                administrativeStaffs={administrativeStaffs as AdministrativeStaff[]}
              />
            </TabPanel>
            <TabPanel value="5">
              <CleaningStaffTab cleaningStaffs={cleaningStaffs as CleaningStaff[]} />
            </TabPanel>
            <TabPanel value="6">
              <StockTab stocks={stocks as Stock[]} />
            </TabPanel>
            <TabPanel value="7">
              <ExpeditureTab expenditures={expenditures as Expenditure[]} />
            </TabPanel>
            <TabPanel value="8">
              <StudentScheduleViewer />
            </TabPanel>
            <TabPanel value="9">
              <TeacherScheduleViewer />
            </TabPanel>
          </>
        )}
      </TabContext>
    </Box>
  );
};

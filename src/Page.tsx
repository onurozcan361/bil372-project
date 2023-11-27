import { TabContext, TabList, TabPanel } from '@mui/lab';
import { AppBar, Box, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import StudentTab from './TabContexts/StudentTab';
import TeacherTab from './TabContexts/TeacherTab';
import CourseTab from './TabContexts/CourseTab';
import AdministrativeStaff from './TabContexts/AdministrativeStaffTab';

export const Page = () => {
  const [value, setValue] = useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
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
        </Tabs>

        <TabPanel value="1">
          <StudentTab />
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
        <TabPanel value="5">Temizlik Gorevlileri</TabPanel>
        <TabPanel value="6">Stoklar</TabPanel>
        <TabPanel value="7">Giderler</TabPanel>
      </TabContext>
    </Box>
  );
};

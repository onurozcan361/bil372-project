import { useState } from 'react';
import { StudentAvailableTime } from '../../Types';
import StudentAvailableTimesTabTable from './StudentAvailableTimesTable';
import SearchBar from './SearchBar';
import ApiClient from '../../ApiClient';

const StudentScheduleViewer: React.FC = () => {
  const [studentId, setStudentId] = useState<string>(''); // Seçilen öğrenci ID'si
  const [studentAvailableTimes, setStudentAvailableTimes] = useState<StudentAvailableTime[]>([]);

  const handleSearch = async (id: string) => {
    try {
      const response = await ApiClient.get(`/get_student_musaitlik_zamani/${id}`);
      console.log(response.data);
      setStudentAvailableTimes(response.data);
    } catch (error) {
      console.error(error);
    }

    setStudentId(id);
  };

  return (
    <div>
      <SearchBar placeholder="Bir şeyler arayın..." onSearch={handleSearch} />
      {studentAvailableTimes.length > 0 ? (
        <StudentAvailableTimesTabTable studentAvailableTimes={studentAvailableTimes} />
      ) : (
        <p>Öğrenci bulunamadı veya mevcut zaman bilgisi yok.</p>
      )}
    </div>
  );
};

export default StudentScheduleViewer;

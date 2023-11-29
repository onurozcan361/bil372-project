import { useState } from 'react';
import { TeacherAvailableTime } from '../../Types';

import SearchBar from './SearchBar';
import TeacherAvailableTimesTabTable from './TeacherAvailableTimesTab';
import ApiClient from '../../ApiClient';

const TeacherScheduleViewer: React.FC = () => {
  const [teacherId, setTeacherId] = useState<string>(''); // Seçilen öğrenci ID'si
  const [teacherAvailableTimes, setTeacherAvailableTimes] = useState<TeacherAvailableTime[]>([]);

  const handleSearch = async (id: string) => {
    try {
      const response = await ApiClient.get(`/get_teacher_musaitlik_zamani/${id}`);
      setTeacherAvailableTimes(response.data);
    } catch (error) {
      console.error(error);
    }

    setTeacherId(id);
  };

  return (
    <div>
      <SearchBar placeholder="Bir şeyler arayın..." onSearch={handleSearch} />
      {teacherAvailableTimes.length > 0 ? (
        <TeacherAvailableTimesTabTable teacherAvailableTimes={teacherAvailableTimes} />
      ) : (
        <p>Ogretmen bulunamadı veya mevcut zaman bilgisi yok.</p>
      )}
    </div>
  );
};

export default TeacherScheduleViewer;

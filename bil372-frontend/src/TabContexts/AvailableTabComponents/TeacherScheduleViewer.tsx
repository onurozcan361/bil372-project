import { useState } from 'react';
import { TeacherAvailableTime } from '../../Types';

import SearchBar from './SearchBar';
import TeacherAvailableTimesTabTable from './TeacherAvailableTimesTab';
import ApiClient from '../../ApiClient';

const TeacherScheduleViewer: React.FC = () => {
  const [teacherId, setTeacherId] = useState<string>(''); // Seçilen öğrenci ID'si
  const [teacherAvailableTimes, setTeacherAvailableTimes] = useState<TeacherAvailableTime[]>([]);

  const handleSearch = async (id: string) => {
    // Burada, öğrenci ID'sine göre verileri getirmek için gerekli API çağrıları veya işlemler yapılabilir.
    // Örneğin, öğrenci ID'sine göre sunucudan verileri getirirsiniz ve setTeacherAvailableTimes ile state'i güncellersiniz.
    // Örnek olarak, sabit bir veri kullanımı:

    try {
      const response = await ApiClient.get(`/get_teacher_musaitlik_zamani/${id}`);
      setTeacherAvailableTimes(response.data);
    } catch (error) {
      console.error(error);
    }

    const mockTeacherData = [
      {
        id: 1,
        day: 'Pzt',
        startTime: '08:00',
        endTime: '10:00',
        teacherId: 'ABC123',
      },
      {
        id: 2,
        day: 'Pzt',
        startTime: '13:00',
        endTime: '15:00',
        teacherId: 'ABC123',
      },
      {
        id: 3,
        day: 'Sal',
        startTime: '10:00',
        endTime: '12:00',
        teacherId: 'ABC123',
      },
      {
        id: 4,
        day: 'Çar',
        startTime: '09:00',
        endTime: '12:00',
        teacherId: 'ABC123',
      },
      {
        id: 5,
        day: 'Per',
        startTime: '14:00',
        endTime: '16:00',
        teacherId: 'ABC123',
      },
      {
        id: 6,
        day: 'Cum',
        startTime: '08:00',
        endTime: '09:00',
        teacherId: 'ABC123',
      },
    ];

    const filteredTeacherData = mockTeacherData.filter((teacher) => teacher.teacherId === id);
    setTeacherAvailableTimes(filteredTeacherData);
    setTeacherId(id);
  };

  return (
    <div>
      <SearchBar placeholder="Bir şeyler arayın..." onSearch={handleSearch} />
      {teacherAvailableTimes.length > 0 ? (
        <TeacherAvailableTimesTabTable teacherAvailableTimes={teacherAvailableTimes} />
      ) : (
        <p>Öğrenci bulunamadı veya mevcut zaman bilgisi yok.</p>
      )}
    </div>
  );
};

export default TeacherScheduleViewer;

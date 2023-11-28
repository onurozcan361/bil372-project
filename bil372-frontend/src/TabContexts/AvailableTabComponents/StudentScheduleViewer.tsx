import { useState } from 'react';
import { StudentAvailableTime } from '../../Types';
import StudentAvaliableTimesTabTable from './StudentAvaliableTimesTable';
import SearchBar from './SearchBar';

const StudentScheduleViewer: React.FC = () => {
  const [studentId, setStudentId] = useState<string>(''); // Seçilen öğrenci ID'si
  const [studentAvailableTimes, setStudentAvailableTimes] = useState<StudentAvailableTime[]>([]);

  const handleSearch = (id: string) => {
    // Burada, öğrenci ID'sine göre verileri getirmek için gerekli API çağrıları veya işlemler yapılabilir.
    // Örneğin, öğrenci ID'sine göre sunucudan verileri getirirsiniz ve setStudentAvailableTimes ile state'i güncellersiniz.
    // Örnek olarak, sabit bir veri kullanımı:

    const mockStudentData = [
      {
        id: 1,
        day: 'Pzt',
        startTime: '08:00',
        endTime: '10:00',
        studentId: 'ABC123',
      },
      {
        id: 2,
        day: 'Pzt',
        startTime: '13:00',
        endTime: '15:00',
        studentId: 'ABC123',
      },
      {
        id: 3,
        day: 'Sal',
        startTime: '10:00',
        endTime: '12:00',
        studentId: 'ABC123',
      },
      {
        id: 4,
        day: 'Çar',
        startTime: '09:00',
        endTime: '12:00',
        studentId: 'ABC123',
      },
      {
        id: 5,
        day: 'Per',
        startTime: '14:00',
        endTime: '16:00',
        studentId: 'ABC123',
      },
      {
        id: 6,
        day: 'Cum',
        startTime: '08:00',
        endTime: '09:00',
        studentId: 'ABC123',
      },
    ];

    const filteredStudentData = mockStudentData.filter((student) => student.studentId === id);
    setStudentAvailableTimes(filteredStudentData);
    setStudentId(id);
  };

  return (
    <div>
      <SearchBar placeholder="Bir şeyler arayın..." onSearch={handleSearch} />
      {studentAvailableTimes.length > 0 ? (
        <StudentAvaliableTimesTabTable studentAvailableTimes={studentAvailableTimes} />
      ) : (
        <p>Öğrenci bulunamadı veya mevcut zaman bilgisi yok.</p>
      )}
    </div>
  );
};

export default StudentScheduleViewer;

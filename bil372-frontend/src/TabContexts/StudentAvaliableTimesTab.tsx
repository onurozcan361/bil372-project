import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { StudentAvailableTime } from '../Types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const daysOfWeek = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum'];
const timeSlots = Array.from({ length: 11 }, (_, i) => `${i + 8}:00 - ${i + 9}:00`);

const studentAvailableTimes: StudentAvailableTime[] = [
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
  //... Diğer günler için aynı formatta devam edebilir.
];

const StudentAvaliableTimesTab = () => {
  const [schedule, setSchedule] = useState<JSX.Element[][]>(
    Array.from({ length: daysOfWeek.length }, () =>
      Array.from({ length: timeSlots.length }, () => <></>)
    )
  );

  useEffect(() => {
    const updatedSchedule = Array.from({ length: daysOfWeek.length }, () =>
      Array.from({ length: timeSlots.length }, () => <></>)
    );

    studentAvailableTimes.forEach((time) => {
      const dayIndex = daysOfWeek.indexOf(time.day);
      if (dayIndex !== -1) {
        const startHour = parseInt(time.startTime.split(':')[0], 10);
        const rowStartIndex = startHour - 8;

        const endHour = parseInt(time.endTime.split(':')[0], 10);
        const rowEndIndex = endHour - 8;

        for (let i = rowStartIndex; i < rowEndIndex; i++) {
          if (updatedSchedule[dayIndex]) {
            updatedSchedule[dayIndex][i] = (
              <FontAwesomeIcon icon={faCheck} style={{ color: 'green' }} />
            );
          }
        }
      }
    });

    setSchedule(updatedSchedule);
  }, [studentAvailableTimes]);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            {daysOfWeek.map((day, index) => (
              <TableCell key={index}>{day}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {timeSlots.map((timeSlot, rowIndex) => (
            <TableRow key={rowIndex}>
              <TableCell>{timeSlot}</TableCell>
              {schedule.map((row, colIndex) => (
                <TableCell key={colIndex}>{schedule[colIndex][rowIndex]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StudentAvaliableTimesTab;

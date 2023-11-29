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
import { StudentAvailableTime } from '../../Types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const daysOfWeek = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum'];
const timeSlots = Array.from({ length: 11 }, (_, i) => `${i + 8}:00 - ${i + 9}:00`);

interface StudentAvailableTimesProps {
  studentAvailableTimes: StudentAvailableTime[];
}
const StudentAvailableTimesTabTable = (props: StudentAvailableTimesProps) => {
  const [schedule, setSchedule] = useState<JSX.Element[][]>(
    Array.from({ length: daysOfWeek.length }, () =>
      Array.from({ length: timeSlots.length }, () => <></>)
    )
  );

  useEffect(() => {
    const updatedSchedule = Array.from({ length: daysOfWeek.length }, () =>
      Array.from({ length: timeSlots.length }, () => <></>)
    );

    props.studentAvailableTimes.forEach((time) => {
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
  }, [props.studentAvailableTimes]);

  return (
    <>
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
    </>
  );
};

export default StudentAvailableTimesTabTable;

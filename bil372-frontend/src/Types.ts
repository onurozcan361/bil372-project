export interface Student {
  id: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  address: string;
  registrationDate: string;
  isActive: boolean;
  custodianId: string;
}

export interface Employee {
  id: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  workStatus: string;
  salary: number;
  workPosition: string;
}

export interface Teacher extends Employee {}

export interface AdministrativeStaff extends Employee {
  administrativePosition: string;
}

export interface CleaningStaff extends Employee {}

export interface Course {
  id: string;
  name: string;
  weeklyHour: number;
  demand: number;
  teacherId: string;
  teacherName: string;
  teacherSurname: string;
}

export interface Custodian {
  id: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
}

export interface Expenditure {
  id: string;
  fee: number;
  type: string;
  date: string;
}

export interface Stock {
  id: string;
  name: string;
  quantity: number;
  minimumQuantity: number;
  cost: number;
}

export interface StudentAvailableTime {
  id: number;
  day: string;
  startTime: string;
  endTime: string;
  studentId: string;
}

export interface TeacherAvailableTime {
  id: number;
  day: string;
  startTime: string;
  endTime: string;
  teacherId: string;
}

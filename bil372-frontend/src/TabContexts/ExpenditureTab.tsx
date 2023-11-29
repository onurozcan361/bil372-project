import {
  Button,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from '@mui/material';
import { GridColDef, DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { Expenditure } from '../Types';
import ApiClient from '../ApiClient';

const initExpenditure = {
  id: '',
  fee: 0,
  type: '',
  date: '',
};

const fieldLabels: Record<keyof Expenditure, string> = {
  id: 'ID',
  fee: 'Toplam Ucret',
  type: 'Gider Turu',
  date: 'Son Islem Tarihi',
};
interface ExpenditureTabProps {
  expenditures: Expenditure[];
}
const ExpeditureTab = (props: ExpenditureTabProps) => {
  const [expenditures, setExpenditures] = useState<Expenditure[]>(props.expenditures);

  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [newExpenditure, setNewExpenditure] = useState<Expenditure>(initExpenditure);
  const [error, setError] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('');
  const [filteredExpenditures, setFilteredExpenditures] = useState<Expenditure[]>([]);
  const [totalSpent, setTotalSpent] = useState<number>();

  useEffect(() => {
    const filterWeekly = () => {
      const currentDate = new Date();
      const weekAgoDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);

      const filtered = expenditures.filter(
        (expenditure) =>
          new Date(expenditure.date) >= weekAgoDate && new Date(expenditure.date) <= currentDate
      );

      setFilteredExpenditures(filtered);
      const total: number = filtered.reduce((acc, exp) => acc + exp.fee, 0);
      setTotalSpent(total);
    };

    const filterMonthly = () => {
      const currentDate = new Date();
      const monthAgoDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        currentDate.getDate()
      );

      const filtered = expenditures.filter(
        (expenditure) =>
          new Date(expenditure.date) >= monthAgoDate && new Date(expenditure.date) <= currentDate
      );

      setFilteredExpenditures(filtered);
      const total: number = filtered.reduce((acc, exp) => acc + exp.fee, 0);
      setTotalSpent(total);
    };

    if (selectedFilter === 'weekly') {
      filterWeekly();
    } else if (selectedFilter === 'monthly') {
      filterMonthly();
    } else {
      setFilteredExpenditures(expenditures);
      const total = expenditures.reduce((acc, exp) => acc + exp.fee, 0);
      setTotalSpent(total);
    }
  }, [expenditures, selectedFilter]);

  const handleAddExpenditureSave = async () => {
    const isExpenditureExist = expenditures.some(
      (expenditure) => expenditure.id === newExpenditure.id
    );
    if (isExpenditureExist) {
      setError('Hata: Aynı ID ile gider zaten mevcut.');
    } else {
      try {
        const response = await ApiClient.post('/add_gider', newExpenditure);
        console.log(response);
        setExpenditures((prevExpenditures) => [...prevExpenditures, newExpenditure as Expenditure]);
        setNewExpenditure(initExpenditure);
        setOpenAddDialog(false);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleAddExpenditureClick = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleAddExpenditureInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewExpenditure({ ...newExpenditure, [name]: value });
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 200 },
    { field: 'type', headerName: 'Gider Turu', width: 200 },
    { field: 'fee', headerName: 'Toplam Ucret', width: 200 },
    { field: 'date', headerName: 'Son Islem Tarihi', width: 200 },
    {
      field: 'actions',
      headerName: 'İşlemler',
      width: 200,
      renderCell: (params) => {
        const handleDeleteClick = async () => {
          try {
            const response = await ApiClient.delete(`/delete_gider/${params.row.id}`);
            console.log(response);
            const updatedExpenditures = expenditures.filter(
              (expenditure) => expenditure.id !== params.row.id
            );
            setExpenditures(updatedExpenditures);
          } catch (error) {
            console.error(error);
          }
        };

        return (
          <>
            <Button onClick={handleDeleteClick} color="error">
              Sil
            </Button>
          </>
        );
      },
    },
  ];
  return (
    <>
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={2000}
        onClose={() => setError('')}
        message={error}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      />

      <div>
        <p>
          <strong>TOPLAM HARCANAN TUTAR:</strong> {totalSpent + '₺'}
        </p>
      </div>

      <div>
        {/* Buttons for Weekly and Monthly filtering */}
        <Button onClick={() => setSelectedFilter('weekly')}>HAFTALIK</Button>
        <Button onClick={() => setSelectedFilter('monthly')}>AYLIK</Button>
      </div>

      <Button onClick={handleAddExpenditureClick}>Ekle</Button>
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>Gider Ekle</DialogTitle>
        <DialogContent>
          <>
            {Object.keys(newExpenditure).map((key: string) => {
              return (
                <TextField
                  key={key}
                  label={fieldLabels[key as keyof Expenditure]}
                  name={key}
                  value={newExpenditure[key as keyof Expenditure]}
                  onChange={handleAddExpenditureInputChange}
                  fullWidth
                  sx={{ marginTop: '16px' }}
                ></TextField>
              );
            })}
          </>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>İptal</Button>
          <Button onClick={handleAddExpenditureSave}>Kaydet</Button>
        </DialogActions>
      </Dialog>
      <DataGrid columns={columns} rows={filteredExpenditures}></DataGrid>
    </>
  );
};

export default ExpeditureTab;

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
import dummyGider from '../dummyGider.json';

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

const ExpeditureTab = () => {
  const [selectedExpenditure, setSelectedExpenditure] = useState<Expenditure>(initExpenditure);
  const [openUpdateDialog, setOpenUpdateDialog] = useState<boolean>(false);
  const [expenditures, setExpenditures] = useState<Expenditure[]>(dummyGider as Expenditure[]);

  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [newExpenditure, setNewExpenditure] = useState<Expenditure>(initExpenditure);
  const [error, setError] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>(''); // State for selected filter
  const [filteredExpenditures, setFilteredExpenditures] = useState<Expenditure[]>([]);
  const [totalSpent, setTotalSpent] = useState<number>(0); // Toplam harcanan tutar

  useEffect(() => {
    // Haftalık filtreleme
    const filterWeekly = () => {
      const currentDate = new Date();
      const weekAgoDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000); // 1 hafta önce

      const filtered = expenditures.filter(
        (expenditure) => new Date(expenditure.date) >= weekAgoDate && new Date(expenditure.date) <= currentDate
      );

      setFilteredExpenditures(filtered);
      const total = filtered.reduce((acc, exp) => acc + exp.fee, 0);
      setTotalSpent(total);
    };

    // Aylık filtreleme
    const filterMonthly = () => {
      const currentDate = new Date();
      const monthAgoDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate()); // 1 ay önce

      const filtered = expenditures.filter(
        (expenditure) =>
          new Date(expenditure.date) >= monthAgoDate && new Date(expenditure.date) <= currentDate
      );

      setFilteredExpenditures(filtered);
      const total = filtered.reduce((acc, exp) => acc + exp.fee, 0);
      setTotalSpent(total);
    };

    // Haftalık veya aylık filtreleme durumuna göre işlem yap
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

  const handleUpdateClick = (expenditure: Expenditure) => {
    const updatedExpenditure: Expenditure = expenditures.find(
      (object) => object.id === expenditure.id
    ) as Expenditure;
    setSelectedExpenditure(updatedExpenditure);
    setOpenUpdateDialog(true);
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSelectedExpenditure({ ...selectedExpenditure, [name]: value });
  };

  const handleAddExpenditureSave = () => {
    const isExpenditureExist = expenditures.some(
      (expenditure) => expenditure.id === newExpenditure.id
    );
    if (isExpenditureExist) {
      setError('Hata: Aynı ID ile gider zaten mevcut.');
    } else {
      setExpenditures((prevExpenditures) => [...prevExpenditures, newExpenditure as Expenditure]);
      setNewExpenditure(initExpenditure);
      setOpenAddDialog(false);
    }
  };

  const handleSaveChanges = () => {
    // Buradan backende kaydedicez yapılan değişiklikleri
    console.log('Değişiklikler kaydedildi:', selectedExpenditure);
    setExpenditures((prevExpenditures) =>
      prevExpenditures.map((expenditure) =>
        expenditure.id === selectedExpenditure.id
          ? { ...expenditure, ...selectedExpenditure }
          : expenditure
      )
    );
    setOpenUpdateDialog(false);
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
      width: 300,
      renderCell: (params) => {
        const handleEditClick = () => {
          handleUpdateClick(params.row);
        };

        const handleDeleteClick = () => {
          //backend e delete requesti atilacak
          const updatedExpenditures = expenditures.filter(
            (expenditure) => expenditure.id !== params.row.id
          );
          setExpenditures(updatedExpenditures);
        };

        return (
          <>
            <Button onClick={handleEditClick}>Düzenle</Button>
            <Button onClick={() => {}}>Detayli Bilgi</Button>
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
      {/* Snackbar ile hata mesajını gösterme */}
      <Snackbar
        open={Boolean(error)} // Hata mesajı varsa Snackbar'ı göster
        autoHideDuration={2000} // Otomatik olarak gizleme süresi (ms cinsinden), isteğe bağlı
        onClose={() => setError('')} // Snackbar kapatıldığında state'i temizle
        message={error} // Snackbar içeriği
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} // Yerleştirme ayarı
      />

      <div>
      <p><strong>TOPLAM HARCANAN TUTAR:</strong> {totalSpent + "₺"}</p>
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
      <Dialog open={openUpdateDialog} onClose={handleCloseUpdateDialog}>
        <DialogTitle>Gider Düzenle</DialogTitle>
        <DialogContent>
          {selectedExpenditure && (
            <>
              {Object.keys(selectedExpenditure).map((key: string) => {
                return (
                  <TextField
                    key={key}
                    label={fieldLabels[key as keyof Expenditure]}
                    name={key}
                    value={selectedExpenditure[key as keyof Expenditure]}
                    onChange={handleInputChange}
                    disabled={key === 'id'}
                    fullWidth
                    sx={{ marginTop: '16px' }}
                  ></TextField>
                );
              })}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateDialog}>İptal</Button>
          <Button onClick={handleSaveChanges}>Kaydet</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ExpeditureTab;

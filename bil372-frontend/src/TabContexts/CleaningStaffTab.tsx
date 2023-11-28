import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { CleaningStaff } from '../Types';
import { useState } from 'react';
import dummyTemizlik from '../dummyTemizlik.json';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  TextField,
} from '@mui/material';
const initCleaningStaff: CleaningStaff = {
  id: '',
  name: '',
  surname: '',
  phoneNumber: '',
  email: '',
  address: '',
  birthDate: '',
  workStatus: '',
  salary: 0,
  workPosition: '',
};

const fieldLabels: Record<keyof CleaningStaff, string> = {
  id: 'ID',
  name: 'Ad',
  surname: 'Soyad',
  phoneNumber: 'Telefon Numarasi',
  email: 'Email',
  address: 'Adres',
  birthDate: 'Dogum Tarihi',
  workPosition: 'Gorev',
  workStatus: 'Calisma Durumu',
  salary: 'Maas',
};
const CleaningStaffTab = () => {
  const [selectedCleaningStaff, setSelectedCleaningStaff] =
    useState<CleaningStaff>(initCleaningStaff);
  const [openUpdateDialog, setOpenUpdateDialog] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [cleaningStaffs, setCleaningStaffs] = useState<CleaningStaff[]>(
    dummyTemizlik as CleaningStaff[]
  );

  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [newCleaningStaff, setNewCleaningStaff] = useState<CleaningStaff>(initCleaningStaff);

  const handleUpdateClick = (cleaningStaff: CleaningStaff) => {
    const updatedCleaningStaff: CleaningStaff = cleaningStaffs.find(
      (object) => object.id === cleaningStaff.id
    ) as CleaningStaff;
    setSelectedCleaningStaff(updatedCleaningStaff);
    setOpenUpdateDialog(true);
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSelectedCleaningStaff({ ...selectedCleaningStaff, [name]: value });
  };

  const handleSaveChanges = () => {
    // Buradan backende kaydedicez yapılan değişiklikleri
    console.log('Değişiklikler kaydedildi:', selectedCleaningStaff);
    setCleaningStaffs((prevCleaningStaffs) =>
      prevCleaningStaffs.map((cleaningStaff) =>
        cleaningStaff.id === selectedCleaningStaff.id
          ? { ...cleaningStaff, ...selectedCleaningStaff }
          : cleaningStaff
      )
    );
    setOpenUpdateDialog(false);
  };

  const handleAddCleaningStaffClick = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleAddCleaningStaffInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCleaningStaff({ ...newCleaningStaff, [name]: value });
  };

  const handleAddCleaningStaffSave = () => {
    const isIdExist = cleaningStaffs.some(staff => staff.id === newCleaningStaff.id);
    const isEmailExist = cleaningStaffs.some(staff => staff.email === newCleaningStaff.email);
    const isPhoneExist = cleaningStaffs.some(staff => staff.phoneNumber === newCleaningStaff.phoneNumber);
  
    if (isIdExist || isEmailExist || isPhoneExist) {
      setError('Hata: Aynı ID veya e-posta ile Temizlik Personeli zaten mevcut.');
    } else {
      // Backend'e request atılacak
      setCleaningStaffs((prevCleaningStaffs) => [
        ...prevCleaningStaffs,
        newCleaningStaff as CleaningStaff,
      ]);
      setNewCleaningStaff(initCleaningStaff);
      setOpenAddDialog(false);
    }
  };
  

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Id', width: 200 },
    { field: 'name', headerName: 'İsim', width: 200 },
    { field: 'surname', headerName: 'Soyisim', width: 200 },
    { field: 'phoneNumber', headerName: 'Telefon', width: 200 },
    { field: 'email', headerName: 'E-Mail', width: 200 },
    {
      field: 'actions',
      headerName: '',
      width: 300,
      renderCell: (params) => {
        const handleEditClick = () => {
          handleUpdateClick(params.row);
        };

        const handleDeleteClick = () => {
          //backend e delete requesti atilacak
          const updatedCleaningStaffs = cleaningStaffs.filter(
            (cleaningStaff) => cleaningStaff.id !== params.row.id
          );
          setCleaningStaffs(updatedCleaningStaffs);
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

      <Snackbar
        open={Boolean(error)} // Hata mesajı varsa Snackbar'ı göster
        autoHideDuration={2000} // Otomatik olarak gizleme süresi (ms cinsinden), isteğe bağlı
        onClose={() => setError('')} // Snackbar kapatıldığında state'i temizle
        message={error} // Snackbar içeriği
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} // Yerleştirme ayarı
      />
      
      <Button onClick={handleAddCleaningStaffClick}>Ekle</Button>
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>Temizlik Görevlisi Ekle</DialogTitle>
        <DialogContent>
          <>
            {Object.keys(newCleaningStaff).map((key: string) => {
              return (
                <TextField
                  key={key}
                  label={fieldLabels[key as keyof CleaningStaff]}
                  name={key}
                  value={newCleaningStaff[key as keyof CleaningStaff]}
                  onChange={handleAddCleaningStaffInputChange}
                  fullWidth
                  sx={{ marginTop: '16px' }}
                ></TextField>
              );
            })}
          </>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>İptal</Button>
          <Button onClick={handleAddCleaningStaffSave}>Kaydet</Button>
        </DialogActions>
      </Dialog>
      <DataGrid rows={cleaningStaffs} columns={columns}></DataGrid>
      <Dialog open={openUpdateDialog} onClose={handleCloseUpdateDialog}>
        <DialogTitle>Temizlik Görevlisi Duzenle</DialogTitle>
        <DialogContent>
          {selectedCleaningStaff && (
            <>
              {Object.keys(selectedCleaningStaff).map((key: string) => {
                return (
                  <TextField
                    key={key}
                    label={fieldLabels[key as keyof CleaningStaff]}
                    name={key}
                    value={selectedCleaningStaff[key as keyof CleaningStaff]}
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

export default CleaningStaffTab;

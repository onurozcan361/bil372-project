import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { AdministrativeStaff } from '../Types';
import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  TextField,
} from '@mui/material';
import ApiClient from '../ApiClient';
const initAdministrativeStaff: AdministrativeStaff = {
  id: '',
  name: '',
  surname: '',
  phoneNumber: '',
  email: '',
  birthDate: '',
  workStatus: '',
  salary: 0,
  workPosition: '',
  administrativePosition: '',
};

const fieldLabels: Record<keyof AdministrativeStaff, string> = {
  id: 'ID',
  name: 'Ad',
  surname: 'Soyad',
  phoneNumber: 'Telefon Numarasi',
  email: 'Email',
  birthDate: 'Dogum Tarihi',
  workPosition: 'Gorev',
  workStatus: 'Calisma Durumu',
  salary: 'Maas',
  administrativePosition: 'Idari Pozisyon',
};

interface AdministrativeStaffTabProps {
  administrativeStaffs: AdministrativeStaff[];
}
const AdministrativeStaffTab = (props: AdministrativeStaffTabProps) => {
  const [selectedAdministrativeStaff, setSelectedAdministrativeStaff] =
    useState<AdministrativeStaff>(initAdministrativeStaff);
  const [openUpdateDialog, setOpenUpdateDialog] = useState<boolean>(false);
  const [administrativeStaffs, setAdministrativeStaffs] = useState<AdministrativeStaff[]>(
    props.administrativeStaffs
  );

  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [newAdministrativeStaff, setNewAdministrativeStaff] =
    useState<AdministrativeStaff>(initAdministrativeStaff);

  const [openDetailedInfoDialog, setOpenDetailedInfoDialog] = useState<boolean>(false);

  const handleUpdateClick = (administrativeStaff: AdministrativeStaff) => {
    const updatedAdministrativeStaff: AdministrativeStaff = administrativeStaffs.find(
      (object) => object.id === administrativeStaff.id
    ) as AdministrativeStaff;
    setSelectedAdministrativeStaff(updatedAdministrativeStaff);
    setOpenUpdateDialog(true);
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSelectedAdministrativeStaff({ ...selectedAdministrativeStaff, [name]: value });
  };

  const handleSaveChanges = async () => {
    try {
      const response = await ApiClient.post('/update_calisan', selectedAdministrativeStaff);
      console.log('Değişiklikler kaydedildi:', selectedAdministrativeStaff, response);
      setAdministrativeStaffs((prevAdministrativeStaffs) =>
        prevAdministrativeStaffs.map((administrativeStaff) =>
          administrativeStaff.id === selectedAdministrativeStaff.id
            ? { ...administrativeStaff, ...selectedAdministrativeStaff }
            : administrativeStaff
        )
      );
      setOpenUpdateDialog(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddAdministrativeStaffClick = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleAddAdministrativeStaffInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAdministrativeStaff({ ...newAdministrativeStaff, [name]: value });
  };

  const handleAddAdministrativeStaffSave = async () => {
    const isIdExist = administrativeStaffs.some((staff) => staff.id === newAdministrativeStaff.id);
    const isEmailExist = administrativeStaffs.some(
      (staff) => staff.email === newAdministrativeStaff.email
    );
    const isPhoneExist = administrativeStaffs.some(
      (staff) => staff.phoneNumber === newAdministrativeStaff.phoneNumber
    );

    if (isIdExist || isEmailExist || isPhoneExist) {
      setError('Hata: Aynı ID, telefon veya e-posta ile İdari Personel zaten mevcut.');
    } else {
      try {
        const response = await ApiClient.post('/add_calisan', newAdministrativeStaff);
        setAdministrativeStaffs((prevAdministrativeStaffs) => [
          ...prevAdministrativeStaffs,
          newAdministrativeStaff as AdministrativeStaff,
        ]);
        setNewAdministrativeStaff(initAdministrativeStaff);
        setOpenAddDialog(false);
      } catch (error) {
        console.error(error);
      }
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

        const handleDetailsClick = () => {
          setSelectedAdministrativeStaff(params.row);
          setOpenDetailedInfoDialog(true);
        };

        const handleDeleteClick = async () => {
          try {
            const response = await ApiClient.delete(`/delete_calisan/${params.row.id}`);
            console.log(response);
            const updatedAdministrativeStaffs = administrativeStaffs.filter(
              (student) => student.id !== params.row.id
            );
            setAdministrativeStaffs(updatedAdministrativeStaffs);
          } catch (error) {
            console.error(error);
          }
        };

        return (
          <>
            <Button onClick={handleEditClick}>Düzenle</Button>
            <Button onClick={handleDetailsClick}>Detayli Bilgi</Button>
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

      <Button onClick={handleAddAdministrativeStaffClick}>Ekle</Button>
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>İdari Personel Ekle</DialogTitle>
        <DialogContent>
          <>
            {Object.keys(newAdministrativeStaff).map((key: string) => {
              return (
                <TextField
                  key={key}
                  label={fieldLabels[key as keyof AdministrativeStaff]}
                  name={key}
                  value={newAdministrativeStaff[key as keyof AdministrativeStaff]}
                  onChange={handleAddAdministrativeStaffInputChange}
                  fullWidth
                  sx={{ marginTop: '16px' }}
                ></TextField>
              );
            })}
          </>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>İptal</Button>
          <Button onClick={handleAddAdministrativeStaffSave}>Kaydet</Button>
        </DialogActions>
      </Dialog>
      <DataGrid rows={administrativeStaffs} columns={columns}></DataGrid>
      <Dialog open={openUpdateDialog} onClose={handleCloseUpdateDialog}>
        <DialogTitle>İdari Personel Düzenle</DialogTitle>
        <DialogContent>
          {selectedAdministrativeStaff && (
            <>
              {Object.keys(selectedAdministrativeStaff).map((key: string) => {
                return (
                  <TextField
                    key={key}
                    label={fieldLabels[key as keyof AdministrativeStaff]}
                    name={key}
                    value={selectedAdministrativeStaff[key as keyof AdministrativeStaff]}
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
      <Dialog open={openDetailedInfoDialog} onClose={() => setOpenDetailedInfoDialog(false)}>
        <DialogTitle>
          <strong>Idari Personel Detaylari</strong>
        </DialogTitle>
        <DialogContent>
          {selectedAdministrativeStaff && (
            <>
              {Object.keys(selectedAdministrativeStaff).map((key: string) => {
                return (
                  <TextField
                    key={key}
                    label={fieldLabels[key as keyof AdministrativeStaff]}
                    name={key}
                    value={selectedAdministrativeStaff[key as keyof AdministrativeStaff]}
                    onChange={handleInputChange}
                    disabled
                    fullWidth
                    sx={{ marginTop: '16px' }}
                  ></TextField>
                );
              })}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailedInfoDialog(false)}>Kapat</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdministrativeStaffTab;

import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { AdministrativeStaff } from '../Types';
import dummyIdare from '../dummyIdare.json';
import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
const initAdministrativeStaff: AdministrativeStaff = {
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
  administrativePosition: '',
};

const fieldLabels: Record<keyof AdministrativeStaff, string> = {
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
  administrativePosition: 'Idari Pozisyon',
};

const AdministrativeStaffTab = () => {
  const [selectedAdministrativeStaff, setSelectedAdministrativeStaff] =
    useState<AdministrativeStaff>(initAdministrativeStaff);
  const [openUpdateDialog, setOpenUpdateDialog] = useState<boolean>(false);
  const [administrativeStaffs, setAdministrativeStaffs] = useState<AdministrativeStaff[]>(
    dummyIdare as AdministrativeStaff[]
  );

  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [newAdministrativeStaff, setNewAdministrativeStaff] =
    useState<AdministrativeStaff>(initAdministrativeStaff);

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

  const handleSaveChanges = () => {
    // Buradan backende kaydedicez yapılan değişiklikleri
    console.log('Değişiklikler kaydedildi:', selectedAdministrativeStaff);
    setAdministrativeStaffs((prevAdministrativeStaffs) =>
      prevAdministrativeStaffs.map((administrativeStaff) =>
        administrativeStaff.id === selectedAdministrativeStaff.id
          ? { ...administrativeStaff, ...selectedAdministrativeStaff }
          : administrativeStaff
      )
    );
    setOpenUpdateDialog(false);
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

  const handleAddAdministrativeStaffSave = () => {
    //backend e request atilicak
    setAdministrativeStaffs((prevAdministrativeStaffs) => [
      ...prevAdministrativeStaffs,
      newAdministrativeStaff as AdministrativeStaff,
    ]);
    setNewAdministrativeStaff(initAdministrativeStaff);
    setOpenAddDialog(false);
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
          const updatedAdministrativeStaffs = administrativeStaffs.filter(
            (student) => student.id !== params.row.id
          );
          setAdministrativeStaffs(updatedAdministrativeStaffs);
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
      <Button onClick={handleAddAdministrativeStaffClick}>Ekle</Button>
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>Ogretmen Ekle</DialogTitle>
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
        <DialogTitle>Idari Personel Duzenle</DialogTitle>
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
    </>
  );
};

export default AdministrativeStaffTab;

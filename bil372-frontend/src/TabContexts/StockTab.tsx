import { useState } from 'react';
import { Stock } from '../Types';
import dummyMalzeme from '../dummyMalzeme.json';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from '@mui/material';
import { GridColDef, DataGrid } from '@mui/x-data-grid';
const initStock: Stock = {
  id: '',
  name: '',
  quantity: 0,
  minimumQuantity: 0,
  cost: 0,
};

const fieldLabels: Record<keyof Stock, string> = {
  id: 'Id',
  name: 'Malzeme Adi',
  quantity: 'Miktar',
  minimumQuantity: 'Minimum Miktar',
  cost: 'Malzeme Ucreti',
};

const StockTab = () => {
  const [selectedStock, setSelectedStock] = useState<Stock>(initStock);
  const [openUpdateDialog, setOpenUpdateDialog] = useState<boolean>(false);
  const [stocks, setStocks] = useState<Stock[]>(dummyMalzeme as Stock[]);

  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [newStock, setNewStock] = useState<Stock>(initStock);

  const handleUpdateClick = (stock: Stock) => {
    const updatedStock: Stock = stocks.find((object) => object.id === stock.id) as Stock;
    setSelectedStock(updatedStock);
    setOpenUpdateDialog(true);
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSelectedStock({ ...selectedStock, [name]: value });
  };

  const handleSaveChanges = () => {
    // Buradan backende kaydedicez yapılan değişiklikleri
    console.log('Değişiklikler kaydedildi:', selectedStock);
    setStocks((prevStocks) =>
      prevStocks.map((stock) =>
        stock.id === selectedStock.id ? { ...stock, ...selectedStock } : stock
      )
    );
    setOpenUpdateDialog(false);
  };

  const handleAddStockClick = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleAddStockInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewStock({ ...newStock, [name]: value });
  };

  const handleAddStockSave = () => {
    //backend e request atilicak
    setStocks((prevStocks) => [...prevStocks, newStock as Stock]);
    setNewStock(initStock);
    setOpenAddDialog(false);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Id', width: 200 },
    { field: 'name', headerName: 'Malzeme Adi', width: 200 },
    { field: 'quantity', headerName: 'Miktar', width: 200 },
    { field: 'minimumQuantity', headerName: 'Minimum Miktar', width: 200 },
    { field: 'cost', headerName: 'Malzeme Ucreti', width: 200 },
    {
      field: 'actions',
      headerName: 'İşlemler',
      width: 200,
      renderCell: (params) => {
        const handleEditClick = () => {
          handleUpdateClick(params.row);
        };

        const handleDeleteClick = () => {
          //backend e delete requesti atilacak
          const updatedStocks = stocks.filter((stock) => stock.id !== params.row.id);
          setStocks(updatedStocks);
        };

        return (
          <>
            <Button onClick={handleEditClick}>Düzenle</Button>
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
      <Button onClick={handleAddStockClick}>Ekle</Button>
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>Ogretmen Ekle</DialogTitle>
        <DialogContent>
          <>
            {Object.keys(newStock).map((key: string) => {
              return (
                <TextField
                  key={key}
                  label={fieldLabels[key as keyof Stock]}
                  name={key}
                  value={newStock[key as keyof Stock]}
                  onChange={handleAddStockInputChange}
                  fullWidth
                  sx={{ marginTop: '16px' }}
                ></TextField>
              );
            })}
          </>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>İptal</Button>
          <Button onClick={handleAddStockSave}>Kaydet</Button>
        </DialogActions>
      </Dialog>
      <DataGrid columns={columns} rows={stocks}></DataGrid>
      <Dialog open={openUpdateDialog} onClose={handleCloseUpdateDialog}>
        <DialogTitle>Ogretmen Duzenle</DialogTitle>
        <DialogContent>
          {selectedStock && (
            <>
              {Object.keys(selectedStock).map((key: string) => {
                return (
                  <TextField
                    key={key}
                    label={fieldLabels[key as keyof Stock]}
                    name={key}
                    value={selectedStock[key as keyof Stock]}
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

export default StockTab;
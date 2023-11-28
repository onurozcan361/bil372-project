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
  Snackbar,
} from '@mui/material';
import { GridColDef, DataGrid } from '@mui/x-data-grid';
import ApiClient from '../ApiClient';
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

interface StockTab {
  stocks: Stock[];
}
const StockTab = (props: StockTab) => {
  const [selectedStock, setSelectedStock] = useState<Stock>(initStock);
  const [openUpdateDialog, setOpenUpdateDialog] = useState<boolean>(false);
  const [stocks, setStocks] = useState<Stock[]>(props.stocks);
  const [error, setError] = useState<string>('');

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

  const handleSaveChanges = async () => {
    try {
      const response = await ApiClient.post('/update_malzeme', selectedStock);
      console.log('Değişiklikler kaydedildi:', selectedStock, response);
      setStocks((prevStocks) =>
        prevStocks.map((stock) =>
          stock.id === selectedStock.id ? { ...stock, ...selectedStock } : stock
        )
      );
      setOpenUpdateDialog(false);
    } catch (error) {
      console.error(error);
    }
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

  const handleAddStockSave = async () => {
    const isIdExist = stocks.some((stock) => stock.id === newStock.id);
    if (isIdExist) {
      setError('Hata: Aynı ID Stok Öğesi zaten mevcut.');
    } else {
      try {
        const response = await ApiClient.post('/add_malzeme', newStock);
        console.log(response);
        setStocks((prevStocks) => [...prevStocks, newStock as Stock]);
        setNewStock(initStock);
        setOpenAddDialog(false);
      } catch (error) {
        console.error(error);
      }
    }
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

        const handleDeleteClick = async () => {
          try {
            const response = await ApiClient.delete(`/delete_malzeme/${params.row.id}`);
            console.log(response);
            const updatedStocks = stocks.filter((stock) => stock.id !== params.row.id);
            setStocks(updatedStocks);
          } catch (error) {
            console.error(error);
          }
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
      <Snackbar
        open={Boolean(error)} // Hata mesajı varsa Snackbar'ı göster
        autoHideDuration={2000} // Otomatik olarak gizleme süresi (ms cinsinden), isteğe bağlı
        onClose={() => setError('')} // Snackbar kapatıldığında state'i temizle
        message={error} // Snackbar içeriği
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} // Yerleştirme ayarı
      />

      <Button onClick={handleAddStockClick}>Ekle</Button>
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>Stok Ekle</DialogTitle>
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
        <DialogTitle>Stok Duzenle</DialogTitle>
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

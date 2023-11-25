import { Button } from '@mui/material';
import dummyData from '../dummy.json';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import axios from 'axios';

const columns: GridColDef[] = [
	{ field: 'isim', headerName: 'Isim', width: 200 },
	{ field: 'soyisim', headerName: 'Soyisim', width: 200 },
	{ field: 'id', headerName: 'SSN', width: 200 },
	{ field: 'telefon', headerName: 'telefon', width: 200 },
	{ field: 'email', headerName: 'E-Mail', width: 200 },
	{
		field: 'actions',
		headerName: 'İşlemler',
		width: 120,
		renderCell: (params) => {
			const handleClick = () => {
				const rowId = params.row.id;

				axios
					.get<any>(`https://your-backend-api.com/data/${rowId}`)
					.then((response) => {
						console.log('Backend yaniti:', response.data);
						// İşlemleri burada devam ettirebilirsiniz
					})
					.catch((error) => {
						console.error('Hata:', error);
					});
			};

			return <Button onClick={handleClick}>Detayli Bilgi</Button>;
		},
	},
];
const StudentTab = () => {
	return <DataGrid rows={dummyData} columns={columns}></DataGrid>;
};

export default StudentTab;

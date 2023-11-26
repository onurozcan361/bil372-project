import { Button } from "@mui/material";
import dummyDers from "../dummyDers.json";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import axios from "axios";

const columns: GridColDef[] = [
	{ field: "id", headerName: "DersKodu", width: 200 },
	{ field: "dersAdi", headerName: "Ders Adi", width: 200 },
	{ field: "dersSaati", headerName: "Haftalik Ders Saati", width: 200 },
	{ field: "dersTalebi", headerName: "Ders Talebi", width: 200 },

	{
		field: "actions",
		headerName: "İşlemler",
		width: 120,
		renderCell: (params) => {
			const handleClick = () => {
				const rowId = params.row.id;

				axios
					.get<any>(`https://your-backend-api.com/data/${rowId}`)
					.then((response) => {
						console.log("Backend yaniti:", response.data);
						// İşlemleri burada devam ettirebilirsiniz
					})
					.catch((error) => {
						console.error("Hata:", error);
					});
			};

			return <Button onClick={handleClick}>Detayli Bilgi</Button>;
		},
	},
];

const CourseTab = () => {
	return <DataGrid rows={dummyDers} columns={columns}></DataGrid>;
};

export default CourseTab;
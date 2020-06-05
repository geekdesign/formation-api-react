import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import moment from "moment";
import invoicesAPI from "../services/invoicesAPI ";

const STATUS_CLASSES = {
	PAID: "success",
	SENT: "info",
	CANCELED: "danger",
};

const STATUS_LABELS = {
	PAID: "Payée",
	SENT: "Envoyée",
	CANCELED: "Annulée",
};

const InvoicesPage = (props) => {
	const [invoices, setInvoices] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [search, setSearch] = useState("");

	//Récupération des invoice auprès de l'API
	const fetchInvoices = async () => {
		try {
			const data = await invoicesAPI.findAll();
			setInvoices(data);
		} catch (error) {
			console.log(error.response);
		}
	};

	useEffect(() => {
		fetchInvoices();
	}, []);

	//Gestion du format de date
	const formatDate = (str) => moment(str).format("DD.MM.YYYY");

	// Permet de supprimer un customers
	const handleDelete = async (id) => {
		const originalInvoices = [...invoices];

		setInvoices(invoices.filter((invoice) => invoice.id !== id));

		try {
			await invoicesAPI.delete(id);
			toast.success("La facture a bien été supprimée");
		} catch (error) {
			toast.error("Une erreur est survenue");
			setInvoices(originalInvoices);
		}
	};

	// Items par page
	const itemsPerPage = 7;

	// Permet de redéfinir le setCurrentpage lors du changement de page
	const handleChangePage = (page) => setCurrentPage(page);

	// Permet de setter la value de search
	const handleSearch = ({ currentTarget }) => {
		setSearch(currentTarget.value);
		setCurrentPage(1);
	};

	// Fonction de filtrage
	const filteredInvoices = invoices.filter(
		(i) =>
			i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
			i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
			i.amount.toString().startsWith(search.toLowerCase()) ||
			STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
	);

	// Définit la pagination en fonction du filtre
	const paginatedInvoices = Pagination.getData(
		filteredInvoices,
		currentPage,
		itemsPerPage
	);

	return (
		<>
			<h1>Liste des factures</h1>
			<div className="form-group">
				<input
					type="text"
					onChange={handleSearch}
					value={search}
					className="form-control"
					placeholder="Rechercher ..."
				/>
			</div>
			<table className="table table-hover">
				<thead>
					<tr>
						<th>Numéro</th>
						<th>Client</th>
						<th className="text-center">Date d'envoi</th>
						<th className="text-center">Statut</th>
						<th className="text-center">Montant</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{paginatedInvoices.map((invoice) => (
						<tr key={invoice.id}>
							<td>{invoice.id}</td>
							<td>
								<a href="#">
									{invoice.customer.firstName} {invoice.customer.lastName}
								</a>
							</td>
							<td className="text-center">{formatDate(invoice.sentAt)}</td>
							<td className="text-center">
								<span
									className={"badge badge-" + STATUS_CLASSES[invoice.status]}
								>
									{STATUS_LABELS[invoice.status]}
								</span>
							</td>
							<td className="text-center">
								{invoice.amount.toLocaleString()} CHF
							</td>
							<td>
								<button className="btn btn-sm btn-primary mr-3">Editer</button>
								<button
									className="btn btn-sm btn-danger"
									onClick={() => handleDelete(invoice.id)}
								>
									X Supprimer
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			{itemsPerPage < filteredInvoices.length && (
				<Pagination
					currentPage={currentPage}
					itemsPerPage={itemsPerPage}
					length={invoices.length}
					onPageChanged={handleChangePage}
				/>
			)}
		</>
	);
};

export default InvoicesPage;

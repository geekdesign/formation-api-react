import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import moment from "moment";
import InvoicesAPI from "../services/invoicesAPI ";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";

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
	const [loading, setLoading] = useState(true);

	//Récupération des invoice auprès de l'API
	const fetchInvoices = async () => {
		try {
			const data = await InvoicesAPI.findAll();
			setInvoices(data);
			setLoading(false);
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
			await InvoicesAPI.delete(id);
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
			<div className="d-flex justify-content-between align-items-center mb-4">
				<h1>Liste des factures</h1>
				<Link to="/invoices/new" className="btn btn-primary mr-5">
					Créer une facture
				</Link>
			</div>
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
				{!loading && (
					<tbody>
						{paginatedInvoices.map((invoice) => (
							<tr key={invoice.id}>
								<td>{invoice.id}</td>
								<td>
									<Link to={"/customers/" + invoice.customer.id}>
										{invoice.customer.firstName} {invoice.customer.lastName}
									</Link>
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
									<Link
										to={"/invoices/" + invoice.id}
										className="btn btn-sm btn-primary mr-3"
									>
										Editer
									</Link>
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
				)}
			</table>

			{loading && <TableLoader />}
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

import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import CustomersApi from "../services/customersAPI";

const CustomersPage = (props) => {
	const [customers, setCustomers] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [search, setSearch] = useState("");

	//Permet d'aller récupérer les customers
	const fetchCustomer = async () => {
		try {
			const data = await CustomersAPI.findAll();
			setCustomers(data);
		} catch (error) {
			console.log(error.response);
		}
	};

	// Au chargement du composant on va chercher les customers
	useEffect(() => {
		fetchCustomer();
	}, []);

	// Permet de supprimer un customers
	const handleDelete = async (id) => {
		const originalCustomers = [...customers];
		setCustomers(customers.filter((customer) => customer.id !== id));
		try {
			await CustomersApi.delete(id);
		} catch (error) {
			setCustomers(originalCustomers);
			console.log(error.response);
		}
	};

	// Permet de redéfinir le setCurrentpage lors du changement de page
	const handelChangePage = (page) => setCurrentPage(page);

	// Permet de setter la value de search
	const handelSearch = ({ currentTarget }) => {
		setSearch(currentTarget.value);
		setCurrentPage(1);
	};

	// Items par page
	const itemsPerPage = 7;

	// Fonction de filtrage
	const filteredCustomers = customers.filter(
		(c) =>
			c.firstName.toLowerCase().includes(search.toLowerCase()) ||
			c.lastName.toLowerCase().includes(search.toLowerCase()) ||
			c.email.toLowerCase().includes(search.toLowerCase()) ||
			(c.company && c.company.toLowerCase().includes(search.toLowerCase()))
	);

	// Définit la pagination en fonction du filtre
	const paginatedCustomers = Pagination.getData(
		filteredCustomers,
		currentPage,
		itemsPerPage
	);

	return (
		<>
			<h1>Liste des clients</h1>

			<div className="form-group">
				<input
					type="text"
					onChange={handelSearch}
					value={search}
					className="form-control"
					placeholder="Rechercher ..."
				/>
			</div>

			<table className="table table-hover">
				<thead>
					<tr>
						<th className="text-center">Id</th>
						<th>Client</th>
						<th>Email</th>
						<th>Entreprise</th>
						<th className="text-center">Factures</th>
						<th className="text-center">Montant total</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{paginatedCustomers.map((customer) => (
						<tr key={customer.id}>
							<td className="text-center">{customer.id}</td>
							<td>
								<a href="#">
									{customer.firstName} {customer.lastName}
								</a>
							</td>
							<td>{customer.email}</td>
							<td>{customer.compagny}</td>
							<td className="text-center">
								<span className="badge badge-primary">
									{customer.invoices.length}
								</span>
							</td>
							<td className="text-center">
								{customer.totalAmount.toLocaleString()} CHF
							</td>
							<td>
								<buton
									onClick={() => handleDelete(customer.id)}
									disabled={customer.invoices.length > 0}
									className="btn btn-sm btn-danger"
								>
									X Supprimer
								</buton>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			{itemsPerPage < filteredCustomers.length && (
				<Pagination
					currentPage={currentPage}
					itemsPerPage={itemsPerPage}
					length={filteredCustomers.length}
					onPageChange={handelChangePage}
				/>
			)}
		</>
	);
};

export default CustomersPage;

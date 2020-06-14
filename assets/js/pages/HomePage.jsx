import React from "react";

const HomePage = (props) => {
	return (
		<div className="jumbotron">
			<h1 className="display-4">Bienvenue sur SYMREACT</h1>
			<p className="lead">
				Une application de suivi de factures. Tu peux y créer des clients et leurs assigner des factures, trop cool non?
				De plus tu peux voir le montant total de facture encore ouvertes pour un client. <br></br> Ce site fonctionne avec Symfony 5 - ApiPlatform et React
			</p>
			<hr className="my-4" />
			<p>
				Le contenu de ce site a été réalisé en suivant la superbe formation de Lior Chamla "Développement moderne avec Symfony 4, ApiPlatform et React !"
			</p>
			<p className="lead">
				<a className="btn btn-primary btn-lg" href="https://learn.web-develop.me/" target="_blank" role="button">
					Voir toutes les formations de Lior Chamla
				</a>
			</p>
		</div>
	);
};

export default HomePage;

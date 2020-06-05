import React, { useState } from "react";
import ReactDOM from "react-dom";
import { HashRouter, Switch, Route, withRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import CustomersPage from "./pages/CustomersPage";
import InvoicesPage from "./pages/InvoicesPage";
import LoginPage from "./pages/loginPage";
import AuthAPI from "./services/authAPI";
import AuthContext from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

import "../css/app.css";

AuthAPI.setup();

console.log("Hello Webpack Encore! Edit me in assets/js/app.js");

const App = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(
		AuthAPI.isAuthenticated()
	);

	const NavbarWithRouter = withRouter(Navbar);

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				setIsAuthenticated,
			}}
		>
			<HashRouter>
				<NavbarWithRouter />

				<main className="container-fluid pt-5">
					<Switch>
						<Route path="/login" component={LoginPage} />
						<PrivateRoute path="/invoices" component={InvoicesPage} />
						<PrivateRoute path="/customers" component={CustomersPage} />
						<Route path="/" component={HomePage} />
					</Switch>
				</main>
			</HashRouter>
		</AuthContext.Provider>
	);
};

const rootElement = document.querySelector("#app");
ReactDOM.render(<App />, rootElement);

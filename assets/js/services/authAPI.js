import axios from "axios";
import jwtDecode from "jwt-decode";

/**
 * Positionne le token JWT sur AXIOS
 * @param {string} token Le Token JWT
 */
function setAxiosToken(token) {
	axios.defaults.headers["Authorization"] = "Bearer " + token;
}

/**
 * Déconnexion (suppression du token du localstorage et sur Axios)
 */
function logout() {
	window.localStorage.removeItem("authToken");
	delete axios.defaults.headers["Authorization"];
}

/**
 * REquète HTTP d'authentififaction et stockage du token dans le storage et sur AXIOS
 * @param {obect} credentials
 */
function authenticate(credentials) {
	return axios
		.post("http://127.0.0.1:8000/api/login_check", credentials)
		.then((response) => response.data.token)
		.then((token) => {
			// Je stocke le token dans mon localStorage
			window.localStorage.setItem("authToken", token);
			// On prévient Axios qu'on a maintenant un header par défaut sur toutes nos futures requetes HTTP
			setAxiosToken(token);
		});
}

/**
 * Mise en place lors du chargement de l'applicaiton
 */
function setup() {
	//1 voir si on a un token
	const token = window.localStorage.getItem("authToken");
	//2 voir si le token est valide

	if (token) {
		const { exp: expiration } = jwtDecode(token);
		if (expiration * 1000 > new Date().getTime()) {
			setAxiosToken(token);
		}
	}
}

/**
 * Permets de savoir si on est authentifier ou password
 * @return boolean
 */
function isAuthenticated() {
	const token = window.localStorage.getItem("authToken");

	if (token) {
		const { exp: expiration } = jwtDecode(token);
		if (expiration * 1000 > new Date().getTime()) {
			return true;
		}
		return false;
	}
	return false;
}

export default {
	setup,
	authenticate,
	logout,
	isAuthenticated,
};

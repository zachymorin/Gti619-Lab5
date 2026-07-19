export const metadata = {
	title: "Laboratoire 5 - GTI619",
	description: "Application de gestion des accès",
};

export default function RootLayout({ children }) {
	return (
		<html lang="fr">
			<body>{children}</body>
		</html>
	);
}

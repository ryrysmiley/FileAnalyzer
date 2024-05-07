import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "File Analyzer",
	description: "Get File Data",
};

export default function RootLayout({ children }) {
	return (
		<html suppressHydrationWarning lang="en">
			<body suppressHydrationWarning>{children}</body>
		</html>
	);
}

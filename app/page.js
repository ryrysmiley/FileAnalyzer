"use client";
import styles from "./page.module.css";
import { useState } from "react";
import { filesigs } from "@/util/filesigs";

export default function Home() {
	const [fileData, setFileData] = useState(null);
	const [fileHex, setFileHex] = useState(null);
	const [possibleExt, setPossibleExt] = useState(null);
	const [fileError, setFileError] = useState(false);

	function identifySignatures(hexString) {
		var tempList = [];
		for (var filesig of filesigs) {
			if (hexString.startsWith(filesig["Header (hex)"])) {
				tempList.push(filesig);
			}
		}

		if (tempList.length === 0) {
			setPossibleExt(null);
		} else {
			const maxLength = Math.max(
				...tempList.map((item) => item["Header (hex)"].length)
			);

			// Filter the strings to keep only the ones with the longest length
			const newList = tempList.filter(
				(item) => item["Header (hex)"].length === maxLength
			);
			console.log(newList);
			setPossibleExt(newList);
		}
	}

	function handleFileChange(e) {
		const file = e.target.files[0];
		setFileData(null);
		setFileHex(null);
		setPossibleExt(null);
		setFileError(false);
		if (file) {
			const tempObj = {};
			console.log(file);
			for (const key in file) {
				if (file[key].toString().endsWith("}") || key === "lastModified") {
					continue;
				}
				tempObj[key] = file[key].toString();
			}
			setFileData(tempObj);
			if (file.size > 25 * 1024 * 1024) {
				console.log("File size exceeds the maximum limit.");
				setFileError(true);
				alert("File size exceeds the maximum limit.");
				return;
			}
			try {
				const reader = new FileReader();
				reader.onload = () => {
					const arrayBuffer = reader.result;
					const uint8Array = new Uint8Array(arrayBuffer);
					let hexString = "";

					for (let i = 0; i < uint8Array.length; ++i) {
						const byteHex = uint8Array[i].toString(16).padStart(2, "0");
						hexString += byteHex;
						hexString += " "; // Insert a space after every two characters
					}
					setFileHex(hexString.toUpperCase());
					identifySignatures(hexString.toUpperCase());
				};
				reader.readAsArrayBuffer(file);
			} catch (error) {
				console.log("Error:", error);
			}
		} else {
			console.log("Error with file reader.");
		}
	}

	return (
		<div suppressHydrationWarning>
			<div className={styles.TitleHeader}>
				<h2>File Analyzer</h2>
				{!fileData && (
					<p>
						Select or drag and drop a file to analyze its details. (25MB
						Maximum)
					</p>
				)}
				{fileData && <p>You can change the selected file at anytime.</p>}
				<input type="file" onChange={handleFileChange} />
			</div>
			{(fileData || possibleExt) && (
				<div className={styles.SegContainer}>
					<div className={styles.FDSegment}>
						{fileData && (
							<div>
								<h3>File Metadata</h3>
								<table>
									<tbody>
										{Object.entries(fileData).map(([key, value]) => (
											<tr key={key}>
												<td>{key}</td>
												<td>{value}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
						{possibleExt && (
							<div>
								<h3>Possible File Extension Matches</h3>
								<table>
									<thead>
										<tr>
											<td>File Class</td>
											<td>File Extension</td>
											<td>File Description</td>
										</tr>
									</thead>
									<tbody>
										{possibleExt.map((fileitem, index) => (
											<tr key={index}>
												<td>{fileitem.FileClass}</td>
												<td>{fileitem["File extension"]}</td>
												<td>{fileitem["File description"]}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
						{!possibleExt && fileHex && (
							<div>
								<h3>Possible File Extension Matches</h3>
								<p>
									Unable to match Hexadecimal conversion with database. You can
									reference this{" "}
									<a href="https://en.wikipedia.org/wiki/List_of_file_signatures">
										Article
									</a>{" "}
									to check the file signatures.
								</p>
							</div>
						)}
					</div>
				</div>
			)}
			{(fileHex || fileData) && (
				<div className={styles.SegContainer}>
					<div className={styles.HDSegment}>
						<h3>File Hexadecimal Conversion</h3>
						{!fileHex && !fileError && (
							<p>Converting file to Hexadecimal... Please wait.</p>
						)}
						{fileHex && <p className={styles.InnerHDSegment}>{fileHex}</p>}
					</div>
				</div>
			)}
		</div>
	);
}

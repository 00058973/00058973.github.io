document.getElementById("parse-button").addEventListener("click", () => {
	const input = document.getElementById("input").value;
	const output = parseEnvironment(input);
	document.getElementById("output").textContent = output;
});
  
document.getElementById("copy-button").addEventListener("click", () => {
	const outputElement = document.getElementById("output");
	const textToCopy = outputElement.textContent;

	if (textToCopy) {
		navigator.clipboard.writeText(textToCopy).then(() => {
		alert("Parsed output copied to clipboard!");
		}).catch(err => {
		console.error("Error copying text: ", err);
		});
	} else {
		alert("Nothing to copy! Please parse some input first.");
	}
});

function parseEnvironment(input) {
	const lines = input.split("\n");
	const result = [];

	let currentName = null;
	for (let line of lines) {
		line = line.trim();

		if (line.startsWith("- name:")) {
		currentName = line.split(":")[1].trim();
		currentName = currentName.replace(/['"]/g, "");
		} else if (line.startsWith("value:") || line.startsWith("valueFrom:")) {
			if (line.startsWith("value:")) {
				const value = line.slice(line.indexOf(":") + 1).trim().replace(/['"]/g, "");
				result.push(`${currentName}=${value}`);
				currentName = null;
			} else {
				result.push(`${currentName}=`);
				currentName = null;
			}
		}
	}

	return result.join(";");
}

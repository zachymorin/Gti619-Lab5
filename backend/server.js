import { app } from "./app.js";
import "./src/db/db.js";

const port = 8080;

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

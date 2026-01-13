import { loadResultsFromStorage } from "./utils.js";
import { displayResultsDOM } from "./DOM.js";

const results = loadResultsFromStorage();
displayResultsDOM(results);

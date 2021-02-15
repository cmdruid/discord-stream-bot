/** store.js
 * Configures local database storage.
 * */

import { LocalStorage } from "node-localstorage";

const store = new LocalStorage("../data");

try {
  store.setItem("test", "success");
  if (store.getItem("test") !== "success") {
    throw Error("Datastore failed to load!");
  }
  console.log("Datastore loaded!");
} catch (e) {
  console.error(e);
}

export default store;

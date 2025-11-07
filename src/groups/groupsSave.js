import { auth, db } from "/src/firebaseConfig.js";
import { collection, addDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

document
	.getElementById("groupForm")
	.addEventListener("submit", function (event) {
		event.preventDefault();

		onAuthStateChanged(auth, async (user) => {
			if (user) {
				const newGroup = {
					name: document.getElementById("name").value,
					course: document.getElementById("class").value,
					description: document.getElementById("description").value,
					uid: user.uid
				};

				try {
					const group = collection(db, "groups");
					await addDoc(group, newGroup);
					window.location.href = "groups.html";
				} catch (error) {
					console.log(error);
				}
			}
		});
	});

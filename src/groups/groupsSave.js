import { auth, db } from "/src/firebaseConfig.js";
import { collection, addDoc, serverTimestamp, setDoc, doc } from "firebase/firestore";
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
					const groupID = await addDoc(group, newGroup);
					await setDoc(doc(db, `users/${user.uid}/groups`, groupID.id), {
						groupId: groupID.id,
						joinedAt: serverTimestamp()
					});
					window.location.href = "groups.html";
				} catch (error) {
					console.log(error);
				}
			}
		});
	});

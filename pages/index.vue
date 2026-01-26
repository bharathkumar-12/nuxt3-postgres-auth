<template>
	<div class="m-12 relative">
		<h1 class="w-full bg-orange-50 p-4">Users</h1>
		<!-- Users Table -->
		<table class="table" v-if="!showForm">
			<thead>
				<tr>
					<th>ID</th>
					<th>Name</th>
					<th>Email</th>
					<th>Created At</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="user in users" :key="user.email">
					<td class="truncate max-w-[100px]">{{ user.id }}</td>
					<td>{{ user.name }}</td>
					<td>{{ user.email }}</td>
					<td>{{ user.created_at }}</td>
					<td class="grid grid-cols-2 gap-4">
						<button class="text-blue-800 font-semibold border-blue-800 border-[0.5px]" @click="editUserDetail(user)">Edit</button>
						<button class="text-red-800 font-semibold border-red-800 border-[0.5px]" @click="removeUser(user.id)">Delete</button>
					</td>
				</tr>
			</tbody>
		</table>
    <UserForm v-else
			:user="selectedUser"
			@submit="createNewUser"
			@update="updateUserDetails"
			:isEditing="isEditing"
		/>
		<div class="my-4 grid justify-items-end">
			<button v-if="!showForm"
				class="border-1 border p-4 rounded-20 bg-gray-800 text-white cursor-pointer"
				@click="showCreateUserForm()"
			>
				Create New
			</button>
      <button v-else
				class="border-1 border p-4 rounded-20 bg-gray-800 text-white cursor-pointer"
				@click="showForm= false"
			>
				Cancel
			</button>
		</div>

		
	</div>
</template>

<script setup>

import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores/user";
import { v4 as uuidv4 } from "uuid";

// Use the Pinia store
const store = useUserStore();
import { storeToRefs } from "pinia";
const { users, loading, error } = storeToRefs(store);

// Access actions directly from the store
const { fetchUsers, addUser, updateUser, deleteUser } = store;
const showForm = ref(false)
const isEditing = ref(false);
const selectedUser = ref({
	name: "",
	email: "",
	password: "",
});

// Fetch users on component mount
onMounted(() => {
	fetchUsers();
});

function showCreateUserForm() {
  isEditing.value = false;
  showForm.value = true
	selectedUser.value = {
		name: "",
		email: "",
		password: "",
	};
	
}

// Create a new user
async function createNewUser(payload) {
	const userId = uuidv4();
	payload.id = userId;
	console.log("create USER payload", payload);
	await addUser(payload);
  showForm.value = false
  
}

// Set user data for editing
function editUserDetail(user) {
  showForm.value = true
	isEditing.value = true
	selectedUser.value = {
		...user,
	};
  
}

// Update the user
async function updateUserDetails(value) {
	const { id, name, email, password } = value;
	await updateUser(id, { name, email, password: password || undefined });
	isEditing.value = true
  showForm.value = false
  
}

// Delete a user
function removeUser(userId) {
	deleteUser(userId);
  
}
</script>

<style scoped>
h1 {
	color: #333;
}

table {
	width: 100%;
	border-collapse: collapse;
	margin-top: 20px;
}

th,
td {
	border: 1px solid #ccc;
	padding: 8px;
	text-align: left;
}

th {
	background-color: #f4f4f4;
}

button {
	margin-right: 5px;
	padding: 5px 10px;
	cursor: pointer;
}

form {
	margin-top: 20px;
	display: flex;
	flex-direction: column;
}

input {
	margin-bottom: 10px;
	padding: 8px;
}

.edit-form {
	margin-top: 20px;
	border: 1px solid #ccc;
	padding: 20px;
}
</style>

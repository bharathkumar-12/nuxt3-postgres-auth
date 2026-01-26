import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useNuxtApp } from "#app";
export const useUserStore = defineStore("user", () => {
	// State
	const users = ref([]);
	const loading = ref(false);
	const error = ref(null);
	const { $toast } = useNuxtApp();

	// Get all users from the API
	async function fetchUsers() {
		loading.value = true;
		error.value = null;
		console.log("Fetching users...");
		
		try {
			const data = await $fetch("/api/users");
			console.log('data received fetchUsers', data)
			// Update users state
			users.value = data.users || [];
			console.log("Fetched users:", users.value);
			
			$toast.success("Fetched All users", {
				autoClose: 2000,
			});
		} catch (err) {
			error.value = err?.response?._data?.error;
			$toast.error(error.value, { autoClose: 3000 });
			
		} finally {
			loading.value = false;
		}
	}

	// Get a single user by ID from the API
	async function fetchUserById(userId) {
		loading.value = true;
		error.value = null;

		try {
			const data = await $fetch(`/api/users?id=${userId}`);
			
		} catch (err) {
			error.value = err?.response?._data?.error;
			$toast.error(error.value, { autoClose: 3000 });
		} finally {
			loading.value = false;
		}
	}

	// Add a new user to the database via the API
	async function addUser(newUser) {
		loading.value = true;
		error.value = null;

		try {
			const data = await $fetch("/api/users", {
				method: "POST",
				body: newUser,
			});

			if (data?.user) {
				users.value.push(data.user);
				$toast.success("New User Added", {
					autoClose: 2000,
				});
			}
			
		} catch (err) {
			error.value = err?.response?._data?.error;
			$toast.error(error.value, { autoClose: 3000 });
		} finally {
			loading.value = false;
		}

	}

	// Update a user in the database via the API
	async function updateUser(userId, updatedUser) {
		loading.value = true;
		error.value = null;

		try {
			const data = await $fetch(`/api/users?id=${userId}`, {
				method: "PUT",
				body: updatedUser,
			});

			if (data?.user) {
				const index = users.value.findIndex((user) => user.id === userId);
				if (index !== -1) {
					users.value[index] = data.user;
					$toast.success("user Details Updated", {
						autoClose: 2000,
					});
				}
			}
		} catch (err) {
			error.value = err?.response?._data?.error;
			$toast.error(error.value, { autoClose: 3000 });
		} finally {
			loading.value = false;
		}
	}

	// Delete a user from the database via the API
	async function deleteUser(userId) {
		loading.value = true;
		error.value = null;

		try {
			await $fetch(`/api/users?id=${userId}`, {
				method: "DELETE",
			});

			users.value = users.value.filter((user) => user.id !== userId);
			
			$toast.warn("Deleted Selected user", {
				autoClose: 1000,
			});
		} catch (err) {
			error.value = err?.response?._data?.error;
			$toast.error(error.value, { autoClose: 3000 });
		} finally {
			loading.value = false;
		}
	}

	// Computed property to get the total number of users
	const userCount = computed(() => users.value.length);

	return {
		users,
		loading,
		error,
		fetchUsers,
		fetchUserById,
		addUser,
		updateUser,
		deleteUser,
		userCount,
	};
});

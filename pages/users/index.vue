<template>
  <title>User List</title>
  <div>
    <h1 class="middleTitle">User List</h1>
    <div class="buttonContainer">
      <el-button
        v-if="accountRole != 1"
        type="success"
        class="newButton"
        round
        @click="addDialogVisible = true"
        >New</el-button
      >
    </div>
    <div class="container">
      <div class="search-bar">
        <el-form :model="search" label-width="auto" style="width: 50%">
          <el-input v-model="search.userName" placeholder="Name" />
        </el-form>
        <button><i class="bx bx-search-alt-2 bx-fw"></i></button>
        <el-select
          v-model="search.userRole"
          placeholder="Role"
          style="width: 15%"
        >
          <el-option label="Staff" value="staff" />
          <el-option label="User" value="user" />
        </el-select>
        <el-select
          v-model="search.faculty"
          placeholder="Faculty"
          style="width: 30%"
        >
          <el-option
            v-for="faculty in faculties"
            :key="faculty.id"
            :label="faculty.name"
            :value="faculty.id"
          />
        </el-select>
      </div>
      <el-divider></el-divider>
      <el-table :data="usersData" stripe>
        <el-table-column prop="name" label="Name" />
        <el-table-column prop="role" label="Role" />
        <el-table-column prop="faculty" label="Faculty" />
        <el-table-column label="Actions" v-if="accountRole != 1">
          <template #default="{ row }">
            <NuxtLink :to="`/users/${row.id}`">
              <el-button text>
                <i class="bx bx-info-circle"></i>
              </el-button>
            </NuxtLink>
          </template>
        </el-table-column>
      </el-table>
      <div class="pageNavigation">
        <button @click="prevPage" :disabled="currentPage === 1">
          Previous
        </button>
        <span>{{ currentPage }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">
          Next
        </button>
      </div>
    </div>
    <el-dialog v-model="addDialogVisible" title="User Registration" center>
      <el-form :model="register" label-width="auto">
        <hr />
        <div>
          <el-form-item label="Email Address">
            <el-input v-model="register.email" />
          </el-form-item>
          <el-form-item label="Password">
            <el-input v-model="register.password" type="password" />
          </el-form-item>
          <el-form-item label="Full Name">
            <el-input v-model="register.name" />
          </el-form-item>
          <el-form-item label="Role">
            <el-select
              v-model="register.role"
              placeholder="Select account role"
            >
              <el-option label="Staff" value="2" />
              <el-option label="User" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="Faculty">
            <el-select v-model="register.faculty" placeholder="Faculty">
              <el-option
                v-for="faculty in faculties"
                :key="faculty.id"
                :label="faculty.name"
                :value="faculty.id"
              />
            </el-select>
          </el-form-item>
        </div>
        <hr />
        <div
          class="dialog-footer"
          style="display: flex; justify-content: flex-end"
        >
          <el-button
            @click="addDialogVisible = false"
            style="margin-right: 8px"
          >
            Cancel
          </el-button>
          <el-button type="primary" @click="registerUser">Submit</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<style scoped>
@import url("../../assets/css/browse.css");
@import url("../../node_modules/boxicons/css/boxicons.min.css");
@import url("../../assets/css/pager.css");
</style>

<script setup>
const client = useSupabaseClient();
const accountRole = ref(null);
const faculties = ref([]);
const search = reactive({
  name: "",
  userRole: "",
  faculty: "",
});
const addDialogVisible = ref(false);
const register = reactive({
  email: "",
  password: "",
  name: "",
  role: "",
  faculty: "",
});
const usersData = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const totalItems = ref(0);
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));

async function fetchUsers(page) {
  try {
    const from = (page - 1) * pageSize.value;
    const to = page * pageSize.value - 1;

    let query = client
      .from("profile")
      .select("id,name, accountRole, faculty:faculty_id(name)", {
        count: "exact",
      })
      .range(from, to);

    if (search.userName) {
      query = query.ilike("name", `%${search.userName}%`);
    }

    if (search.userRole === "user") {
      query = query.eq("accountRole", "1");
    } else if (search.userRole === "staff") {
      query = query.in("accountRole", ["2", "3"]);
    }

    if (search.faculty) {
      query = query.eq("faculty_id", search.faculty);
    }

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    usersData.value = data.map((user) => ({
      id: user.id,
      name: user.name,
      role: user.accountRole == 1 ? "User" : "Staff",
      faculty: user.faculty.name,
    }));
    totalItems.value = count;
  } catch (error) {
    console.error("Error fetching users:", error.message);
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchUsers(currentPage.value);
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchUsers(currentPage.value);
  }
}

async function registerUser() {
  try {
    const { data, error } = await client.auth.signUp({
      email: register.email,
      password: register.password,
      options: {
        data: {
          name: register.name,
          faculty_id: register.faculty,
          accountRole: register.role,
        },
      },
    });
    if (error) {
      throw error;
    } else {
      console.log("User registered successfully:", data);
      addDialogVisible.value = false;
      // Optionally, you might want to fetch users to update the list
    }
  } catch (error) {
    console.error("Error signing up:", error.message);
  }
}

async function fetchUserProfile() {
  try {
    const {
      data: { user },
      error,
    } = await client.auth.getUser();
    if (error) {
      throw error;
    }
    if (user) {
      const { data, error } = await client
        .from("profile")
        .select("accountRole")
        .eq("id", user.id)
        .single();
      if (error) {
        throw error;
      }
      accountRole.value = data.accountRole;
      return data.accountRole;
    }
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
  }
}

async function fetchFaculties() {
  console.log("Fetching faculties...");
  const { data, error } = await client.from("faculty").select("id, name");
  if (error) {
    console.error("Error fetching faculties:", error.message);
  } else {
    faculties.value = data;
    console.log("Faculties fetched:", faculties.value);
  }
}

watchEffect(() => {
  fetchUsers(currentPage.value);
});

onMounted(() => {
  fetchUserProfile();
  fetchFaculties();
  fetchUsers(currentPage.value);
});

definePageMeta({
  layout: "navbar",
});
</script>

<template>
  <p>Redirecting...</p>
</template>

<script setup>
const user = useSupabaseUser();

watch(
  user,
  async () => {
    if (user.value) {
      await navigateTo("/courses");
      window.location.reload();
    } else {
      await navigateTo("/login");
    }
  },
  { immediate: true }
);
</script>

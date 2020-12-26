<template>
  <!-- 面包屑导航 -->
  <div class="tweb">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-if="lanmu">{{ lanmu }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ page_name }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  props: ["page_name", "lanmu"],
  data() {
    return {};
  },
};
</script>

<style scoped>
.tweb {
  padding: 10px;
}
</style>

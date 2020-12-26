<template>
  <div id="app">
    <!-- 头部导航栏 -->
    <div id="top-menu" class="tweb">
      <div v-if="authUserLogin" class="tweb nick-name">
        <i class="el-icon-user"></i>：{{ getNickname }}
      </div>
    </div>
    <!-- 侧边栏 -->
    <div id="left-menu" :class="'tweb ' + mobile_left">
      <i @click="showHideLeftMenu" id="left-btn" class="el-icon-menu"></i>
      <!-- 导航栏 -->
      <el-col :span="24" style="margin-top: 60px">
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#00000000"
          text-color="#fff"
          active-text-color="#ffd04b"
          router
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-folder-opened"></i>
              <span>文章管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/add-article">发布文章</el-menu-item>
              <el-menu-item index="/article-list">文章列表</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item index="/user-perm">
            <i class="el-icon-notebook-1"></i>
            <span slot="title">用户管理</span>
          </el-menu-item>
          <el-menu-item index="3">
            <i class="el-icon-money"></i>
            <span slot="title">打赏记录</span>
          </el-menu-item>
          <el-menu-item index="/lanmu-admin">
            <i class="el-icon-s-operation"></i>
            <span slot="title">栏目管理</span>
          </el-menu-item>
          <el-menu-item v-if="authUserLogin" @click="blogLogout()">
            <i class="el-icon-back"></i>
            <span slot="title">退出登录</span>
          </el-menu-item>
        </el-menu>
      </el-col>
    </div>
    <!-- 页面内容 -->
    <div id="content" :class="mobile_content">
      <router-view :screenWidth="screenWidth"></router-view>
      <!-- 页面底部 -->
      <div id="footer" class="tweb">
        <span>Copyright © 2020 Tweb工作室</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      screenWidth: document.body.clientWidth,
      mobile_left: "",
      mobile_content: "",
    };
  },
  created() {
    this.$store.dispatch("tryAutoLogin");
  },
  mounted() {
    this.changeDevice();
  },
  watch: {
    authUserLogin(newVal) {
      if (newVal == null) {
        this.$router.push({ path: "/login" });
      }
    },
  },
  computed: {
    // 用户登录
    authUserLogin() {
      return this.$store.getters.isnotUserLogin;
    },
    getNickname() {
      return this.$store.getters.currentUser;
    },
  },
  methods: {
    // 判断页面类型
    changeDevice() {
      if (this.screenWidth < 768) {
        this.mobile_left = "hide";
        this.mobile_content = "full";
      }
    },
    // 调整页面布局
    showHideLeftMenu() {
      if (this.mobile_left == "") {
        this.mobile_left = "hide";
      } else {
        this.mobile_left = "";
      }
      // 宽屏情况
      switch (this.screenWidth >= 768) {
        case this.mobile_content == "":
          this.mobile_content = "full";
          break;

        default:
          this.mobile_content = "";
          break;
      }
    },
    // 退出登录
    blogLogout() {
      this.$store.dispatch("blogLogout", this.$store.getters.isnotUserLogin);
    },
  },
};
</script>

<style>
.el-col {
  margin-top: 5px;
}

.nick-name {
  font-size: 18px;
  color: #fff;
  font-weight: 500;
  display: flex;
  height: 60px;
  justify-content: right;
  align-items: center;
  padding-right: 15px;
}
</style>

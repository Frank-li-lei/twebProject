<template>
  <div id="article-list">
    <!-- 面包屑导航 -->
    <div class="tweb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>文章列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 文章列表 -->
    <div class="tweb" style="margin-top: 10px">
      <el-row>
        <el-col v-for="item in article_list" :key="item.id" :span="24">
          <div class="card tweb">
            <el-row>
              <el-col :xs="24" :lg="6">
                <el-image
                  v-if="screenWidth >= 768"
                  style="height: 80px"
                  :src="item.cover"
                  :fit="'cover'"
                ></el-image>
                <el-image
                  v-else
                  style="width: 100%"
                  :src="item.cover"
                  :fit="'cover'"
                ></el-image>
              </el-col>
              <el-col class="text-item" :xs="24" :lg="4">
                <span>{{ item.title }}</span>
              </el-col>
              <el-col class="text-item" :xs="12" :lg="7">
                <span> 发布者：{{ item.nickName }} </span>
              </el-col>
              <el-col class="text-item" :xs="12" :lg="7">
                <el-button
                  @click="toArticle(item.id)"
                  type="success"
                  icon="el-icon-search"
                  circle
                ></el-button>
                <el-button
                  @click="deleteArticle(item.id)"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                ></el-button>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 分页器 -->
    <div class="tweb" style="margin-top: 10px">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :pager-count="pagerCount"
        @current-change="currentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Qs from "qs";
export default {
  props: ["screenWidth"],
  data() {
    return {
      total: 40,
      pageSize: 4,
      currentPage: 1,
      pagerCount: 5,
      article_list: [],
    };
  },
  mounted() {
    this.getListData(this.currentPage);
  },
  methods: {
    // 获取文章列表
    getListData(page) {
      axios({
        method: "get",
        url: "http://127.0.0.1:9000/api/article-list/",
        params: {
          page,
          pageSize: this.pageSize,
          lanmu: "all",
        },
      })
        .then((res) => {
          // console.log(res.data);
          this.article_list = res.data.data;
          this.total = res.data.total;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    // 跳转内容页
    toArticle(id) {
      this.$router.push({ path: "/article", query: { id: id } });
    },
    // 删除文章
    deleteArticle(id) {
      if (confirm("是否确定删除")) {
        let checkInfo = {
          contentType: "blog_article",
          permissions: ["delete"],
        };
        this.$store.dispatch("checkUserPerm", checkInfo).then((res) => {
          if (res) {
            axios({
              method: "delete",
              url: "http://127.0.0.1:9000/api/delete-article/",
              data: Qs.stringify({
                id,
                token: this.$store.getters.isnotUserLogin,
              }),
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }).then((res) => {
              // console.log(res);
              if (res.data == "nologin") {
                alert("用户登录过期");
                return;
              }
              if (res.data == "noperm") {
                alert("权限不足");
              }
              this.getListData(this.currentPage);
            });
          }
        });
      }
    },
    // 分页器
    currentChange(val) {
      // console.log("第" + val + "页");
      this.currentPage = val;
      this.getListData(val);
    },
  },
};
</script>

<style scoped>
#article-list .tweb {
  padding: 10px;
}

.card.tweb .text-item {
  color: #fff;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<template>
  <div>
    <!-- 面包屑导航 -->
    <BreadMenu :page_name="article_data.title" :lanmu="article_data.lanmu"></BreadMenu>

    <!-- 文章详情页 -->
    <el-row :gutter="10">
      <el-col :xs="24" :lg="16">
        <!-- 文章标题 -->
        <div class="body tweb">
          <div class="header">
            {{ article_data.title }}
          </div>
        </div>
        <!-- 文章描述 -->
        <div class="body tweb">
          <div class="tweb">
            {{ article_data.describe }}
          </div>
        </div>
        <!-- 文章内容 -->
        <div class="body tweb">
          <div class="article-content" v-html="article_data.content"></div>
          <div class="clear"></div>
        </div>
        <!-- 跳转上下篇文章 -->
        <div class="body tweb">
          <el-button
            v-if="article_data.pre_id == 0"
            type="info"
            @click="toOtherPage(article_data.pre_id)"
            >上一页</el-button
          >
          <el-button v-else type="success" @click="toOtherPage(article_data.pre_id)"
            >上一页</el-button
          >
          <el-button
            v-if="article_data.next_id == 0"
            type="info"
            @click="toOtherPage(article_data.next_id)"
            >下一页</el-button
          >
          <el-button v-else type="success" @click="toOtherPage(article_data.next_id)"
            >下一页</el-button
          >
        </div>
      </el-col>
      <el-col :xs="24" :lg="8">
        <div class="body tweb">
          <el-image :src="article_data.cover" :fit="'cover'"></el-image>
        </div>
        <!-- 点赞收藏打赏 -->
        <div class="body tweb like-btn">
          <el-row>
            <el-col :span="8">
              <i
                v-if="user_article_info.like"
                @click="toLike()"
                class="iconfont icon-dianzan"
                style="color: #fc5959"
              ></i>
              <i v-else @click="toLike()" class="iconfont icon-dianzan"></i>
            </el-col>
            <el-col :span="8">
              <i
                v-if="user_article_info.favor"
                @click="toFavor()"
                class="iconfont icon-shoucang"
                style="color: #ffc815"
              ></i>
              <i v-else @click="toFavor()" class="iconfont icon-shoucang"></i>
            </el-col>
            <el-col :span="8">
              <i class="iconfont icon-dashang"></i>
            </el-col>
          </el-row>
        </div>
        <!-- 评论列表 -->
        <div class="body tweb">
          <div
            v-for="(item, index) in pinglun_data"
            :key="index"
            class="body tweb pinglun-item"
          >
            {{ item.nickName }} 说：
            <el-divider></el-divider>
            {{ item.text }}
          </div>
        </div>
        <!-- 分页器 -->
        <div class="tweb" style="margin-top: 10px">
          <el-pagination
            background
            small
            layout="prev, pager, next"
            :total="total"
            :page-size="pageSize"
            :pager-count="pagerCount"
            @current-change="currentChange"
          >
          </el-pagination>
        </div>
        <!-- 新评论 -->
        <div class="body tweb">
          <el-input
            type="textarea"
            :maxlength="120"
            :rows="2"
            placeholder="请输入内容"
            v-model="new_pinglun"
            style="margin-bottom: 10px"
          >
          </el-input>
          <el-button @click="saveNewPinglun()" type="success">发表评论</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import BreadMenu from "../components/BreadMenu";
import axios from "axios";
import Qs from "qs";
export default {
  data() {
    return {
      article_id: this.$route.query.id,
      article_data: {},
      user_article_info: {},
      // 评论
      new_pinglun: "",
      pinglun_data: [],
      // 分页器
      total: 40,
      pageSize: 4,
      currentPage: 1,
      pagerCount: 5,
    };
  },
  components: {
    BreadMenu,
  },
  watch: {
    $route(to) {
      this.article_id = to.query.id;
      this.getArticleData(to.query.id);
      this.getAllPinglun(1);
    },
  },
  mounted() {
    this.getArticleData(this.article_id);
    this.getAllPinglun(1);
  },
  methods: {
    // 收藏
    toFavor() {
      axios({
        method: "post",
        url: "http://127.0.0.1:9000/api/article-favor/",
        data: Qs.stringify({
          token: this.$store.getters.isnotUserLogin,
          article_id: this.article_id,
        }),
      }).then((res) => {
        if (res.data == "nologin") {
          alert("尚未登录");
          return;
        }
        if (res.data == "ok") {
          this.getUserArticleInfo();
        }
      });
    },
    // 点赞
    toLike() {
      axios({
        method: "post",
        url: "http://127.0.0.1:9000/api/article-like/",
        data: Qs.stringify({
          token: this.$store.getters.isnotUserLogin,
          article_id: this.article_id,
        }),
      }).then((res) => {
        if (res.data == "nologin") {
          alert("尚未登录");
          return;
        }
        if (res.data == "ok") {
          this.getUserArticleInfo();
        }
      });
    },
    // 获取互动信息
    getUserArticleInfo() {
      let token = this.$store.getters.isnotUserLogin;
      if (token) {
        axios({
          url: "http://127.0.0.1:9000/api/user-article-info/",
          method: "post",
          data: Qs.stringify({
            token: token,
            article_id: this.article_id,
          }),
        }).then((res) => {
          // console.log(res.data)
          this.user_article_info = res.data;
        });
      }
    },
    // 获取文章评论
    getAllPinglun(page) {
      axios({
        url: "http://127.0.0.1:9000/api/pinglun/",
        method: "get",
        params: {
          page,
          pageSize: this.pageSize,
          article_id: this.article_id,
        },
      }).then((res) => {
        // console.log(res.data)
        this.pinglun_data = res.data.data;
        this.total = res.data.total;
      });
    },
    // 发布评论
    saveNewPinglun() {
      if (this.new_pinglun.length == 0) {
        alert("内容为空");
        return;
      }
      axios({
        method: "post",
        url: "http://127.0.0.1:9000/api/pinglun/",
        data: Qs.stringify({
          token: this.$store.getters.isnotUserLogin,
          article_id: this.article_id,
          text: this.new_pinglun,
        }),
      }).then((res) => {
        if (res.data == "nologin") {
          alert("尚未登录");
          return;
        }
        if (res.data == "noperm") {
          alert("权限不足");
          return;
        }
        if (res.data == "ok") {
          this.getAllPinglun(1);
        }
      });
      this.new_pinglun = "";
    },
    // 评论翻页
    currentChange(val) {
      // console.log("第" + val + "页");
      this.currentPage = val;
      this.getAllPinglun(val);
    },
    // 跳转上下篇文章
    toOtherPage(id) {
      if (id == 0) {
        alert("没有了");
        return;
      }
      this.$router.push({ path: "/article", query: { id: id } });
    },
    // 获取文章详细信息
    getArticleData(id) {
      axios({
        method: "get",
        url: "http://127.0.0.1:9000/api/article-data/",
        params: {
          article_id: id,
        },
      }).then((res) => {
        // console.log(res.data);
        this.getUserArticleInfo();
        this.article_data = res.data;
      });
    },
  },
};
</script>

<style scoped>
.body.tweb {
  padding: 10px;
}

.body.tweb .tweb {
  padding: 10px;
  color: #b7b7b7;
  font-size: 13px;
  font-style: italic;
}

.like-btn {
  text-align: center;
  color: #fff;
}

.like-btn i {
  font-size: 30px;
  cursor: pointer;
}

.body.tweb.pinglun-item {
  color: #fff;
  font-size: 16px;
}

.el-divider--horizontal {
  margin: 10px 0;
}
</style>

<template>
  <div>
    <!-- 面包屑导航 -->
    <BreadMenu :page_name="'栏目管理'"></BreadMenu>
    <!-- 内容 -->
    <div class="body tweb">
      <el-row :gutter="10">
        <el-col :span="6">
          <div class="tweb">
            <h5>栏目结构</h5>
            <el-divider></el-divider>
          </div>
          <div class="body tweb" style="display: flex">
            <el-input v-model="new_lanmu_name" placeholder="请输入新栏目名称"></el-input>
            <el-button @click="pushLanmuList()" type="success">保存</el-button>
          </div>
          <div class="body tweb">
            <el-tree
              :data="lanmu_tree"
              node-key="id"
              default-expand-all
              draggable
              :render-content="renderContent"
              @node-click="choosed_lanmu_articleList"
            >
            </el-tree>
          </div>
          <div class="save-tree body tweb" style="float: left">
            <el-button @click="getLanmuTree()" type="warning" size="mini"
              >恢复结构</el-button
            >
            <el-button @click="saveLanmuTree()" type="success" size="mini"
              >保存结构</el-button
            >
            <el-button @click="getNobelong()" type="primary" size="mini"
              >未分配文章获取</el-button
            >
          </div>
        </el-col>
        <el-col :span="18">
          <div class="tweb">
            <h5>文章列表：{{ currentLanmu }}</h5>
            <el-divider></el-divider>
          </div>
          <!-- 文章列表 -->
          <div class="body tweb" style="min-height: 467px">
            <el-row>
              <el-col v-for="item in article_list" :key="item.id" :span="24">
                <div class="card tweb">
                  <el-row>
                    <el-col class="imag" :xs="24" :lg="6">
                      <el-image :src="item.cover" :fit="'cover'"></el-image>
                    </el-col>
                    <el-col class="text-item" :xs="24" :lg="4">
                      <span>{{ item.title }}</span>
                    </el-col>
                    <el-col class="text-item" :xs="12" :lg="7">
                      <span> 发布者：{{ item.nickName }} </span>
                    </el-col>
                    <el-col class="text-item" :xs="12" :lg="7">
                      <el-popover placement="right" width="150" trigger="click">
                        <el-tree
                          :data="lanmu_tree"
                          node-key="id"
                          default-expand-all
                          @node-click="choosed_lanmu"
                        >
                        </el-tree>
                        <el-button
                          type="warning"
                          icon="el-icon-plus"
                          circle
                          slot="reference"
                        ></el-button>
                        <el-button
                          type="success"
                          size="mini"
                          @click="saveArticleToLanmu(item.id)"
                        >
                          确定</el-button
                        >
                      </el-popover>
                    </el-col>
                  </el-row>
                </div>
              </el-col>
            </el-row>
          </div>
          <!-- 分页器 -->
          <div class="body tweb">
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
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import BreadMenu from "../components/BreadMenu";
import axios from "axios";
import Qs from "qs";
export default {
  data() {
    return {
      // 文章内容
      total: 40,
      pageSize: 4,
      currentPage: 1,
      pagerCount: 5,
      article_list: [],
      currentLanmu: "未分配文章",
      // 栏目结构
      maxId: 0,
      new_lanmu_name: "",
      lanmu_tree: [],
      // 文章栏目分配
      choosed_lanmu_id: 0,
      choosed_lanmu_name: "",
    };
  },
  mounted() {
    this.getListData(this.currentPage);
    this.getLanmuTree();
  },
  methods: {
    // 选择栏目查看文章
    choosed_lanmu_articleList(node) {
      console.log("node:", node.label);
      this.currentLanmu = node.label;
      this.getListData(1);
    },
    //选择文章，保存栏目
    choosed_lanmu(node) {
      console.log(node);
      this.choosed_lanmu_id = node.id;
      this.choosed_lanmu_name = node.label;
    },
    // 为文章分配栏目
    saveArticleToLanmu(article_id) {
      //   console.log("文章ID", article_id);
      axios({
        method: "put",
        url: "http://127.0.0.1:9000/api/add-article/",
        data: Qs.stringify({
          token: this.$store.getters.isnotUserLogin,
          lanmu_id: this.choosed_lanmu_id,
          article_id: article_id,
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
          this.currentLanmu = this.choosed_lanmu_name;
          this.getListData(1);
          this.getLanmuTree();
        }
      });
    },
    // 获取栏目树
    getLanmuTree() {
      axios({
        method: "get",
        url: "http://127.0.0.1:9000/api/tweb-lanmu/",
      }).then((res) => {
        // console.log(res.data);
        this.lanmu_tree = res.data;
      });
    },
    // 保存栏目树
    saveLanmuTree() {
      //   console.log(this.lanmu_tree);
      axios({
        method: "put",
        url: "http://127.0.0.1:9000/api/tweb-lanmu/",
        data: Qs.stringify({
          token: this.$store.getters.isnotUserLogin,
          lanmu_tree: JSON.stringify(this.lanmu_tree),
        }),
      }).then((res) => {
        // console.log(res.data);
        if (res.data == "nologin") {
          alert("尚未登录");
          return;
        }
        if (res.data == "noperm") {
          alert("权限不足");
          return;
        }
        this.getLanmuTree();
      });
    },
    // 新栏目名称
    pushLanmuList() {
      // 检查新栏目数据
      let checkTree = this.loopCheckData(this.lanmu_tree);
      if (checkTree == false) {
        this.new_lanmu_name = "";
        return;
      }
      let new_lanmu = {
        id: this.maxId + 1,
        label: this.new_lanmu_name,
        children: [],
      };
      //   console.log(new_lanmu);
      this.lanmu_tree.push(new_lanmu);
      this.new_lanmu_name = "";
    },
    // 递归检查栏目树
    loopCheckData(tree) {
      let checkTree = true;
      tree.forEach((obj) => {
        if (obj.id > this.maxId) {
          this.maxId = obj.id;
        }
        if (obj.label == this.new_lanmu_name) {
          alert("该栏目名称已存在");
          checkTree = false;
          return;
        }
        if (obj.children) {
          if (obj.children.length > 0) {
            this.loopCheckData(obj.children);
          }
        }
      });
      return checkTree;
    },
    // 未分配文章获取
    getNobelong() {
      this.currentLanmu = "未分配文章";
      this.getListData(1);
    },
    // 获取文章列表
    getListData(page) {
      axios({
        method: "get",
        url: "http://127.0.0.1:9000/api/article-list/",
        params: {
          page,
          pageSize: this.pageSize,
          lanmu: this.currentLanmu,
        },
      }).then((res) => {
        this.article_list = res.data.data;
        this.total = res.data.total;
      });
    },
    // 分页器
    currentChange(val) {
      //   console.log("第" + val + "页");
      this.currentPage = val;
      this.getListData(val);
    },
    // 栏目删除
    remove(_, data) {
      axios({
        url: "http://127.0.0.1:9000/api/tweb-lanmu/",
        method: "delete",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: Qs.stringify({
          token: this.$store.getters.isnotUserLogin,
          id: data.id,
        }),
      }).then((res) => {
        // console.log(res.data);
        if (res.data == "nologin") {
          alert("尚未登录");
          return;
        }
        if (res.data == "noperm") {
          alert("权限不足");
          return;
        }
        if (res.data == "ok") {
          this.getLanmuTree();
        }
      });
    },
    // 树节点内容自定义
    renderContent(h, { node, data }) {
      return (
        <span class="custom-tree-node">
          <span>{node.label}</span>
          <span> ({node.data.article_num})</span>
          <span>
            <el-button
              size="mini"
              type="text"
              style="margin-left:20px"
              on-click={() => this.remove(node, data)}
            >
              删除
            </el-button>
          </span>
        </span>
      );
    },
  },
  components: {
    BreadMenu,
  },
};
</script>

<style scoped>
.tweb {
  padding: 10px;
}
/* 文章列表图片 */
.card.tweb .imag {
  height: 80px;
  display: flex;
  justify-content: left;
  align-items: center;
}
.imag .el-image {
  height: 50px;
}
/* 文章列表文本 */
.card.tweb .text-item {
  color: #fff;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.text-item span {
  max-height: 40px;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
}
/* 保存栏目树按钮 */
.save-tree button {
  margin: 5px 5px;
}
</style>

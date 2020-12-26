<template>
  <div id="add-article">
    <el-row :gutter="10">
      <el-col :xs="24" :lg="8">
        <div class="tweb">
          <el-form :label-position="'left'" label-width="80px" :model="article_info">
            <el-form-item label="文章标题">
              <el-input v-model="article_info.title"></el-input>
            </el-form-item>
            <el-form-item label="描述">
              <el-input
                type="textarea"
                :rows="4"
                v-model="article_info.describe"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :xs="24" :lg="16">
        <div class="tweb">
          <div v-for="(img, index) in cover_list" :key="index">
            <el-image
              v-if="cover_img == img"
              class="cover"
              style="width: 130px; height: 130px"
              :src="img"
              :fit="'cover'"
              @click="chooseCover(img)"
            ></el-image>
            <el-image
              v-else
              style="width: 130px; height: 130px"
              :src="img"
              :fit="'cover'"
              @click="chooseCover(img)"
            ></el-image>
          </div>
          <el-button @click="submitArticle()" type="success" round>保存文章</el-button>
        </div>
      </el-col>
      <el-col :xs="24" :lg="24">
        <div class="tweb">
          <div id="summernote"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import $ from "jquery";
import axios from "axios";
import Qs from "qs";
export default {
  data() {
    return {
      article_info: {
        title: "",
        describe: "",
        contents: "",
      },
      cover_list: [],
      cover_img: "",
    };
  },
  mounted() {
    this.summernote();
  },
  methods: {
    //提交文章
    submitArticle() {
      let article_data = {
        title: this.article_info.title,
        describe: this.article_info.describe,
        cover: this.cover_img,
        content: this.article_info.contents,
        token: this.$store.getters.isnotUserLogin,
      };
      axios
        .post("http://127.0.0.1:9000/api/add-article/", Qs.stringify(article_data))
        .then((res) => {
          console.log(res);
          if (res.data == "notitle") {
            alert("文章标题不能为空");
            return;
          }
          if (res.data == "nologin") {
            alert("用户登录过期");
            return;
          }
          if (res.data == "ok") {
            window.location.reload();
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    // 选择封面
    chooseCover(img) {
      this.cover_img = img;
    },
    summernote() {
      let self = this;
      $("#summernote").summernote({
        height: 500,
        width: "100%",
        lang: "zh-CN",
        callbacks: {
          // 记录输入内容
          onChange(contents) {
            self.article_info.contents = contents;
          },
          // 本地图片上传
          onImageUpload(files) {
            let img = files[0];
            let imgData = new FileReader();
            imgData.readAsDataURL(img);
            imgData.onload = function () {
              // 插入图片
              let imgnode = document.createElement("img");
              imgnode.src = imgData.result;
              $("#summernote").summernote("insertNode", imgnode);
              // 推入封面选择
              self.cover_list.push(imgData.result);
            };
          },
          //远程图片添加
          onImageLinkInsert(url) {
            //插入图片
            let imgnode = document.createElement("img");
            imgnode.src = url;
            $("#summernote").summernote("insertNode", imgnode);
            //推入封面选择
            self.cover_list.push(url);
          },
          // 删除媒体文件
          onMediaDelete(target) {
            let imgData = target[0].src;
            for (let index = 0; index < self.cover_list.length; index++) {
              if (self.cover_list[index] == imgData) {
                self.cover_list.splice(index, 1);
              }
            }
          },
        },
      });
    },
  },
};
</script>

<style scoped>
.tweb {
  min-height: 200px;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-form-item {
  margin-top: 22px;
}
.tweb .el-image:hover {
  border: 2px solid skyblue;
}

.tweb .el-image.cover {
  border: 5px solid skyblue;
}

.el-button {
  position: fixed;
  right: 30px;
  margin-top: 275px;
  z-index: 1001;
}
</style>

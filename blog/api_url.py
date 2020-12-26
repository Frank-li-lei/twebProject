from django.urls import path
from blog import api

urlpatterns = [
    # 文章管理
      # 文章发布
      path('add-article/', api.add_article),
      # 文章列表
      path('article-list/', api.article_list),
      # 文章删除
      path('delete-article/', api.delete_article),
      # 文章详情页
      path('article-data/', api.articleData),

    # 用户管理
      # 登录
      path('tweb-login/', api.tweb_login),
      # 注册
      path('tweb-register/', api.tweb_register),
      # 自动登录
      path('auto-login/', api.tweb_autoLogin),
      # 登出
      path('tweb-logout/', api.tweb_logout),
      # 鉴权
      path('tweb-checkperm/', api.tweb_checkPerm),
      # 用户列表
      path('tweb-userlist/', api.tweb_userlist),

    # 用户组
      path('tweb-group/', api.tweb_group),
    # 栏目管理
      path('tweb-lanmu/', api.tweb_lanmu),
    # 文章用户互动
      path('pinglun/', api.twebPinglun),
      path('user-article-info/', api.userArticleInfo),
      path('article-like/',api.articleLike),
      path('article-favor/',api.articleFavor),
]
from django.db import models
from django.contrib.auth.models import User

# Create your models here.


# 用户信息
class Userinfo(models.Model):
    headImg = models.CharField(null=True, blank=True, max_length=200)
    nickName = models.CharField(null=True, blank=True, max_length=200)
    belong = models.OneToOneField(User,
                                  on_delete=models.CASCADE,
                                  null=True,
                                  blank=True)

    def __int__(self):
        return self.id


# 文章分类
class Lanmu(models.Model):
    name = models.CharField(null=True, blank=True, max_length=80)
    belong = models.ForeignKey('self',
                               on_delete=models.SET_NULL,
                               null=True,
                               blank=True,
                               related_name='lanmu_children')

    def __str__(self):
        return self.name


# 文章
class Article(models.Model):
    title = models.CharField(null=True, blank=True, max_length=80)
    describe = models.CharField(null=True, blank=True, max_length=300)
    cover = models.CharField(null=True, blank=True, max_length=200)
    content = models.TextField()
    belong = models.ForeignKey(User,
                               on_delete=models.CASCADE,
                               null=True,
                               blank=True,
                               related_name='article_user')
    belong_lanmu = models.ForeignKey(Lanmu,
                                     on_delete=models.SET_NULL,
                                     null=True,
                                     blank=True,
                                     related_name='article_lanmu')

    def __int__(self):
        return self.id


# 评论
class Pinglun(models.Model):
    text = models.CharField(null=True, blank=True, max_length=120)
    belong_user = models.ForeignKey(User,
                                    on_delete=models.CASCADE,
                                    null=True,
                                    blank=True,
                                    related_name='pinglun_user')
    belong = models.ForeignKey(Article,
                               on_delete=models.CASCADE,
                               null=True,
                               blank=True,
                               related_name='pinglun_article')

    def __int__(self):
        return self.id


# 收藏
class Favourite(models.Model):
    belong_user = models.ForeignKey(User,
                                    on_delete=models.CASCADE,
                                    null=True,
                                    blank=True,
                                    related_name='favor_user')
    belong = models.ForeignKey(Article,
                               on_delete=models.CASCADE,
                               null=True,
                               blank=True,
                               related_name='favor_article')

    def __int__(self):
        return self.id


# 点赞
class Like(models.Model):
    belong_user = models.ForeignKey(User,
                                    on_delete=models.CASCADE,
                                    null=True,
                                    blank=True,
                                    related_name='like_user')
    belong = models.ForeignKey(Article,
                               on_delete=models.CASCADE,
                               null=True,
                               blank=True,
                               related_name='like_article')

    def __int__(self):
        return self.id


# # 打赏
# class Pay(models.Model):
#     order = models.CharField(max_length=50)
#     price = models.CharField(max_length=50)
#     status = models.BooleanField()

#     def __int__(self):
#         return self.id
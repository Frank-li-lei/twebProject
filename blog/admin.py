from django.contrib import admin
from blog.models import Article, Userinfo, Lanmu, Pinglun, Favourite, Like


admin.site.register(Article)
admin.site.register(Userinfo)
admin.site.register(Lanmu)
admin.site.register(Pinglun)
admin.site.register(Favourite)
admin.site.register(Like)

# Register your models here.

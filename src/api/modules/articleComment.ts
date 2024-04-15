import { ResPage, ArticleComment } from "@/api/interface/index";
import { CMS_BASE_URL } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 文章管理模块
 */
// 获取文章评论列表
export const getArticleCommentList = (params: ArticleComment.ReqArticleCommentParams) => {
  return http.get<ResPage<ArticleComment.ResArticleCommentList>>(CMS_BASE_URL + `/article-comment/list`, params);
};

// 删除文章评论
export const deleteArticleComment = id => {
  return http.delete(CMS_BASE_URL + `/article-comment/delete/${id}`);
};

// 切换文章评论点赞
export const changeArticleCommentStatus = (params: { id: string; status: number }) => {
  return http.post(CMS_BASE_URL + `/article-comment/toggle-likes`, params);
};

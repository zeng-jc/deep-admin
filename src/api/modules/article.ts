import { ResPage, Article } from "@/api/interface/index";
import { CMS_BASE_URL } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 文章管理模块
 */
// 获取文章列表
export const getArticleList = (params: Article.ReqArticleParams) => {
  return http.get<ResPage<Article.ResArticleList>>(CMS_BASE_URL + `/article/list`, params);
};

// 新增文章
export const addArticle = (params: { id: string }) => {
  return http.post(CMS_BASE_URL + `/article/create`, params);
};

// 编辑文章
export const editArticle = (params: { id: string }) => {
  return http.patch(CMS_BASE_URL + `/article/update`, params);
};

// 删除文章
export const deleteArticle = id => {
  return http.delete(CMS_BASE_URL + `/article/delete/${id}`);
};

// 切换文章状态
export const changeArticleStatus = (params: { id: string; status: number }) => {
  return http.post(CMS_BASE_URL + `/article/change-status`, params);
};

// 导出文章数据
export const exportArticleInfo = (params: Article.ReqArticleParams) => {
  return http.download(CMS_BASE_URL + `/article/export`, params);
};

// 标签列表
export const getArticleLabelList = (params: Article.ReqArticleParams) => {
  return http.get<ResPage<Article.ResArticleList>>(CMS_BASE_URL + `/article/label/list`, params);
};

// 删除标签标签
export const deleteArticleLabel = id => {
  return http.delete(CMS_BASE_URL + `/article/label/delete/${id}`);
};

// 新增标签
export const addArticleLabel = (params: { id: string }) => {
  return http.post(CMS_BASE_URL + `/article/label/create`, params);
};

import { ResPage, MomentComment } from "@/api/interface/index";
import { CMS_BASE_URL } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 动态评论管理模块
 */
// 获取动态评论列表
export const getMomentCommentList = (params: MomentComment.ReqMomentCommentParams) => {
  return http.get<ResPage<MomentComment.ResMomentCommentList>>(CMS_BASE_URL + `/moment-comment/list`, params);
};

// 删除动态评论
export const deleteMomentComment = id => {
  return http.delete(CMS_BASE_URL + `/moment-comment/delete/${id}`);
};

// 切换动态评论点赞
export const changeMomentCommentStatus = (params: { id: string; status: number }) => {
  return http.post(CMS_BASE_URL + `/moment-comment/toggle-likes/${params.id}`, params);
};

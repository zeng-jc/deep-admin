import { ResPage, Announcement } from "@/api/interface/index";
import { CMS_BASE_URL } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 公告管理模块
 */
// 获取公告列表
export const getAnnouncementList = (params: Announcement.ReqAnnouncementParams) => {
  return http.get<ResPage<Announcement.ResAnnouncementList>>(CMS_BASE_URL + `/announcement/list`, params);
};

// 新增公告
export const createAnnouncement = (params: { id: string }) => {
  return http.post(CMS_BASE_URL + `/announcement/create`, params);
};

// 删除公告
export const deleteAnnouncement = id => {
  return http.delete(CMS_BASE_URL + `/announcement/delete/${id}`);
};

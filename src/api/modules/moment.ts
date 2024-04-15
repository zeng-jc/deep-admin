import { ResPage, Moment } from "@/api/interface/index";
import { CMS_BASE_URL } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 动态管理模块
 */
// 获取动态列表
export const getMomentList = (params: Moment.ReqMomentParams) => {
  return http.get<ResPage<Moment.ResMomentList>>(CMS_BASE_URL + `/moment/list`, params);
};

// 新增图片动态
export const addImagesMoment = (params: { id: string }) => {
  return http.post(CMS_BASE_URL + `/moment/images`, params);
};

// 新增视频动态
export const addVideoMoment = (params: { id: string }) => {
  return http.post(CMS_BASE_URL + `/moment/images`, params);
};

// 编辑动态
export const editMoment = (params: { id: string }) => {
  return http.patch(CMS_BASE_URL + `/moment/update`, params);
};

// 删除动态
export const deleteMoment = id => {
  return http.delete(CMS_BASE_URL + `/moment/delete/${id}`);
};

// 切换动态状态
export const changeMomentStatus = (params: { id: string; status: number }) => {
  return http.post(CMS_BASE_URL + `/moment/change-status`, params);
};

// 导出动态数据
export const exportMomentInfo = (params: Moment.ReqMomentParams) => {
  return http.download(CMS_BASE_URL + `/moment/export`, params);
};

// 标签列表
export const getMomentLabelList = (params: Moment.ReqMomentParams) => {
  return http.get<ResPage<Moment.ResMomentList>>(CMS_BASE_URL + `/moment/label/list`, params);
};

// 删除标签标签
export const deleteMomentLabel = id => {
  return http.delete(CMS_BASE_URL + `/moment/label/delete/${id}`);
};

// 新增标签
export const addMomentLabel = (params: { id: string }) => {
  return http.post(CMS_BASE_URL + `/moment/label/create`, params);
};

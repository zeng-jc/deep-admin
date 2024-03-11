import { ResPage, User } from "@/api/interface/index";
import { CMS_BASE_URL } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 用户管理模块
 */
// 获取用户列表
export const getUserList = (params: User.ReqUserParams) => {
  return http.get<ResPage<User.ResUserList>>(CMS_BASE_URL + `/user/list`, params);
};

// 新增用户
export const addUser = (params: { id: string }) => {
  return http.post(CMS_BASE_URL + `/user/create`, params);
};

// 编辑用户
export const editUser = (id, params: { id: string }) => {
  return http.patch(CMS_BASE_URL + `/user/update/${id}`, params);
};

// 删除用户
export const deleteUser = id => {
  return http.post(CMS_BASE_URL + `/user/delete/${id}`);
};

// 切换用户状态
export const changeUserStatus = (params: { id: string; status: number }) => {
  return http.post(CMS_BASE_URL + `/user/change-status`, params);
};

// 导出用户数据
export const exportUserInfo = (params: User.ReqUserParams) => {
  return http.download(CMS_BASE_URL + `/user/export`, params);
};

// 重置用户密码
export const resetUserPassWord = (params: { id: string }) => {
  return http.post(CMS_BASE_URL + `/user/rest_password`, params);
};

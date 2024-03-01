import { ResPage, User } from "@/api/interface/index";
import { CMS_BASE_URL } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 用户管理模块
 */
// 获取用户列表
export const getUserList = (params: User.ReqUserParams) => {
  return http.post<ResPage<User.ResUserList>>(CMS_BASE_URL + `/user/list`, params);
};

// 获取树形用户列表
export const getUserTreeList = (params: User.ReqUserParams) => {
  return http.post<ResPage<User.ResUserList>>(CMS_BASE_URL + `/user/tree/list`, params);
};

// 新增用户
export const addUser = (params: { id: string }) => {
  return http.post(CMS_BASE_URL + `/user/add`, params);
};

// 批量添加用户
export const BatchAddUser = (params: FormData) => {
  return http.post(CMS_BASE_URL + `/user/import`, params);
};

// 编辑用户
export const editUser = (params: { id: string }) => {
  return http.post(CMS_BASE_URL + `/user/edit`, params);
};

// 删除用户
export const deleteUser = (params: { id: string[] }) => {
  return http.post(CMS_BASE_URL + `/user/delete`, params);
};

// 切换用户状态
export const changeUserStatus = (params: { id: string; status: number }) => {
  return http.post(CMS_BASE_URL + `/user/change`, params);
};

// 重置用户密码
export const resetUserPassWord = (params: { id: string }) => {
  return http.post(CMS_BASE_URL + `/user/rest_password`, params);
};

// 导出用户数据
export const exportUserInfo = (params: User.ReqUserParams) => {
  return http.download(CMS_BASE_URL + `/user/export`, params);
};

// 获取用户状态字典
export const getUserStatus = () => {
  return http.get<User.ResStatus[]>(CMS_BASE_URL + `/user/status`);
};

// 获取用户性别字典
export const getUserGender = () => {
  return http.get<User.ResGender[]>(CMS_BASE_URL + `/user/gender`);
};

// 获取用户部门列表
export const getUserDepartment = () => {
  return http.get<User.ResDepartment[]>(CMS_BASE_URL + `/user/department`, {}, { cancel: false });
};

// 获取用户角色字典
export const getUserRole = () => {
  return http.get<User.ResRole[]>(CMS_BASE_URL + `/user/role`);
};

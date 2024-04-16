import { ResPage, Permission } from "@/api/interface/index";
import { CMS_BASE_URL } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 角色管理模块
 */
// 获取角色列表
export const getPermissionList = (params: Permission.ReqPermissionParams) => {
  return http.get<ResPage<Permission.ResPermissionList>>(CMS_BASE_URL + `/permission/list`, params);
};

export const createPermission = (params: Permission.ReqPermissionParams) => {
  return http.post<ResPage<Permission.ResPermissionList>>(CMS_BASE_URL + `/permission`, params);
};

export const assignPermission = (params: Permission.ReqPermissionParams) => {
  return http.post<ResPage<Permission.ResPermissionList>>(CMS_BASE_URL + `/permission/assignPermission`, params);
};

export const updatePermission = (params: Permission.ReqPermissionParams) => {
  return http.patch<ResPage<Permission.ResPermissionList>>(CMS_BASE_URL + `/permission/${params.id}`, params);
};

export const deletePermission = id => {
  return http.delete<ResPage<Permission.ResPermissionList>>(CMS_BASE_URL + `/permission/${id}`);
};

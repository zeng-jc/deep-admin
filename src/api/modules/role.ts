import { ResPage, Role } from "@/api/interface/index";
import { CMS_BASE_URL } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 角色管理模块
 */
// 获取角色列表
export const getRoleList = (params: Role.ReqRoleParams) => {
  return http.get<ResPage<Role.ResRoleList>>(CMS_BASE_URL + `/role/list`, params);
};

export const createRole = (params: Role.ReqRoleParams) => {
  return http.post<ResPage<Role.ResRoleList>>(CMS_BASE_URL + `/role`, params);
};

export const assignRole = (params: Role.ReqRoleParams) => {
  return http.post<ResPage<Role.ResRoleList>>(CMS_BASE_URL + `/role/assignRole`, params);
};

export const updateRole = (params: Role.ReqRoleParams) => {
  return http.patch<ResPage<Role.ResRoleList>>(CMS_BASE_URL + `/role/${params.id}`, params);
};

export const deleteRole = id => {
  return http.delete<ResPage<Role.ResRoleList>>(CMS_BASE_URL + `/role/${id}`);
};

export const changeRoleStatus = (params: Role.ReqRoleParams) => {
  return http.post<ResPage<Role.ResRoleList>>(CMS_BASE_URL + `/role/change-status`, params);
};

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

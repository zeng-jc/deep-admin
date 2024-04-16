// 获取菜单列表
import { CMS_BASE_URL } from "@/api/config/servicePort";
import http from "@/api";

export const getMenuListApi = () => {
  return http.get<Menu.MenuOptions[]>(CMS_BASE_URL + "/menu", {}, { loading: false });
};

export const createMenuApi = () => {
  return http.post<Menu.MenuOptions[]>(CMS_BASE_URL + "/menu", {}, { loading: false });
};

export const updateMenuApi = () => {
  return http.patch<Menu.MenuOptions[]>(CMS_BASE_URL + "/menu", {}, { loading: false });
};

export const deleteMenuApi = () => {
  return http.delete<Menu.MenuOptions[]>(CMS_BASE_URL + "/menu", {}, { loading: false });
};

export const assignMenuApi = () => {
  return http.post<Menu.MenuOptions[]>(CMS_BASE_URL + "/menu/assign-menu", {}, { loading: false });
};

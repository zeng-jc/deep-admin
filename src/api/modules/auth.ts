// 获取菜单列表
import { CMS_BASE_URL } from "@/api/config/servicePort";
import authButtonList from "@/assets/json/authButtonList.json";
import http from "@/api";

export const getAuthMenuListApi = () => {
  return http.get<Menu.MenuOptions[]>(CMS_BASE_URL + "/menu", {}, { loading: false });
  // 如果想让菜单变为本地数据，注释上一行代码，并引入本地 authMenuList.json 数据
};

// 获取按钮权限
export const getAuthButtonListApi = () => {
  // return http.get<Login.ResAuthButtons>(PORT1 + `/auth/buttons`, {}, { loading: false });
  // 如果想让按钮权限变为本地数据，注释上一行代码，并引入本地 authButtonList.json 数据
  return authButtonList;
};

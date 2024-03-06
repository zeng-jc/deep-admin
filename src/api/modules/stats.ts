import { Stats } from "@/api/interface/index";
import { CMS_BASE_URL } from "@/api/config/servicePort";
import http from "@/api";
/**
 * @name 登录模块
 */
// 用户登录
export const statsApi = () => {
  return http.get<Stats.ResStats>(CMS_BASE_URL + "/stats/all");
};

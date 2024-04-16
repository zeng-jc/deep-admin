import { ResPage, QuestionAnswer } from "@/api/interface/index";
import { CMS_BASE_URL } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 问答管理模块
 */
// 获取问答列表
export const getQuestionAnswerList = (params: QuestionAnswer.ReqQuestionAnswerParams) => {
  return http.get<ResPage<QuestionAnswer.ResQuestionAnswerList>>(CMS_BASE_URL + `/question-answer/question/list`, params);
};

// 新增问题
export const createQuestion = (params: { id: string }) => {
  return http.post(CMS_BASE_URL + `/create-question/create`, params);
};

// 回复答案
export const createAnswer = (params: { id: string }) => {
  return http.patch(CMS_BASE_URL + `/create-answer/${params}`, params);
};

// 删除问答
export const deleteQuestionAnswer = id => {
  return http.delete(CMS_BASE_URL + `/question-answer/question/${id}`);
};

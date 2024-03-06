import { defineStore } from "pinia";
import { StatsState } from "@/stores/interface";
import { statsApi } from "@/api/modules/stats";

export const useStatsStore = defineStore({
  id: "stats",
  state: (): StatsState => ({
    user: {
      total: 0,
      todayCount: 0
    },
    moment: {
      total: 0,
      commentCount: 0,
      likesCount: 0,
      viewsCount: 0
    },
    article: {
      total: 0,
      commentCount: 0,
      likesCount: 0,
      viewsCount: 0
    },
    visits: {
      today: 0,
      yesterday: 0,
      total: 0
    }
  }),
  getters: {},
  actions: {
    async getStats() {
      const { data } = await statsApi();
      this.user = data.user;
      this.moment = data.moment;
      this.article = data.article;
      this.visits = data.visits;
      return data;
    }
  }
});

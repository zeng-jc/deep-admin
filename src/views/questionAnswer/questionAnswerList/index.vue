<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
      @darg-sort="sortTable"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button v-auth="'add'" type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增问答</el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
        <el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <QuestionAnswerDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { ref, reactive } from "vue";
import { QuestionAnswer } from "@/api/interface";
import { useHandleData } from "@/hooks/useHandleData";
import { ElMessage } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import QuestionAnswerDrawer from "@/views/questionAnswer/components/QuestionAnswerDrawer.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { CirclePlus, Delete, View } from "@element-plus/icons-vue";
import { getQuestionAnswerList, createQuestion, deleteQuestionAnswer } from "@/api/modules/questionAnswer";
import dayjs from "dayjs";

const proTable = ref<ProTableInstance>();

const initParam = reactive({ type: 1 });

const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total,
    pagenum: data.pagenum,
    pagesize: data.pagesize
  };
};

const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.createTime && (newParams.startTime = newParams.createTime[0]);
  newParams.createTime && (newParams.endTime = newParams.createTime[1]);
  delete newParams.createTime;
  newParams.pagenum ?? (newParams.pagenum = 1);
  newParams.pagesize ?? (newParams.pagesize = 10);
  return getQuestionAnswerList(newParams);
};

const columns = reactive<ColumnProps<QuestionAnswer.ResQuestionAnswerList>[]>([
  { type: "selection", fixed: "left", width: 70 },
  { type: "sort", label: "Sort", width: 80 },
  { prop: "content", label: "问答内容", search: { el: "input", tooltip: "请输入问答内容" } },
  { prop: "username", label: "问题发布人", render: ({ row }) => <div>{row.user.username}</div> },
  { prop: "viewCount", label: "问答浏览量", width: 120 },
  {
    prop: "createTime",
    label: "创建时间",
    width: 180,
    render: scope => {
      return dayjs(scope.row.createTime).format("YYYY-MM-DD HH:mm:ss");
    }
  },
  { prop: "operation", label: "操作", fixed: "right", width: 330 }
]);

// 表格拖拽排序
const sortTable = ({ newIndex, oldIndex }: { newIndex?: number; oldIndex?: number }) => {
  console.log(newIndex, oldIndex);
  console.log(proTable.value?.tableData);
  ElMessage.success("修改列表排序成功");
};

// 删除问答信息
const deleteAccount = async (params: QuestionAnswer.ResQuestionAnswerList) => {
  await useHandleData(deleteQuestionAnswer, params.id, `删除【${params.content}】问答`);
  proTable.value?.getTableList();
};

// 批量删除问答信息
// const batchDelete = async (ids: string[]) => {
//   console.log(ids);
//   await useHandleData(deleteQuestionAnswer, 1, "删除所选问答信息");
//   proTable.value?.clearSelection();
//   proTable.value?.getTableList();
// };

const drawerRef = ref<InstanceType<typeof QuestionAnswerDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<QuestionAnswer.ResQuestionAnswerList> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? createQuestion : title === "编辑" ? editQuestionAnswer : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
</script>

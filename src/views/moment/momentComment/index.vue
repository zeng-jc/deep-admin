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
      <!-- <template #tableHeader="scope">
        <el-button
          type="danger"
          v-auth="'batchDelete'"
          :icon="Delete"
          plain
          :disabled="!scope.isSelected"
          @click="batchDelete(scope.selectedListIds)"
        >
          批量删除评论
        </el-button>
      </template> -->
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <MomentDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { ref, reactive } from "vue";
import { MomentComment } from "@/api/interface";
import { useHandleData } from "@/hooks/useHandleData";
import { ElMessage } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import MomentDrawer from "@/views/moment/components/MomentDrawer.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { Delete } from "@element-plus/icons-vue";
import { getMomentCommentList, deleteMomentComment } from "@/api/modules/momentComment";
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
  newParams.pagenum = 1;
  newParams.pagesize = 10;
  return getMomentCommentList(newParams);
};

// 表格配置项
const columns = reactive<ColumnProps<MomentComment.ResMomentCommentList>[]>([
  { type: "selection", fixed: "left" },
  { type: "sort", label: "Sort" },
  {
    prop: "content",
    label: "评论内容",
    search: { el: "input", tooltip: "请输入动态内容" }
  },
  {
    prop: "path",
    label: "评论路径",
    render: ({ row }) => {
      return <>{row.path ?? row.id}</>;
    }
  },
  {
    prop: "user",
    label: "评论人",
    render: ({ row }) => {
      return <>{row.user.username}</>;
    }
  },
  {
    prop: "moment",
    label: "评论的动态",
    render: ({ row }) => {
      return <>{row.moment.content}</>;
    }
  },
  { prop: "replyId", label: "评论回复Id", width: 120 },
  { prop: "likes", label: "评论点赞量", width: 120 },
  {
    prop: "createTime",
    label: "创建时间",
    render: scope => {
      return dayjs(scope.row.createTime).format("YYYY-MM-DD HH:mm:ss");
    }
  },
  { prop: "operation", label: "操作", fixed: "right", width: 150 }
]);

// 表格拖拽排序
const sortTable = ({ newIndex, oldIndex }: { newIndex?: number; oldIndex?: number }) => {
  console.log(newIndex, oldIndex);
  console.log(proTable.value?.tableData);
  ElMessage.success("修改列表排序成功");
};

// 删除评论信息
const deleteAccount = async (params: MomentComment.ResMomentCommentList) => {
  await useHandleData(deleteMomentComment, params.id, `删除【${params.content}】评论`);
  proTable.value?.getTableList();
};

// 批量删除评论信息
// const batchDelete = async (ids: string[]) => {
//   console.log(ids);
//   await useHandleData(deleteMomentComment, 1, "删除所选评论信息");
//   proTable.value?.clearSelection();
//   proTable.value?.getTableList();
// };

const drawerRef = ref<InstanceType<typeof MomentDrawer> | null>(null);
</script>

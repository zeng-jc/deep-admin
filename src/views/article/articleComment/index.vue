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
      <template #tableHeader="scope">
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
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <ArticleDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { ref, reactive } from "vue";
import { ArticleComment } from "@/api/interface";
import { useHandleData } from "@/hooks/useHandleData";
import { ElMessage } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import ArticleDrawer from "@/views/article/components/ArticleDrawer.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { Delete } from "@element-plus/icons-vue";
import { getArticleCommentList, deleteArticleComment } from "@/api/modules/articleComment";
import dayjs from "dayjs";

// ProTable 实例
const proTable = ref<ProTableInstance>();

// 如果表格需要初始化请求参数，直接定义传给 ProTable (之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ type: 1 });

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total && pagenum && pagesize 这些字段，可以在这里进行处理成这些字段
// 或者直接去 hooks/useTable.ts 文件中把字段改为你后端对应的就行
const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total,
    pagenum: data.pagenum,
    pagesize: data.pagesize
  };
};

// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getArticleCommentList"
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.createTime && (newParams.startTime = newParams.createTime[0]);
  newParams.createTime && (newParams.endTime = newParams.createTime[1]);
  delete newParams.createTime;
  newParams.pagenum = 1;
  newParams.pagesize = 10;
  return getArticleCommentList(newParams);
};

// 表格配置项
const columns = reactive<ColumnProps<ArticleComment.ResArticleCommentList>[]>([
  { type: "selection", fixed: "left" },
  { type: "sort", label: "Sort" },
  {
    prop: "content",
    label: "评论内容",
    search: { el: "input", tooltip: "请输入文章内容" }
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
    prop: "article",
    label: "评论的文章",
    render: ({ row }) => {
      return <>{row.article.title}</>;
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
const deleteAccount = async (params: ArticleComment.ResArticleCommentList) => {
  await useHandleData(deleteArticleComment, params.id, `删除【${params.content}】评论`);
  proTable.value?.getTableList();
};

// 批量删除评论信息
const batchDelete = async (ids: string[]) => {
  console.log(ids);
  await useHandleData(deleteArticleComment, 1, "删除所选评论信息");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

const drawerRef = ref<InstanceType<typeof ArticleDrawer> | null>(null);
</script>

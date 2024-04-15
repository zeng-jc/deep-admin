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
        <el-button v-auth="'add'" type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增文章</el-button>
        <!-- <el-button v-auth="'export'" type="primary" :icon="Download" plain>导出文章数据</el-button> -->
        <el-button type="danger" :icon="Delete" plain :disabled="!scope.isSelected" @click="batchDelete(scope.selectedListIds)">
          批量删除文章
        </el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
        <!-- <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button> -->
        <el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <ArticleDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { ref, reactive } from "vue";
import { Article } from "@/api/interface";
import { useHandleData } from "@/hooks/useHandleData";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import { ElMessage } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import ArticleDrawer from "@/views/article/components/ArticleDrawer.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { CirclePlus, Delete, View } from "@element-plus/icons-vue";
import { getArticleList, deleteArticle, editArticle, addArticle, changeArticleStatus } from "@/api/modules/article";
import { articleStatus } from "@/utils/dict";
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
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getArticleList"
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.createTime && (newParams.startTime = newParams.createTime[0]);
  newParams.createTime && (newParams.endTime = newParams.createTime[1]);
  delete newParams.createTime;
  newParams.pagenum = 1;
  newParams.pagesize = 10;
  return getArticleList(newParams);
};

// 页面按钮权限（按钮权限既可以使用 hooks，也可以直接使用 v-auth 指令，指令适合直接绑定在按钮上，hooks 适合根据按钮权限显示不同的内容）
const { BUTTONS } = useAuthButtons();

// 表格配置项
const columns = reactive<ColumnProps<Article.ResArticleList>[]>([
  { type: "selection", fixed: "left", width: 70 },
  { type: "sort", label: "Sort", width: 80 },
  {
    prop: "title",
    label: "文章标题",
    search: { el: "input", tooltip: "请输入文章标题" }
  },
  {
    prop: "cover",
    label: "封面",
    width: 100,
    render: ({ row }) => {
      const slots = {
        error: () => <div></div>
      };
      return (
        <>
          <el-image
            style="width: 60px"
            z-index={50}
            src={row.cover}
            max-scale={7}
            min-scale={0.2}
            preview-src-list={[row.cover]}
            v-slots={slots}
          ></el-image>
        </>
      );
    }
  },
  { prop: "content", label: "文章内容", width: 120 },
  { prop: "viewCount", label: "文章浏览量" },
  {
    prop: "labels",
    label: "标签",
    width: 120,
    render: ({ row }) => {
      return (
        <div style="display:flex; justify-content: space-between;">
          {row.labels.map(item => (
            <el-tag>{item}</el-tag>
          ))}
        </div>
      );
    }
  },
  {
    prop: "status",
    label: "文章状态",
    enum: articleStatus,
    width: 110,
    fieldNames: { label: "label", value: "status" },
    render: scope => {
      console.log("BUTTONS.value.status", BUTTONS.value.status);
      return (
        <>
          {BUTTONS.value.status ? (
            <el-switch
              model-value={scope.row.status}
              active-text={scope.row.status ? "启用" : "禁用"}
              active-value={1}
              inactive-value={0}
              onClick={() => changeStatus(scope.row)}
            />
          ) : (
            <el-tag type={scope.row.status ? "success" : "danger"}>{scope.row.status ? "启用" : "禁用"}</el-tag>
          )}
        </>
      );
    }
  },
  {
    prop: "createTime",
    label: "创建时间",
    width: 180,
    render: scope => {
      return dayjs(scope.row.createTime).format("YYYY-MM-DD HH:mm:ss");
    }
  },
  {
    prop: "updateTime",
    label: "更新时间",
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

// 删除文章信息
const deleteAccount = async (params: Article.ResArticleList) => {
  await useHandleData(deleteArticle, params.id, `删除【${params.title}】文章`);
  proTable.value?.getTableList();
};

// 批量删除文章信息
const batchDelete = async (ids: string[]) => {
  console.log(ids);
  await useHandleData(deleteArticle, 1, "删除所选文章信息");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

// 切换文章状态
const changeStatus = async (row: Article.ResArticleList) => {
  await useHandleData(changeArticleStatus, { id: row.id, status: row.status == 1 ? 0 : 1 }, `切换【${row.title}】文章状态`);
  proTable.value?.getTableList();
};
const drawerRef = ref<InstanceType<typeof ArticleDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<Article.ResArticleList> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addArticle : title === "编辑" ? editArticle : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
</script>

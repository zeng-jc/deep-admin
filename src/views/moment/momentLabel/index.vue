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
        <el-button v-auth="'add'" type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增标签</el-button>
        <!-- <el-button v-auth="'export'" type="primary" :icon="Download" plain>导出标签数据</el-button> -->
        <el-button type="danger" :icon="Delete" plain :disabled="!scope.isSelected" @click="batchDelete(scope.selectedListIds)">
          批量删除标签
        </el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <MomentLabelDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { ref, reactive } from "vue";
import { Moment } from "@/api/interface";
import { useHandleData } from "@/hooks/useHandleData";
import { ElMessage } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import MomentLabelDrawer from "@/views/moment/components/MomentLabelDrawer.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { CirclePlus, Delete } from "@element-plus/icons-vue";
import { getMomentLabelList, deleteMomentLabel, addMomentLabel, editMoment } from "@/api/modules/moment";
import dayjs from "dayjs";

// ProTable 实例
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
  return getMomentLabelList(newParams);
};

// 表格配置项
const columns = reactive<ColumnProps<Moment.ResMomentList>[]>([
  { type: "selection", fixed: "left", width: 70 },
  { type: "sort", label: "Sort", width: 80 },
  {
    prop: "name",
    label: "标签名",
    search: { el: "input", tooltip: "请输入标签名" }
  },
  {
    prop: "user",
    label: "标签创建人",
    render: ({ row }) => {
      return <>{row.user.username}</>;
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
  { prop: "operation", label: "操作", fixed: "right", width: 150 }
]);

// 表格拖拽排序
const sortTable = ({ newIndex, oldIndex }: { newIndex?: number; oldIndex?: number }) => {
  console.log(newIndex, oldIndex);
  console.log(proTable.value?.tableData);
  ElMessage.success("修改列表排序成功");
};

const deleteAccount = async (params: Moment.ResMomentList) => {
  await useHandleData(deleteMomentLabel, params.id, `删除【${params.name}】标签`);
  proTable.value?.getTableList();
};

// 批量删除标签信息
const batchDelete = async (ids: string[]) => {
  console.log(ids);
  await useHandleData(deleteMomentLabel, 1, "删除所选标签信息");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

const drawerRef = ref<InstanceType<typeof MomentLabelDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<Moment.ResMomentList> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addMomentLabel : title === "编辑" ? editMoment : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
</script>

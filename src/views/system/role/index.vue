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
        <el-button v-auth="'add'" type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增角色</el-button>
      </template>
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
        <el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <RoleDrawer ref="drawerRef" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { ref, reactive } from "vue";
import { Role } from "@/api/interface";
import { useHandleData } from "@/hooks/useHandleData";
import { ElMessage } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { CirclePlus, Delete, View } from "@element-plus/icons-vue";
import { getRoleList, deleteRole, updateRole, createRole, changeRoleStatus } from "@/api/modules/role";
import dayjs from "dayjs";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import { roleStatus } from "@/utils/dict";
import RoleDrawer from "@/views/system/components/RoleDrawer.vue";

// ProTable 实例
const proTable = ref<ProTableInstance>();

const initParam = reactive({ type: 1 });
const { BUTTONS } = useAuthButtons();

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
  return getRoleList(newParams);
};

// 表格配置项
const columns = reactive<ColumnProps<Role.ResRoleList>[]>([
  { type: "selection", fixed: "left", width: 70 },
  { type: "sort", label: "Sort", width: 80 },
  {
    prop: "name",
    label: "角色名字",
    search: { el: "input", tooltip: "请输入角色名" }
  },
  { prop: "desc", label: "橘色描述", width: 120 },
  {
    prop: "status",
    label: "角色状态",
    enum: roleStatus,
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

// 删除角色信息
const deleteAccount = async (params: Role.ResRoleList) => {
  await useHandleData(deleteRole, params.id, `删除【${params.name}】角色`);
  proTable.value?.getTableList();
};

const changeStatus = async (row: Role.ResRoleList) => {
  await useHandleData(changeRoleStatus, { id: row.id, status: row.status == 1 ? 0 : 1 }, `切换【${row.name}】角色状态`);
  proTable.value?.getTableList();
};

// 批量删除角色信息
// const batchDelete = async (ids: string[]) => {
//   console.log(ids);
//   await useHandleData(deleteRole, 1, "删除所选角色信息");
//   proTable.value?.clearSelection();
//   proTable.value?.getTableList();
// };

const drawerRef = ref<InstanceType<typeof RoleDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<Role.ResRoleList> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? createRole : title === "编辑" ? updateRole : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
</script>

<template>
  <div class="table-box">
    <ProTable ref="proTable" title="菜单列表" row-key="path" :indent="20" :columns="columns" :data="menuData">
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增菜单 </el-button>
      </template>
      <!-- 菜单图标 -->
      <template #icon="scope">
        <el-icon :size="18">
          <component :is="scope.row.meta.icon"></component>
        </el-icon>
      </template>
      <!-- 菜单操作 -->
      <template #operation>
        <el-button type="primary" link :icon="EditPen"> 编辑 </el-button>
        <el-button type="primary" link :icon="Delete"> 删除 </el-button>
      </template>
    </ProTable>
    <MenuDrawer ref="drawerRef" />
  </div>
</template>

<script setup lang="ts" name="menuMange">
import { ref, onMounted } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { Delete, EditPen, CirclePlus } from "@element-plus/icons-vue";
import authMenuList from "@/assets/json/authMenuList.json";
import ProTable from "@/components/ProTable/index.vue";
import { getMenuListApi, createMenuApi, updateMenuApi } from "@/api/modules/menu";
import MenuDrawer from "@/views/system/components/MenuDrawer.vue";

const proTable = ref();

onMounted(() => {
  getMenu();
});

const menuData = ref<any>([]);
console.log(menuData.value);
console.log(authMenuList.data);
const getMenu = async () => {
  const { data } = await getMenuListApi();
  menuData.value = data;
};

// 表格配置项
const columns: ColumnProps[] = [
  { prop: "meta.title", label: "菜单名称", align: "left", search: { el: "input" } },
  { prop: "meta.icon", label: "菜单图标" },
  { prop: "name", label: "菜单 name", search: { el: "input" } },
  { prop: "path", label: "菜单路径", width: 300, search: { el: "input" } },
  { prop: "component", label: "组件路径", width: 300 },
  { prop: "operation", label: "操作", width: 250, fixed: "right" }
];

const drawerRef = ref<InstanceType<typeof MenuDrawer> | null>(null);
const openDrawer = (title: string, row = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? createMenuApi : title === "编辑" ? updateMenuApi : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
</script>

<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}菜单`">
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="角色名" prop="name">
        <el-input v-model="drawerProps.row!.name" placeholder="角色名" clearable></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="desc">
        <el-input v-model="drawerProps.row!.desc" placeholder="角色描述" clearable></el-input>
      </el-form-item>
      <el-form-item label="角色权限" prop="desc" v-if="drawerProps.title === '查看'">
        <el-tag type="primary" v-for="permission in drawerProps.row!.permissions" :key="permission.id" style="margin-right: 6px">
          {{ permission.name }}
        </el-tag>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="MenuDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { Role } from "@/api/interface";

const rules = reactive({
  name: [{ required: true, message: "请输入角色名" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<Role.ResRoleList>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}菜单成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};

defineExpose({
  acceptParams
});
</script>

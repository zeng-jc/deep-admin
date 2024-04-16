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
      <el-form-item label="菜单名" prop="name">
        <el-input v-model="drawerProps.row!.name" placeholder="菜单名" clearable></el-input>
      </el-form-item>
      <el-form-item label="菜单路径" prop="path">
        <el-input v-model="drawerProps.row!.path" placeholder="菜单路径" clearable></el-input>
      </el-form-item>
      <el-form-item label="菜单组件" prop="component">
        <el-input v-model="drawerProps.row!.component" placeholder="菜单组件" clearable></el-input>
      </el-form-item>
      <!-- <el-form-item label="父级菜单" prop="parentId">
        <el-input v-model="drawerProps.row!.parentId" placeholder="父级菜单" clearable></el-input>
      </el-form-item>
      <el-form-item label="菜单标题" prop="title">
        <el-input v-model="drawerProps.row!.meta!.title" placeholder="菜单标题" clearable></el-input>
      </el-form-item>
      <el-form-item label="菜单连接" prop="link">
        <el-input v-model="drawerProps.row!.meta!.link" placeholder="菜单连接" clearable></el-input>
      </el-form-item>
      <el-form-item label="菜单图标" prop="icon">
        <el-input v-model="drawerProps.row!.meta!.icon" placeholder="菜单图标" clearable></el-input>
      </el-form-item> -->
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

const rules = reactive({
  photo: [{ required: true, message: "请上传菜单照片" }],
  Menuname: [{ required: true, message: "请填写菜单姓名" }],
  gender: [{ required: true, message: "请选择性别" }],
  nickname: [{ required: true, message: "请填写身份证号" }],
  email: [{ required: true, message: "请填写邮箱" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<Menu.MenuOptions>;
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

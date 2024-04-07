<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}用户`">
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="用户头像" prop="avatar">
        <UploadImg
          v-model:image-url="drawerProps.row!.avatar"
          width="135px"
          height="135px"
          :file-size="3"
          :api="drawerProps.api"
          :id="drawerProps.row!.id + ''"
          @update:image-url="updateAvatar"
        >
          <template #empty>
            <el-icon><Avatar /></el-icon>
            <span>请上传头像</span>
          </template>
          <template #tip> 头像大小不能超过 3M </template>
        </UploadImg>
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="drawerProps.row!.nickname" placeholder="用户昵称" clearable></el-input>
      </el-form-item>
      <el-form-item label="主页id" prop="username">
        <el-input v-model="drawerProps.row!.username" placeholder="主页id" clearable></el-input>
      </el-form-item>
      <el-form-item label="用户密码" prop="password">
        <el-input v-model="drawerProps.row!.password" placeholder="用户用户密码" clearable></el-input>
      </el-form-item>
      <el-form-item label="用户等级" prop="level">
        <el-input v-model="drawerProps.row!.level" placeholder="用户等级" clearable></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select v-model="drawerProps.row!.gender" placeholder="请选择用户性别" clearable>
          <el-option v-for="item in genderType" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="主页介绍" prop="bio">
        <el-input v-model="drawerProps.row!.bio" placeholder="用户主页介绍" clearable></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="drawerProps.row!.email" placeholder="用户邮箱" clearable></el-input>
      </el-form-item>
      <el-form-item label="github" prop="github">
        <el-input v-model="drawerProps.row!.github" placeholder="用户github" clearable></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="drawerProps.row!.phone" placeholder="用户电话" clearable></el-input>
      </el-form-item>
      <el-form-item label="出生年月" prop="birthday">
        <el-input v-model="drawerProps.row!.birthday" placeholder="用户出生年月" clearable></el-input>
      </el-form-item>
      <el-form-item label="学校" prop="school">
        <el-input v-model="drawerProps.row!.school" placeholder="用户学校" clearable></el-input>
      </el-form-item>
      <el-form-item label="专业" prop="major">
        <el-input v-model="drawerProps.row!.major" placeholder="用户专业" clearable></el-input>
      </el-form-item>
      <el-form-item label="所在位置" prop="position">
        <el-input v-model="drawerProps.row!.position" placeholder="用户所在位置" clearable></el-input>
      </el-form-item>
      <el-form-item label="注册时间" prop="createTime">
        <el-input v-model="drawerProps.row!.createTime" placeholder="用户注册时间" clearable></el-input>
      </el-form-item>
      <el-form-item label="更新时间" prop="updateTime">
        <el-input v-model="drawerProps.row!.updateTime" placeholder="用户更新时间" clearable></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref, reactive } from "vue";
import { genderType } from "@/utils/dict";
import { ElMessage, FormInstance } from "element-plus";
import { User } from "@/api/interface";
import UploadImg from "@/components/Upload/Img.vue";

const rules = reactive({
  photo: [{ required: true, message: "请上传用户照片" }],
  username: [{ required: true, message: "请填写用户姓名" }],
  gender: [{ required: true, message: "请选择性别" }],
  nickname: [{ required: true, message: "请填写身份证号" }],
  email: [{ required: true, message: "请填写邮箱" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<User.ResUserList>;
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
      ElMessage.success({ message: `${drawerProps.value.title}用户成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};
const updateAvatar = () => {
  drawerProps.value.getTableList!();
};
defineExpose({
  acceptParams
});
</script>

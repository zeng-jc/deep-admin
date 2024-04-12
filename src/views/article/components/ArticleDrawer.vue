<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}文章`">
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="封面" prop="avatar">
        <UploadImg
          v-model:image-url="drawerProps.row!.cover"
          width="135px"
          height="135px"
          :file-size="3"
          :api="drawerProps.api"
          :id="drawerProps.row!.id + ''"
          @update:image-url="updateAvatar"
        >
          <template #empty>
            <el-icon><Avatar /></el-icon>
            <span>请上传封面</span>
          </template>
          <template #tip> 封面大小不能超过 3M </template>
        </UploadImg>
      </el-form-item>
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="drawerProps.row!.title" placeholder="文章标题" clearable></el-input>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <el-input v-model="drawerProps.row!.content" placeholder="文章内容" clearable></el-input>
      </el-form-item>
      <el-form-item label="文章浏览量" prop="viewCount">
        <el-input v-model="drawerProps.row!.viewCount" placeholder="文章浏览量" clearable></el-input>
      </el-form-item>
      <el-form-item label="文章标签" prop="labels">
        <el-input v-model="drawerProps.row!.labels" placeholder="文章标签" clearable></el-input>
      </el-form-item>
      <el-form-item label="文章状态" prop="status">
        <el-input v-model="drawerProps.row!.status" placeholder="文章状态" clearable></el-input>
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
import { ElMessage, FormInstance } from "element-plus";
import { Article } from "@/api/interface";
import UploadImg from "@/components/Upload/Img.vue";

const rules = reactive({});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<Article.ResArticleList>;
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

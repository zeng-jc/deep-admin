<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}问答`">
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="问答内容" prop="content">
        <el-input v-model="drawerProps.row!.content" placeholder="问答内容" clearable></el-input>
      </el-form-item>
      <el-form-item label="问题发布人" prop="username">
        <el-input v-model="drawerProps.row!.user.username" placeholder="问答内容" clearable></el-input>
      </el-form-item>
      <el-form-item label="回答列表" prop="answer">
        <el-card style="width: 100%">
          <div v-for="item in drawerProps.row!.answer" :key="item" class="text item">
            <div>回复内容：{{ item.content }}</div>
            <div style="font-size: 12px; color: #aeaeae">回复时间：{{ item.createTime }}</div>
          </div>
        </el-card>
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
import { ElMessage, FormInstance, UploadFile } from "element-plus";
import { QuestionAnswer } from "@/api/interface";

const uploadImageList = ref<UploadFile[]>();

const rules = reactive({
  content: [{ required: true, message: "请输入问答内容" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<QuestionAnswer.ResQuestionAnswerList>;
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
  const fd = new FormData();
  uploadImageList.value?.forEach(item => {
    fd.append("images", item.raw as File);
  });
  fd.append("content", drawerProps.value.row.content);
  drawerProps.value.row.labels?.split(",").forEach(item => {
    fd.append("labels", item);
  });
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      await drawerProps.value.api![0]!(fd);
      ElMessage.success({ message: `问答创建成功！` });
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

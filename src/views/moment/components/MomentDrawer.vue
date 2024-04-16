<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="600px" :title="`${drawerProps.title}动态`">
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="动态内容" prop="content">
        <el-input
          v-model="drawerProps.row!.content"
          type="textarea"
          maxlength="800"
          :autosize="{ minRows: 8, maxRows: 12 }"
          show-word-limit
          placeholder="动态内容"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="动态标签" prop="labels">
        <el-input v-model="drawerProps.row!.labels" placeholder="多个标签用“,”隔开" clearable></el-input>
      </el-form-item>
      <el-form-item label="动态图片" prop="images" v-if="drawerProps.title === '新增'">
        <el-upload
          ref="uploadRef"
          v-model:file-list="drawerProps.row!.images"
          :limit="9"
          list-type="picture"
          :auto-upload="false"
          accept=".jpg,.jpeg,.png,.gif"
        >
          <template #trigger>
            <el-button type="primary">select file</el-button>
          </template>
          <template #tip>
            <div class="el-upload__tip">支持jpg/jpeg/png/gif文件，每张图片不超过4mb</div>
          </template>
        </el-upload>
      </el-form-item>
      <!-- <el-form-item label="动态视频" prop="video">
        <el-upload ref="uploadRef" :auto-upload="false">
          <template #trigger>
            <el-button type="primary">select file</el-button>
          </template>
          <template #tip>
            <div class="el-upload__tip">视频不超过40mb</div>
          </template>
        </el-upload>
      </el-form-item> -->
      <el-form-item label="动态图片" prop="images" v-if="drawerProps.title === '查看'">
        <div v-for="(image, index) in drawerProps.row.images" :key="index" class="block">
          <el-image style="width: 100px; height: 100px" :src="image" :fit="fit" />
        </div>
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
import { Moment } from "@/api/interface";

// const uploadImageList = ref<UploadFile[]>();
const uploadRef = ref<UploadInstance>();

const rules = reactive({
  content: [{ required: true, message: "请输入动态内容" }]
});

interface DrawerProps {
  content: string;
  labels: string;
  isView: boolean;
  row: Partial<Moment.ResMomentList>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  content: "",
  labels: "",
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
  drawerProps.value.row!.images?.forEach(item => {
    fd.append("images", item.raw as File);
  });
  fd.append("content", drawerProps.value.row.content);
  drawerProps.value.row.labels?.split(",")?.forEach(item => {
    fd.append("labels", item);
  });
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      await drawerProps.value.api![0]!(fd);
      ElMessage.success({ message: `动态创建成功！` });
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

<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="600px" :title="`${drawerProps.title}文章`">
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="文章封面" prop="cover" v-if="drawerProps.title === '新增'">
        <el-upload
          v-model:file-list="drawerProps.row!.cover"
          :limit="1"
          :on-exceed="handleExceed"
          :auto-upload="false"
          accept=".jpg,.jpeg,.png,.gif"
          ref="uploadRef"
          list-type="picture"
        >
          <template #trigger>
            <el-button type="primary">select file</el-button>
          </template>
          <template #tip>
            <div class="el-upload__tip">支持jpg/jpeg/png/gif文件，每张图片不超过4mb</div>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover" v-if="drawerProps.title === '查看'">
        <el-image style="width: 100px" :src="drawerProps.row.cover" v-if="drawerProps.row.cover" :fit="fit" />
      </el-form-item>
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="drawerProps.row!.title" placeholder="文章标题" clearable></el-input>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <el-input
          v-model="drawerProps.row!.content"
          maxlength="800"
          :autosize="{ minRows: 8, maxRows: 12 }"
          type="textarea"
          placeholder="文章内容"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="文章浏览量" prop="viewCount">
        <el-input v-model="drawerProps.row!.viewCount" placeholder="文章浏览量" clearable></el-input>
      </el-form-item>
      <el-form-item label="文章标签" prop="labels">
        <el-input v-model="drawerProps.row!.labels" placeholder="文章标签，多个使用“，”隔开" clearable></el-input>
      </el-form-item>
      <el-form-item label="文章状态" prop="status">
        <el-input v-model="drawerProps.row!.status" placeholder="文章状态" clearable></el-input>
      </el-form-item>
      <el-form-item label="注册时间" prop="createTime" v-if="drawerProps.title === '查看'">
        <el-input v-model="drawerProps.row!.createTime" placeholder="文章注册时间" clearable></el-input>
      </el-form-item>
      <el-form-item label="更新时间" prop="updateTime" v-if="drawerProps.title === '查看'">
        <el-input v-model="drawerProps.row!.updateTime" placeholder="文章更新时间" clearable></el-input>
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
import { genFileId } from "element-plus";

const uploadRef = ref<UploadInstance>();

const rules = reactive({
  title: [{ required: true, message: "请输入文章标题" }],
  content: [{ required: true, message: "请输入文章内容" }]
});

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

const handleExceed: UploadProps["onExceed"] = files => {
  uploadRef.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  uploadRef.value!.handleStart(file);
};

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    const fd = new FormData();
    if (drawerProps.value.row!.cover) {
      fd.append("cover", drawerProps.value.row!.cover[0].raw as File);
    }
    fd.append("title", drawerProps.value.row.title);
    fd.append("content", drawerProps.value.row.content);
    drawerProps.value.row.labels?.split(",").forEach(item => {
      fd.append("labels", item);
    });
    fd.append("viewCount", drawerProps.value.row.viewCount);
    fd.append("status", drawerProps.value.row.status);
    if (!valid) return;
    try {
      await drawerProps.value.api!(fd);
      ElMessage.success({ message: `${drawerProps.value.title}文章成功！` });
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

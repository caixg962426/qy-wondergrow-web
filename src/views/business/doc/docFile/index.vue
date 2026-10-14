<template>
  <div class="app-container">
    <el-form :model="quewgParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="业务唯一标识" prop="bizId">
        <el-input
          v-model="quewgParams.bizId"
          placeholder="请输入业务唯一标识"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="原始文件名" prop="fileName">
        <el-input
          v-model="quewgParams.fileName"
          placeholder="请输入原始文件名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="本地存储相对路径" prop="filePath">
        <el-input
          v-model="quewgParams.filePath"
          placeholder="请输入本地存储相对路径"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="本地访问URL" prop="fileUrl">
        <el-input
          v-model="quewgParams.fileUrl"
          placeholder="请输入本地访问URL"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="云存储桶名" prop="cloudBucket">
        <el-input
          v-model="quewgParams.cloudBucket"
          placeholder="请输入云存储桶名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="云存储对象key" prop="cloudObject">
        <el-input
          v-model="quewgParams.cloudObject"
          placeholder="请输入云存储对象key"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="文件大小" prop="fileSize">
        <el-input
          v-model="quewgParams.fileSize"
          placeholder="请输入文件大小"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="文件扩展名" prop="fileExt">
        <el-input
          v-model="quewgParams.fileExt"
          placeholder="请输入文件扩展名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="下载次数" prop="downloadCount">
        <el-input
          v-model="quewgParams.downloadCount"
          placeholder="请输入下载次数"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['doc:docFile:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['doc:docFile:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['doc:docFile:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['doc:docFile:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="docFileList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="文件ID" align="center" prop="fileId" />
      <el-table-column label="业务类型" align="center" prop="bizType" />
      <el-table-column label="业务唯一标识" align="center" prop="bizId" />
      <el-table-column label="原始文件名" align="center" prop="fileName" />
      <el-table-column label="本地存储相对路径" align="center" prop="filePath" />
      <el-table-column label="本地访问URL" align="center" prop="fileUrl" />
      <el-table-column label="存储方式" align="center" prop="storageType" />
      <el-table-column label="云存储桶名" align="center" prop="cloudBucket" />
      <el-table-column label="云存储对象key" align="center" prop="cloudObject" />
      <el-table-column label="云存储访问URL" align="center" prop="cloudUrl" />
      <el-table-column label="文件大小" align="center" prop="fileSize" />
      <el-table-column label="MIME类型" align="center" prop="fileType" />
      <el-table-column label="文件扩展名" align="center" prop="fileExt" />
      <el-table-column label="下载次数" align="center" prop="downloadCount" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['doc:docFile:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['doc:docFile:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="quewgParams.pageNum"
      v-model:limit="quewgParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改文档中心文件对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="docFileRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="业务唯一标识" prop="bizId">
              <el-input v-model="form.bizId" placeholder="请输入业务唯一标识" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="原始文件名" prop="fileName">
              <el-input v-model="form.fileName" placeholder="请输入原始文件名" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="本地存储相对路径" prop="filePath">
              <el-input v-model="form.filePath" placeholder="请输入本地存储相对路径" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="本地访问URL" prop="fileUrl">
              <el-input v-model="form.fileUrl" placeholder="请输入本地访问URL" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="云存储桶名" prop="cloudBucket">
              <el-input v-model="form.cloudBucket" placeholder="请输入云存储桶名" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="云存储对象key" prop="cloudObject">
              <el-input v-model="form.cloudObject" placeholder="请输入云存储对象key" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="云存储访问URL" prop="cloudUrl">
              <el-input v-model="form.cloudUrl" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="文件大小" prop="fileSize">
              <el-input v-model="form.fileSize" placeholder="请输入文件大小" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="文件扩展名" prop="fileExt">
              <el-input v-model="form.fileExt" placeholder="请输入文件扩展名" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="下载次数" prop="downloadCount">
              <el-input v-model="form.downloadCount" placeholder="请输入下载次数" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="删除标志" prop="delFlag">
              <el-input v-model="form.delFlag" placeholder="请输入删除标志" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="DocFile">
import { listDocFile, getDocFile, delDocFile, addDocFile, updateDocFile } from "@/api/business/doc/docFile"

const { proxy } = getCurrentInstance()

const docFileList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")

const data = reactive({
  form: {},
  quewgParams: {
    pageNum: 1,
    pageSize: 10,
    bizType: undefined,
    bizId: undefined,
    fileName: undefined,
    filePath: undefined,
    fileUrl: undefined,
    storageType: undefined,
    cloudBucket: undefined,
    cloudObject: undefined,
    cloudUrl: undefined,
    fileSize: undefined,
    fileType: undefined,
    fileExt: undefined,
    downloadCount: undefined,
    status: undefined,
  },
  rules: {
    bizType: [
      { required: true, message: "业务类型不能为空", trigger: "change" }
    ],
    bizId: [
      { required: true, message: "业务唯一标识不能为空", trigger: "blur" }
    ],
  }
})

const { quewgParams, form, rules } = toRefs(data)

/** 查询文档中心文件列表 */
function getList() {
  loading.value = true
  listDocFile(quewgParams.value).then(response => {
    docFileList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

/** 取消按钮 */
function cancel() {
  open.value = false
  reset()
}

/** 表单重置 */
function reset() {
  form.value = {
    fileId: null,
    bizType: null,
    bizId: null,
    fileName: null,
    filePath: null,
    fileUrl: null,
    storageType: null,
    cloudBucket: null,
    cloudObject: null,
    cloudUrl: null,
    fileSize: null,
    fileType: null,
    fileExt: null,
    downloadCount: null,
    status: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  }
  proxy.resetForm("docFileRef")
}

/** 搜索按钮操作 */
function handleQuery() {
  quewgParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef")
  handleQuery()
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.fileId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加文档中心文件"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _fileId = row.fileId || ids.value
  getDocFile(_fileId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改文档中心文件"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["docFileRef"].validate(valid => {
    if (valid) {
      if (form.value.fileId != null) {
        updateDocFile(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addDocFile(form.value).then(() => {
          proxy.$modal.msgSuccess("新增成功")
          open.value = false
          getList()
        })
      }
    }
  })
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _fileIds = row.fileId || ids.value
  proxy.$modal.confirm('是否确认删除文档中心文件编号为"' + _fileIds + '"的数据项？').then(function() {
    return delDocFile(_fileIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('doc/docFile/export', {
    ...quewgParams.value
  }, `docFile_${new Date().getTime()}.xlsx`)
}

getList()
</script>

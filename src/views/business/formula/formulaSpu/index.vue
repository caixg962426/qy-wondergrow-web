<template>
  <div class="app-container">
    <el-form :model="quewgParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="奶粉品牌名称" prop="brandName">
        <el-input
          v-model="quewgParams.brandName"
          placeholder="请输入奶粉品牌名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="奶粉系列/品名" prop="seriesName">
        <el-input
          v-model="quewgParams.seriesName"
          placeholder="请输入奶粉系列/品名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="排序序号，越小越靠前，按使用人数人工调整" prop="sortNo">
        <el-input
          v-model="quewgParams.sortNo"
          placeholder="请输入排序序号，越小越靠前，按使用人数人工调整"
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
          v-hasPermi="['formula:formulaSpu:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['formula:formulaSpu:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['formula:formulaSpu:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['formula:formulaSpu:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="formulaSpuList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="SPU ID" align="center" prop="spuId" />
      <el-table-column label="奶粉品牌名称" align="center" prop="brandName" />
      <el-table-column label="奶粉系列/品名" align="center" prop="seriesName" />
      <el-table-column label="奶粉类型/特点" align="center" prop="formulaType" />
      <el-table-column label="奶粉特点描述" align="center" prop="features" />
      <el-table-column label="排序序号，越小越靠前，按使用人数人工调整" align="center" prop="sortNo" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['formula:formulaSpu:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['formula:formulaSpu:remove']">删除</el-button>
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

    <!-- 添加或修改奶粉SPU对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="formulaSpuRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="奶粉品牌名称" prop="brandName">
              <el-input v-model="form.brandName" placeholder="请输入奶粉品牌名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="奶粉系列/品名" prop="seriesName">
              <el-input v-model="form.seriesName" placeholder="请输入奶粉系列/品名" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="奶粉特点描述" prop="features">
              <el-input v-model="form.features" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="排序序号，越小越靠前，按使用人数人工调整" prop="sortNo">
              <el-input v-model="form.sortNo" placeholder="请输入排序序号，越小越靠前，按使用人数人工调整" />
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

<script setup name="FormulaSpu">
import { listFormulaSpu, getFormulaSpu, delFormulaSpu, addFormulaSpu, updateFormulaSpu } from "@/api/business/formula/formulaSpu"

const { proxy } = getCurrentInstance()

const formulaSpuList = ref([])
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
    brandName: undefined,
    seriesName: undefined,
    formulaType: undefined,
    features: undefined,
    sortNo: undefined,
    status: undefined,
  },
  rules: {
    brandName: [
      { required: true, message: "奶粉品牌名称不能为空", trigger: "blur" }
    ],
  }
})

const { quewgParams, form, rules } = toRefs(data)

/** 查询奶粉SPU列表 */
function getList() {
  loading.value = true
  listFormulaSpu(quewgParams.value).then(response => {
    formulaSpuList.value = response.rows
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
    spuId: null,
    brandName: null,
    seriesName: null,
    formulaType: null,
    features: null,
    sortNo: null,
    status: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  }
  proxy.resetForm("formulaSpuRef")
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
  ids.value = selection.map(item => item.spuId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加奶粉SPU"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _spuId = row.spuId || ids.value
  getFormulaSpu(_spuId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改奶粉SPU"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["formulaSpuRef"].validate(valid => {
    if (valid) {
      if (form.value.spuId != null) {
        updateFormulaSpu(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addFormulaSpu(form.value).then(() => {
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
  const _spuIds = row.spuId || ids.value
  proxy.$modal.confirm('是否确认删除奶粉SPU编号为"' + _spuIds + '"的数据项？').then(function() {
    return delFormulaSpu(_spuIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('formula/formulaSpu/export', {
    ...quewgParams.value
  }, `formulaSpu_${new Date().getTime()}.xlsx`)
}

getList()
</script>

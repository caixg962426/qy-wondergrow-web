<template>
  <div class="app-container">
    <el-form :model="quewgParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="SPU ID，关联formula_spu.spu_id" prop="spuId">
        <el-input
          v-model="quewgParams.spuId"
          placeholder="请输入SPU ID，关联formula_spu.spu_id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="奶粉段位" prop="formulaStage">
        <el-input
          v-model="quewgParams.formulaStage"
          placeholder="请输入奶粉段位"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="适用月龄/年龄" prop="ageRange">
        <el-input
          v-model="quewgParams.ageRange"
          placeholder="请输入适用月龄/年龄"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="SKU名称，如：爱他美卓萃1段800g" prop="skuName">
        <el-input
          v-model="quewgParams.skuName"
          placeholder="请输入SKU名称，如：爱他美卓萃1段800g"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="净含量(g)" prop="netWeight">
        <el-input
          v-model="quewgParams.netWeight"
          placeholder="请输入净含量(g)"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="包装规格" prop="packSpec">
        <el-input
          v-model="quewgParams.packSpec"
          placeholder="请输入包装规格"
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
          v-hasPermi="['formula:formulaSku:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['formula:formulaSku:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['formula:formulaSku:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['formula:formulaSku:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="formulaSkuList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="SKU ID" align="center" prop="skuId" />
      <el-table-column label="SPU ID，关联formula_spu.spu_id" align="center" prop="spuId" />
      <el-table-column label="奶粉段位" align="center" prop="formulaStage" />
      <el-table-column label="适用月龄/年龄" align="center" prop="ageRange" />
      <el-table-column label="SKU名称，如：爱他美卓萃1段800g" align="center" prop="skuName" />
      <el-table-column label="净含量(g)" align="center" prop="netWeight" />
      <el-table-column label="包装规格" align="center" prop="packSpec" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['formula:formulaSku:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['formula:formulaSku:remove']">删除</el-button>
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

    <!-- 添加或修改奶粉SKU对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="formulaSkuRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="SPU ID，关联formula_spu.spu_id" prop="spuId">
              <el-input v-model="form.spuId" placeholder="请输入SPU ID，关联formula_spu.spu_id" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="奶粉段位" prop="formulaStage">
              <el-input v-model="form.formulaStage" placeholder="请输入奶粉段位" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="适用月龄/年龄" prop="ageRange">
              <el-input v-model="form.ageRange" placeholder="请输入适用月龄/年龄" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="SKU名称，如：爱他美卓萃1段800g" prop="skuName">
              <el-input v-model="form.skuName" placeholder="请输入SKU名称，如：爱他美卓萃1段800g" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="净含量(g)" prop="netWeight">
              <el-input v-model="form.netWeight" placeholder="请输入净含量(g)" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="包装规格" prop="packSpec">
              <el-input v-model="form.packSpec" placeholder="请输入包装规格" />
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

<script setup name="FormulaSku">
import { listFormulaSku, getFormulaSku, delFormulaSku, addFormulaSku, updateFormulaSku } from "@/api/business/formula/formulaSku"

const { proxy } = getCurrentInstance()

const formulaSkuList = ref([])
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
    spuId: undefined,
    formulaStage: undefined,
    ageRange: undefined,
    skuName: undefined,
    netWeight: undefined,
    packSpec: undefined,
    status: undefined,
  },
  rules: {
    spuId: [
      { required: true, message: "SPU ID，关联formula_spu.spu_id不能为空", trigger: "blur" }
    ],
  }
})

const { quewgParams, form, rules } = toRefs(data)

/** 查询奶粉SKU列表 */
function getList() {
  loading.value = true
  listFormulaSku(quewgParams.value).then(response => {
    formulaSkuList.value = response.rows
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
    skuId: null,
    spuId: null,
    formulaStage: null,
    ageRange: null,
    skuName: null,
    netWeight: null,
    packSpec: null,
    status: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  }
  proxy.resetForm("formulaSkuRef")
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
  ids.value = selection.map(item => item.skuId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加奶粉SKU"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _skuId = row.skuId || ids.value
  getFormulaSku(_skuId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改奶粉SKU"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["formulaSkuRef"].validate(valid => {
    if (valid) {
      if (form.value.skuId != null) {
        updateFormulaSku(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addFormulaSku(form.value).then(() => {
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
  const _skuIds = row.skuId || ids.value
  proxy.$modal.confirm('是否确认删除奶粉SKU编号为"' + _skuIds + '"的数据项？').then(function() {
    return delFormulaSku(_skuIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('formula/formulaSku/export', {
    ...quewgParams.value
  }, `formulaSku_${new Date().getTime()}.xlsx`)
}

getList()
</script>

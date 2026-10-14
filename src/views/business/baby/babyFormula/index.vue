<template>
  <div class="app-container">
    <el-form :model="quewgParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="宝宝ID" prop="babyId">
        <el-input
          v-model="quewgParams.babyId"
          placeholder="请输入宝宝ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="奶粉SKU ID，关联formula_sku.sku_id" prop="skuId">
        <el-input
          v-model="quewgParams.skuId"
          placeholder="请输入奶粉SKU ID，关联formula_sku.sku_id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否当前默认使用" prop="isDefault">
        <el-input
          v-model="quewgParams.isDefault"
          placeholder="请输入是否当前默认使用"
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
          v-hasPermi="['baby:babyFormula:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['baby:babyFormula:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['baby:babyFormula:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['baby:babyFormula:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="babyFormulaList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键ID" align="center" prop="id" />
      <el-table-column label="宝宝ID" align="center" prop="babyId" />
      <el-table-column label="奶粉SKU ID，关联formula_sku.sku_id" align="center" prop="skuId" />
      <el-table-column label="是否当前默认使用" align="center" prop="isDefault" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['baby:babyFormula:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['baby:babyFormula:remove']">删除</el-button>
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

    <!-- 添加或修改宝宝使用奶粉关联对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="babyFormulaRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="宝宝ID" prop="babyId">
              <el-input v-model="form.babyId" placeholder="请输入宝宝ID" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="奶粉SKU ID，关联formula_sku.sku_id" prop="skuId">
              <el-input v-model="form.skuId" placeholder="请输入奶粉SKU ID，关联formula_sku.sku_id" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否当前默认使用" prop="isDefault">
              <el-input v-model="form.isDefault" placeholder="请输入是否当前默认使用" />
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

<script setup name="BabyFormula">
import { listBabyFormula, getBabyFormula, delBabyFormula, addBabyFormula, updateBabyFormula } from "@/api/business/baby/babyFormula"

const { proxy } = getCurrentInstance()

const babyFormulaList = ref([])
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
    babyId: undefined,
    skuId: undefined,
    isDefault: undefined,
    status: undefined,
  },
  rules: {
    babyId: [
      { required: true, message: "宝宝ID不能为空", trigger: "blur" }
    ],
    skuId: [
      { required: true, message: "奶粉SKU ID，关联formula_sku.sku_id不能为空", trigger: "blur" }
    ],
  }
})

const { quewgParams, form, rules } = toRefs(data)

/** 查询宝宝使用奶粉关联列表 */
function getList() {
  loading.value = true
  listBabyFormula(quewgParams.value).then(response => {
    babyFormulaList.value = response.rows
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
    id: null,
    babyId: null,
    skuId: null,
    isDefault: null,
    status: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  }
  proxy.resetForm("babyFormulaRef")
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
  ids.value = selection.map(item => item.id)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加宝宝使用奶粉关联"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _id = row.id || ids.value
  getBabyFormula(_id).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改宝宝使用奶粉关联"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["babyFormulaRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateBabyFormula(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addBabyFormula(form.value).then(() => {
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
  const _ids = row.id || ids.value
  proxy.$modal.confirm('是否确认删除宝宝使用奶粉关联编号为"' + _ids + '"的数据项？').then(function() {
    return delBabyFormula(_ids)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('baby/babyFormula/export', {
    ...quewgParams.value
  }, `babyFormula_${new Date().getTime()}.xlsx`)
}

getList()
</script>

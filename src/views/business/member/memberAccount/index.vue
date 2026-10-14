<template>
  <div class="app-container">
    <el-form :model="quewgParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="微信openid" prop="openid">
        <el-input
          v-model="quewgParams.openid"
          placeholder="请输入微信openid"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="微信unionid" prop="unionid">
        <el-input
          v-model="quewgParams.unionid"
          placeholder="请输入微信unionid"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickName">
        <el-input
          v-model="quewgParams.nickName"
          placeholder="请输入用户昵称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="头像地址" prop="avatar">
        <el-input
          v-model="quewgParams.avatar"
          placeholder="请输入头像地址"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input
          v-model="quewgParams.phone"
          placeholder="请输入手机号码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户性别" prop="gender">
        <el-input
          v-model="quewgParams.gender"
          placeholder="请输入用户性别"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="最后登录IP" prop="loginIp">
        <el-input
          v-model="quewgParams.loginIp"
          placeholder="请输入最后登录IP"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="最后登录时间" prop="loginDate">
        <el-date-picker clearable
          v-model="quewgParams.loginDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择最后登录时间">
        </el-date-picker>
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
          v-hasPermi="['member:memberAccount:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['member:memberAccount:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['member:memberAccount:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['member:memberAccount:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="memberAccountList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="用户ID" align="center" prop="userId" />
      <el-table-column label="微信openid" align="center" prop="openid" />
      <el-table-column label="微信unionid" align="center" prop="unionid" />
      <el-table-column label="用户昵称" align="center" prop="nickName" />
      <el-table-column label="头像地址" align="center" prop="avatar" />
      <el-table-column label="手机号码" align="center" prop="phone" />
      <el-table-column label="用户性别" align="center" prop="gender" />
      <el-table-column label="账号状态" align="center" prop="status" />
      <el-table-column label="最后登录IP" align="center" prop="loginIp" />
      <el-table-column label="最后登录时间" align="center" prop="loginDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.loginDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['member:memberAccount:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['member:memberAccount:remove']">删除</el-button>
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

    <!-- 添加或修改小程序用户对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="memberAccountRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="微信openid" prop="openid">
              <el-input v-model="form.openid" placeholder="请输入微信openid" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="微信unionid" prop="unionid">
              <el-input v-model="form.unionid" placeholder="请输入微信unionid" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="用户昵称" prop="nickName">
              <el-input v-model="form.nickName" placeholder="请输入用户昵称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="头像地址" prop="avatar">
              <el-input v-model="form.avatar" placeholder="请输入头像地址" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入手机号码" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="用户性别" prop="gender">
              <el-input v-model="form.gender" placeholder="请输入用户性别" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="删除标志" prop="delFlag">
              <el-input v-model="form.delFlag" placeholder="请输入删除标志" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="最后登录IP" prop="loginIp">
              <el-input v-model="form.loginIp" placeholder="请输入最后登录IP" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="最后登录时间" prop="loginDate">
              <el-date-picker clearable
                v-model="form.loginDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择最后登录时间">
              </el-date-picker>
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

<script setup name="MemberAccount">
import { listMemberAccount, getMemberAccount, delMemberAccount, addMemberAccount, updateMemberAccount } from "@/api/business/member/memberAccount"

const { proxy } = getCurrentInstance()

const memberAccountList = ref([])
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
    openid: undefined,
    unionid: undefined,
    nickName: undefined,
    avatar: undefined,
    phone: undefined,
    gender: undefined,
    status: undefined,
    loginIp: undefined,
    loginDate: undefined,
  },
  rules: {
    openid: [
      { required: true, message: "微信openid不能为空", trigger: "blur" }
    ],
  }
})

const { quewgParams, form, rules } = toRefs(data)

/** 查询小程序用户列表 */
function getList() {
  loading.value = true
  listMemberAccount(quewgParams.value).then(response => {
    memberAccountList.value = response.rows
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
    userId: null,
    openid: null,
    unionid: null,
    nickName: null,
    avatar: null,
    phone: null,
    gender: null,
    status: null,
    delFlag: null,
    loginIp: null,
    loginDate: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  }
  proxy.resetForm("memberAccountRef")
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
  ids.value = selection.map(item => item.userId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加小程序用户"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _userId = row.userId || ids.value
  getMemberAccount(_userId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改小程序用户"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["memberAccountRef"].validate(valid => {
    if (valid) {
      if (form.value.userId != null) {
        updateMemberAccount(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addMemberAccount(form.value).then(() => {
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
  const _userIds = row.userId || ids.value
  proxy.$modal.confirm('是否确认删除小程序用户编号为"' + _userIds + '"的数据项？').then(function() {
    return delMemberAccount(_userIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('member/memberAccount/export', {
    ...quewgParams.value
  }, `memberAccount_${new Date().getTime()}.xlsx`)
}

getList()
</script>

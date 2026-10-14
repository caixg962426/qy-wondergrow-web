import request from '@/utils/request'

// 查询文档中心文件列表
export function listDocFile(query) {
  return request({
    url: '/doc/docFile/list',
    method: 'get',
    params: query
  })
}

// 查询文档中心文件详细
export function getDocFile(fileId) {
  return request({
    url: '/doc/docFile/' + fileId,
    method: 'get'
  })
}

// 新增文档中心文件
export function addDocFile(data) {
  return request({
    url: '/doc/docFile',
    method: 'post',
    data: data
  })
}

// 修改文档中心文件
export function updateDocFile(data) {
  return request({
    url: '/doc/docFile',
    method: 'put',
    data: data
  })
}

// 删除文档中心文件
export function delDocFile(fileId) {
  return request({
    url: '/doc/docFile/' + fileId,
    method: 'delete'
  })
}

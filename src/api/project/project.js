import request from '@/utils/request'

export default {
  getProjectPage(current,limit,projectQuery) {
    return request({
      url: `/projectservice/pageProjectCondition/${current}/${limit}`,
      method: 'post',
      data: projectQuery
    })
  }
}


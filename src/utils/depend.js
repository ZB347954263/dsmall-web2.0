// 获取权限
import utils from '@/utils/utils';
import axios from '@/utils/axios';
import api from '@/api/base.api';

let depend = {
  // 获取权限list
  getPermission(options = {}) {
    const defaults = { silence: true, backself: true };
    // silence是否静默加载
    // backself请求出错是否resolve
    options = { ...defaults, ...options };

    return new Promise((resolve, reject) => {
      const userData = utils.getLocalItem('userData');
      let perResult = axios({
        method: 'POST',
        url: api.queryUserMenuListTree,
        data: { userId: userData.id },
        ...options
      });

      perResult.then(response => {
        const resData = response.data || [];
        let result = {
          menuTree: resData, // 树形菜单结构数据
          permissionList: [] // 平行结构权限
        };
        // 递归循环 获取permission
        function loopTree(list) {
          list.forEach(item => {
            if (item.menuLevel === 4) {
              result.permissionList.push(item.permission);
            }
            item.children = item.children || [];
            if (item.children.length > 0) {
              loopTree(item.children);
            }
          });
        }
        loopTree(resData);
        resolve(result);
      });
      perResult.catch(error => {
        // 也可以跳转至定制页面 window.location.href = './static/500.html';
        if (options.isBackError) {
          resolve({ error: true, message: error });
        } else {
          reject({ error: true, message: error });
        }
      });
    });
  }
};
export default depend;

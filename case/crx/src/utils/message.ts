import { ElMessageBox } from 'element-plus'
import { SYSTEM_EL_ID } from '@/constants'
export function messageBox(
  title: string,
  message: string,
  type: any = 'warning',
  showCancelButton: boolean = false,
  confirmButtonText: string = '确认',
  cancelButtonText: string = '取消',
  cancelCallback?: Function,
  confirmCallback?: Function
) {
  return new Promise((resolve, reject) => {
    ElMessageBox.confirm(message, title, {
      confirmButtonText,
      cancelButtonText,
      showCancelButton,
      type,
      appendTo: `#${SYSTEM_EL_ID}`,
    })
      .then((data) => {
        confirmCallback && confirmCallback()
        resolve(data)
      })
      .catch((err) => {
        cancelCallback && cancelCallback()
        reject(err)
      })
  })
}

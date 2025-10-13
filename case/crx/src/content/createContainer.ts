import { SYSTEM_EL_ID } from '@/constants'

function createContainer() {
  const appDiv = document.createElement('div')
  appDiv.id = SYSTEM_EL_ID
  document.body.appendChild(appDiv)
}

createContainer()

import { all, takeEvery } from 'redux-saga/effects'
import { AppModule } from 'modules/app-module'
import UIkit from 'uikit'

export function * AppSagas () {
  yield all([helloSaga()])
  yield takeEvery(AppModule.actions.fetchNotice, launchNotificationUi)
}

function * helloSaga () {
  console.log('Hello Sagas!')
}

function * launchNotificationUi (action) {
  UIkit.notification(action.payload)
}

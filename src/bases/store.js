import { combineReducers, configureStore, getDefaultMiddleware } from 'redux-starter-kit'

// Middlewares.
import createSagaMiddleware from 'redux-saga'
import { AppLogger } from 'middlewares/app-logger'
import { AppSagas }  from 'middlewares/app-sagas'

// Modules.
import { AppModule } from 'modules/app-module'
import { MessageModule } from 'modules/message-module'
import { UserModule } from 'modules/user-module'

// Exporting Store as global state, and Saga as global worker.
export const Saga  = createSagaMiddleware()
export const Store = configureStore({
  reducer: combineReducers({
    app: AppModule.reducer,
    user: UserModule.reducer,
    message: MessageModule.reducer,
    /**
     * Adding domain modules if extends.
     *
     * user:    UserModule.reducer,
     * article: ArticleModule.reducer,
     */
  }),
  middleware: (process.env.NODE_ENV === 'development')
    ? [...getDefaultMiddleware(), Saga, AppLogger]
    : [...getDefaultMiddleware(), Saga],
  preloadedState: {
    app: {
      websocketApi: 'wss://' + document.body.dataset.domain + '/ws',
      loggedUserId: Number(document.body.dataset.loggedUserId),
    },
  },
})

// Run workers launching always on entire app.
Saga.run(AppSagas)

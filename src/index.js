import '@babel/polyfill'
import 'whatwg-fetch'
import 'url-polyfill'
import 'intersection-observer'
import smoothscroll from 'smoothscroll-polyfill'
import UIkit from 'uikit'
import Icons from 'uikit/dist/js/uikit-icons'

// Execute polyfills.
smoothscroll.polyfill()

// Using uikit icons.
UIkit.use(Icons)

import React from 'react'
import { render } from 'react-dom'

import './static/css/main.css'
import './static/css/common.less'

class Hello extends React.Component {
    render() {
        return (
           <div> <p>hello world123456</p> </div>
        )
    }
}

render(
    <Hello/>,
    document.getElementById('app')
)

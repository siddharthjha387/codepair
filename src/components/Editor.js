import React, { useEffect } from 'react';

import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/darcula.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/edit/closetag'
import './Editor.css'

export const Editor = () => {
    useEffect(() => {
      async function init(){
        Codemirror.fromTextArea(document.getElementById('realtimeEditor'),{
            mode:{name:'javascript',json:true},
            theme:'darcula',
            autoCloseTags:true,
            autoCloseBrackets:true,
            lineNumbers:true,

        });
      }
      init();
    }, []);
    
  return (
    <textarea id='realtimeEditor'></textarea>
  )
}

import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './quill.css';
import styled from 'styled-components'

const Placeholder = styled.div`
  position: absolute;
  display:flex;
  top: 220px;
  height:0px;
  z-index: 1;
  font-size: 1.2rem;
  user-select:none;
  color:#808080;

  @media only screen and (max-width: 760px) {
    top: 135px;
    font-size: 0.9rem;
  }
`

function Quill() {
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'link', 'image',
    'align', 'color', 'background',
  ]
  const modules = {
    toolbar: {
      container: [
        [{header:"1"},{header:"2"}],
        ['bold','underline','strike'],
        ['link']
      ]
    },
  }

  const [value, setValue] = useState('')

  useEffect(()=>{
    console.log(value)
  },[value])

  return (
    <div className='container'>
      <input className='title' placeholder='제목을 입력하세요'></input>
      {
        value == '' || value == '<p><br></p>' || value == '<h1><br></h1>' || value == '<h2><br></h2>'
        ? <Placeholder>작성</Placeholder>
        : null
      }
      <ReactQuill
        theme="snow"
        modules={modules} 
        formats={formats} 
        value={value || ''} 
        onChange={(content, delta, source, editor) => {
          setValue(content);
          sessionStorage.setItem('text',content)
        }}/>
    </div>
  )
}

export default Quill
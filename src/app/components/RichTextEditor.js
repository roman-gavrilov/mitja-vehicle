import React from 'react';
import dynamic from 'next/dynamic';

// Import Quill dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

const RichTextEditor = ({ value, onEditorChange }) => {
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  const handleChange = (content) => {
    if (onEditorChange) {
      onEditorChange(content);
    }
  };

  return (
    <div>
      <ReactQuill 
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        style={{height: '300px'}}
      />
    </div>
  );
};

export default RichTextEditor;

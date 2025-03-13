import React, { useRef } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBold,
  faItalic,
  faUnderline,
  faListUl,
  faListOl,
} from "@fortawesome/free-solid-svg-icons";

const TextEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);

  const handleCommand = (command) => {
    document.execCommand(command, false, null);
  };

  const handleInput = () => {
    onChange(editorRef.current.innerHTML);
  };

  return (
    <EditorContainer>
      <Toolbar>
        <button onClick={() => handleCommand("bold")}>
          <FontAwesomeIcon icon={faBold} />
        </button>
        <button onClick={() => handleCommand("italic")}>
          <FontAwesomeIcon icon={faItalic} />
        </button>
        <button onClick={() => handleCommand("underline")}>
          <FontAwesomeIcon icon={faUnderline} />
        </button>
        <button onClick={() => handleCommand("insertUnorderedList")}>
          <FontAwesomeIcon icon={faListUl} />
        </button>
        <button onClick={() => handleCommand("insertOrderedList")}>
          <FontAwesomeIcon icon={faListOl} />
        </button>
      </Toolbar>
      <EditorContent
        ref={editorRef}
        contentEditable="true"
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </EditorContainer>
  );
};

export default TextEditor;

// Styled Components
const EditorContainer = styled.div`
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Toolbar = styled.div`
  display: flex;
  background: #f3f3f3;
  padding: 5px;
  border-bottom: 1px solid #ccc;

  button {
    background: none;
    border: none;
    cursor: pointer;
    margin: 0 5px;
    font-size: 16px;
    color: #333;
    padding: 5px;

    &:hover {
      color: #ff9800;
    }
  }
`;

const EditorContent = styled.div`
  min-height: 150px;
  padding: 10px;
  outline: none;
`;

import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import Script from "react-load-script";
import {
    CUSTOM_GRADE_2_3_TOOLBAR,
    CUSTOM_GRADE_4_TOOLBAR,
    CUSTOM_GRADE_5_TOOLBAR,
    CUSTOM_GRADE_6_TOOLBAR,
    CUSTOM_GRADE_7_8_TOOLBAR
} from "../../../utils/constants/editors";

const WirisEditor = (props) => {
  const editorContainerRef = useRef(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const [editorInstance, setEditorInstance] = useState(null); 
  const [config, setConfig] = useState(null);

  useEffect(() => {
    if (props?.toolbarGrade) {
      let toolbar;
      switch (props.toolbarGrade) {
        case 4:
          toolbar = CUSTOM_GRADE_4_TOOLBAR;
          break;
        case 5:
          toolbar = CUSTOM_GRADE_5_TOOLBAR;
          break;
        case 6:
          toolbar = CUSTOM_GRADE_6_TOOLBAR;
          break;
        case 7:
        case 8:
          toolbar = CUSTOM_GRADE_7_8_TOOLBAR;
          break;
        default:
          toolbar = CUSTOM_GRADE_2_3_TOOLBAR;
          break;
      }
      setConfig({
        language: "en",
        toolbar,
      });
      
    }
    else
    {
      setConfig({
        language: "en",
        'readOnly': true,
        'toolbarHidden': true,
      });
    }
  }, [props.toolbarGrade]);

  

  useEffect(() => {
    if (editorInstance && props?.initialContent) {
      editorInstance.setMathML(props?.initialContent)
      setEditorContent(props?.initialContent);
    }
  }, [props?.initialContent, editorInstance]);

  useEffect(() => {
    if (scriptLoaded && config) {
      const newEditorInstance = com.wiris.jsEditor.JsEditor.newInstance(config);
      //const editorModel = newEditorInstance.getEditorModel();
      
      //console.log(editorModel);
      // function testListener(eventType, eventData) {
      //   console.log(eventType);
      //   console.log(eventData);
      // }
      
      newEditorInstance.getEditorModel().addEditorListener({contentChanged: {handleEditorContentChange}});

      newEditorInstance.insertInto(editorContainerRef.current);
      setEditorInstance(newEditorInstance);

      // return () => {
      //   editorModel.removeEditorListener("contentChanged", testListener);
      // }

    }
  }, [scriptLoaded, config]);

  const handleScriptLoad = () => {
    setScriptLoaded(true);
  };

  const handleEditorContentChange = () => {
    if (editorInstance) {
      const newEditorContent = editorInstance.getMathML();
      setEditorContent(newEditorContent);
      props.onContentChange(newEditorContent);
    }
  };

  const handleCancel = () => {
    if (editorInstance) {
      editorInstance.setMathML(editorContent);
    }
  };

  return (
    <>
      <Script url="https://www.wiris.net/demo/editor/editor" onLoad={handleScriptLoad} />
      <div ref={editorContainerRef}></div>
      {props?.toolbarGrade ? (
      <Row className="flex-align-left">

        <Button 
          className="m-1 ml-3"
          onClick={handleEditorContentChange}
        >
          Save Work
        </Button>
        <Button 
          className="m-1"
          variant="outline-primary"
          onClick={handleCancel}
        >
          Cancel
        </Button>

      </Row>) : null}
    </>
  );
};

export default WirisEditor;
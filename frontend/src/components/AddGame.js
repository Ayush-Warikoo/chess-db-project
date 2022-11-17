import React, { useState, useMemo, useCallback } from "react";
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { Container } from '@mui/system';
import { Button, Typography } from "@mui/material";

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};

const focusedStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};


function AddGame() {
    const [files, setFiles] = useState();

    const onDrop = useCallback((acceptedFiles) => {
        console.log(acceptedFiles);
        setFiles(acceptedFiles);
    }, [])

    const {
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject,
        acceptedFiles
    } = useDropzone({ onDrop });

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isFocused ? focusedStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isFocused,
        isDragAccept,
        isDragReject
    ]);

    function handleSubmit(event) {
        for (const file of files) {
            event.preventDefault();
            const url = 'http://localhost:5000/addGame';
            var reader = new FileReader();

            reader.onload = function (event) {
                axios.post(url, { "str": event.target.result }).then(function (response) {
                    console.log(response);
                })
            };

            reader.readAsText(file);
        }
    }

    const uploadedFileList = acceptedFiles.map(file => (
        <li key={file.path}>
            {file.path} - {file.type} - {file.size} bytes
        </li>
    ));

    return (
        <div className="AddGame" style={{ marginTop: '20px' }}>
            <Container maxWidth="lg">
                <Typography variant="h6" component="h2">
                    Add a game
                </Typography>
                <div {...getRootProps({ style })}>
                    <input {...getInputProps()} />
                    <p>Drag 'n' drop some files here, or click to select files</p>
                    <ul>{uploadedFileList}</ul>
                </div>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    style={{ margin: '10px 0px', padding: '10px' }}
                >
                    Submit Games
                </Button>
            </Container>
        </div>
    );
}

export default AddGame;
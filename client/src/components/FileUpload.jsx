import React from 'react'
import {useState} from 'react';
import axios from "axios";
import "./FileUpload.css";
const FileUpload = ({contract,account,provider}) => {
  const [file,setFile] = useState(null);
  const [fileName , setFileName] = useState("No image selected");
  const handleSubmit = async(e)=>{
    e.preventDefault();
    if(file){
      try{
        const formData = new FormData();
        formData.append("file",file);
        console.log("upload 1")
        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `5b48900ff34bf13e1b48`,
            pinata_secret_api_key: `9e06f69e7bc9f31928b4acdd0bee80d7e4ac33c9b814ee7607afe6cc8e3b330c`,
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("upload2")
        const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
        //const signer = contract.connect(provider.getSigner());
        contract.add(account,ImgHash);
        alert("Successfully image upload");
        setFileName("No image selected");
        setFile(null)
      }catch(e){
        alert("Unable to upload image to pinata")
      }
    }
  }
  const retrieveFile = (e)=>{
    const data = e.target.files[0]; //files array of files object
    //console.log(data);
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend=()=>{
      setFile(e.target.files[0]);
    }
    setFileName(e.target.files[0].name)
    e.preventDefault();
  }
  return (
    <div className='top'>
      <form className='form' onSubmit={handleSubmit}>
        <label htmlFor='file-upload' className='choose'>
          Choose Image
        </label>
        <input disabled={!account} type='file' id='file-upload' name='data' onChange={retrieveFile}/>
        <span className='textArea'>Image: {fileName}</span>
        <button type='submit' className='upload' disabled={!file}>Upload File</button>
      </form>
    </div>
  )
}

export default FileUpload
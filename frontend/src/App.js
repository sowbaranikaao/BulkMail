import { useState } from 'react';
import axios from 'axios';
import * as XLSX from "xlsx";

function App() {
  const[msg,setmsg]=useState("");
  const[status,setstatus]=useState(false);
  const [emailList,setEmailList]=useState([]);
  function handlemsg(e){
    setmsg(e.target.value);
  }
 function send(){
  setstatus(true)
  axios.post("http://localhost:5000/sendmail",{msg:msg,emailList:emailList})
  .then(function(data){
    if(data.data === true){
      alert("Email sent successfully");
      setstatus(false)
    }else{
      alert("Failed")
    }
  })
 } 
 function handlefile(event){
  const file=event.target.files[0]
  console.log(file)
    const reader=new FileReader()
    reader.onload=function(event){
        const data=event.target.result
        const workbook=XLSX.read(data,{type:"binary"})
        const sheetName=workbook.SheetNames[0]
        const worksheet=workbook.Sheets[sheetName]
        const emailList=XLSX.utils.sheet_to_json(worksheet,{header:'A'})
        const totalemail=emailList.map(function(item){return item.A})
        setEmailList(totalemail)
    }

    reader.readAsBinaryString(file)
 }
  return (
    <div>
      <div className="bg-violet-950 text-white text-center">
        <h1 className=' text-4xl px-5 py-5 font-medium'>BulkMail</h1>
      </div>
      <div className="bg-violet-800 text-white text-center">
        <h1 className='text-xl px-5 py-5 font-medium'>
          We can help you send bulk emails easily!
        </h1>
      </div>
      <div className="bg-violet-600 text-white text-center">
        <h1 className='text-xl px-5 py-5 font-medium'>Drag and Drop</h1>
      </div>
      <div className="bg-violet-400 text-black items-center flex flex-col p-5">
        <textarea onChange={handlemsg} value={msg} placeholder='Enter the email text...' className='h-36  w-[80%] border py-2 px-2 border-black rounded-md'></textarea>
      <div>
        <input onChange={handlefile} type="file" className='text-lg border-4 border-dashed border-white p-4 m-5'/>
      
      </div>
      <p className='text-lg'>Total Emails in the file: {emailList.length}</p>
      <button onClick={send}className='text-lg font-medium bg-violet-950 
      py-2 px-2 mt-3 rounded-md text-white w-fit'>{status?"Sending...":"Send"}</button>
      </div>
      <div className="bg-violet-300 text-white text-center p-10"> 
      </div>
      <div className="bg-violet-200 text-white text-center p-8"> 
      </div>
      <div className="bg-violet-100 text-white text-center p-8">
      </div>
    </div>
  );
}

export default App;

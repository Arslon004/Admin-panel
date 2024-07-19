import { Button, Flex, Image, Modal, Space, Table } from "antd";
import { Fragment, useEffect, useState } from "react"
import request from "../server";

const TeachersPage = () => {
  const [teachers,setTeachers]=useState([]);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(()=>{
    try{
      setLoading(true);
      const getTeachers = async ()=>{
        let {data}=await request.get('teacher');
        setTeachers(data.map((teacher,index)=>({...teacher,key:index})));
      }
      getTeachers()
    }catch(err){
      console.log(err);
      setError(err);
    }finally{
      setLoading(false);
    }
  },[])
  const columns = [
    {
      title: 'Image',
      dataIndex: 'avatar',
      key: 'avatar',
      render:(data)=>(<Image width={50} height={50} src={data}/>)
    },
    {
      title: 'Firstname',
      dataIndex: 'firstName',
      key: 'firstName',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Lastname',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Phone number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Is Married',
      dataIndex: 'isMarried',
      key: 'isMarried',
      render:(data)=>(data ? "Yes" : "No")
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Space size="middle">
         <Button type="primary">Edit</Button>
         <Button type="primary" danger>Delete</Button>
        </Space>
      ),
    },
  ];

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Fragment>
      <Table
      title={()=>(
        <Flex justify="space-between" align="center">
          <h1 >Teachers</h1>
          <Button type="dashed" onClick={showModal}>Add teacher</Button>
        </Flex>
      )}
       loading={loading} dataSource={teachers} columns={columns} />;
        <Modal
        title="Teacher data"
         open={isModalOpen}
          onOk={handleOk}
          okText="Add teacher"
           onCancel={closeModal}>

      </Modal>
    </Fragment>
  )
}

export default TeachersPage
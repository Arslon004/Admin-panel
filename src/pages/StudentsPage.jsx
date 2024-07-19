import { Fragment, useEffect, useState } from "react";
import request from "../server";
import { useParams } from "react-router-dom";
import { Button, Image, Modal, Space, Table, Checkbox, Form, Input } from 'antd';
import { useForm } from "antd/es/form/Form";

const StudentsPage = () => {
  const { id } = useParams();
  const [form] = useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getStudents();
  }, [id]);

  const getStudents = async () => {
    try {
      setLoading(true);
      const { data } = await request.get(`/teacher/${id}/student`);
      setStudents(data.map((student, index) => ({ ...student, key: index })));
    } catch (error) {
      setError(error);
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const editStudent = async (studentId) => {
    try {
      setSelected(studentId);
      const { data } = await request.get(`/teacher/${id}/student/${studentId}`);
      form.setFieldsValue(data);
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteStudent = (studentId) => {
    Modal.confirm({
      title: 'Do you want to delete ?',
      onOk: async () => {
        try {
          await request.delete(`/teacher/${id}/student/${studentId}`);
          getStudents();
        } catch (err) {
          console.log(err);
        }
      }
    });
  }

  const columns = [
    {
      title: 'Image',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (data) => <Image width={50} height={50} src={data} />
    },
    {
      title: 'Firstname',
      dataIndex: 'firstName',
      key: 'firstName',
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
      title: 'Is work',
      dataIndex: 'isWork',
      key: 'isWork',
      render: (data) => data ? "Yes" : "No"
    },
    {
      title: 'Action',
      key: 'action',
      dataIndex: "id",
      render: (id) => (
        <Space size="middle">
          <Button type="primary" onClick={() => editStudent(id)}>Edit</Button>
          <Button type="primary" danger onClick={() => deleteStudent(id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  const showModal = () => {
    setSelected(null);
    setIsModalOpen(true);
    form.resetFields();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (selected === null) {
        await request.post(`/teacher/${id}/student`, values);
      } else {
        await request.put(`/teacher/${id}/student/${selected}`, values);
      }
      getStudents();
      setIsModalOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Fragment>
      <Table
        title={() => (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h1>Students ({students.length})</h1>
            <Button type="dashed" onClick={showModal}>Add Student</Button>
          </div>
        )}
        loading={loading}
        dataSource={students}
        columns={columns}
      />
      <Modal
        title="Student data"
        open={isModalOpen}
        onOk={handleOk}
        okText="Add student"
        onCancel={closeModal}
      >
        <Form
          form={form}
          name="student"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          initialValues={{ remember: true }}
          autoComplete="off"
        >
          <Form.Item
            label="Image url"
            name="avatar"
            rules={[{ required: true, message: 'Please input the image URL!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="First name"
            name="firstName"
            rules={[{ required: true, message: 'Please input the first name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Last name"
            name="lastName"
            rules={[{ required: true, message: 'Please input the last name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Phone number"
            name="phoneNumber"
            rules={[{ required: true, message: 'Please input the phone number!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="isWork"
            valuePropName="checked"
            wrapperCol={{ span: 24 }}
          >
            <Checkbox>Is work</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default StudentsPage;

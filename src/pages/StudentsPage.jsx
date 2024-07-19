import { Fragment, useEffect, useState } from "react";
import request from "../server";
import { useParams } from "react-router-dom";
import { Button, Image, Modal, Space, Table, Checkbox, Form, Input, Select } from 'antd';
import { useForm } from "antd/es/form/Form";

const StudentsPage = () => {
  const { id } = useParams();
  const [form] = useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState(id);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  useEffect(() => {
    fetchTeachers();
    if (selectedTeacherId) {
      getStudents();
    }
  }, [selectedTeacherId]);

  const fetchTeachers = async () => {
    try {
      const { data } = await request.get('teacher');
      setTeachers(data.map((teacher) => ({ id: teacher.id, name: `${teacher.firstName} ${teacher.lastName}` })));
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const getStudents = async () => {
    try {
      setLoading(true);
      const { data } = await request.get(`/teacher/${selectedTeacherId}/student`);
      setStudents(data.map((student, index) => ({ ...student, key: index })));
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTeacherChange = (teacherId) => {
    setSelectedTeacherId(teacherId);
  };

  const editStudent = async (studentId) => {
    try {
      setSelectedStudentId(studentId);
      const { data } = await request.get(`/teacher/${selectedTeacherId}/student/${studentId}`);
      form.setFieldsValue(data);
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteStudent = (studentId) => {
    Modal.confirm({
      title: 'Do you want to delete?',
      onOk: async () => {
        try {
          await request.delete(`/teacher/${selectedTeacherId}/student/${studentId}`);
          getStudents();
        } catch (err) {
          console.error(err);
        }
      }
    });
  };

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
    setSelectedStudentId(null);
    setIsModalOpen(true);
    form.resetFields();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (selectedStudentId === null) {
        await request.post(`/teacher/${selectedTeacherId}/student`, values);
      } else {
        await request.put(`/teacher/${selectedTeacherId}/student/${selectedStudentId}`, values);
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h1>Students ({students.length})</h1>
        <div>
          <Select
            style={{ width: 200 }}
            value={selectedTeacherId}
            onChange={handleTeacherChange}
            placeholder="Select a teacher"
          >
            {teachers.map(teacher => (
              <Select.Option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </Select.Option>
            ))}
          </Select>
          <Button style={{marginLeft:"15px"}} type="dashed" onClick={showModal}>Add Student</Button>
        </div>
      </div>
      <Table
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
            label="Image URL"
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

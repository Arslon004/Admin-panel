import { Button, Flex, Image, Modal, Space, Table, Checkbox, Form, Input } from "antd";
import { Fragment, useEffect, useState } from "react"
import request from "../server";
import { useForm } from "antd/es/form/Form";
import { Link } from "react-router-dom";

const TeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [form] = useForm();

  useEffect(() => {
    getTeachers()

  }, []);

  const getTeachers = async () => {
    try {
      setLoading(true);
      let { data } = await request.get('teacher');
      setTeachers(data.map((teacher, index) => ({ ...teacher, key: index })));
    }
    catch (err) {
      console.log(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  const editTeacher = async (id) => {
    try {
      setSelected(id)
      setIsModalOpen(true);
      let { data } = await request.get(`teacher/${id}`);
      form.setFieldsValue(data);
    } catch (err) {
      console.log(err);
    }
  }

  const deleteTeacher = (id) => {

    Modal.confirm({
      title: 'Do you want to delete ?',
      onOk: async () => {
        try {
          await request.delete(`teacher/${id}`);
          getTeachers();
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
      render: (data) => (<Image width={50} height={50} src={data} />)
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
      title: 'Is Married',
      dataIndex: 'isMarried',
      key: 'isMarried',
      render: (data) => (data ? "Yes" : "No")
    },
    {
      title: 'Action',
      key: 'action',
      dataIndex: "id",
      render: (id) => (
        <Space size="middle">
          <Button type="primary" onClick={() => editTeacher(id)}>Edit</Button>
          <Button type="primary" onClick={() => deleteTeacher(id)} danger>Delete</Button>
          <Link to={`/teacher/${id}/student`} style={{
          backgroundColor: '#faad14',
          color: '#fff',
          padding: '6px 16px',
          borderRadius: '4px',
          textDecoration: 'none',
          display: 'inline-block'
        }}> See students</Link>
        </Space>
      ),
    },
  ];

  const showModal = () => {
    form.resetFields();
    setIsModalOpen(true);
    setSelected(null);
  };
  const handleOk = async () => {
    try {
      setIsModalLoading(true)
      let values = await form.validateFields();
      if (selected === null) {
        await request.post('teacher', values);
      } else {
        await request.put(`teacher/${selected}`, values);
      }
      getTeachers();
      setIsModalOpen(false);
    } catch (err) {
      console.log(err);
    } finally {
      setIsModalLoading(false)
    }
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Fragment>
      <Table
        title={() => (
          <Flex justify="space-between" align="center">
            <h1 >Teachers ({teachers.length})</h1>
            <Button type="dashed" onClick={showModal}>Add teacher</Button>
          </Flex>
        )}
        loading={loading} dataSource={teachers} columns={columns} />;
      <Modal
        title="Teacher data"
        open={isModalOpen}
        onOk={handleOk}
        confirmLoading={isModalLoading}
        okText={selected === null ? "Add teacher" : "Save teacher"}
        onCancel={closeModal}>

        <Form
          form={form}
          name="teacher"
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}
          initialValues={{
            remember: true,
          }}
          autoComplete="off"
        >
          <Form.Item
            label="Image"
            name="avatar"
            rules={[
              {
                required: true,
                message: 'Please input fill!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Firstname"
            name="firstName"
            rules={[
              {
                required: true,
                message: 'Please input fill!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Lastname"
            name="lastName"
            rules={[
              {
                required: true,
                message: 'Please input fill!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Phone number"
            name="phoneNumber"
            rules={[
              {
                required: true,
                message: 'Please input fill!',
              },
            ]}
          >
            <Input />
          </Form.Item>


          <Form.Item
            name="isMarried"
            valuePropName="checked"
            wrapperCol={{
              span: 24,
            }}
          >
            <Checkbox>Is married</Checkbox>
          </Form.Item>
        </Form>


      </Modal>
    </Fragment >
  )
}

export default TeachersPage
import { Button, Result } from "antd"
import { useNavigate } from "react-router-dom"

const NotFoundPage = () => {
  let navigate=useNavigate()
  const login=()=>{
    navigate("/login");
  }
  return (
    <Result
    status="404"
    title="404"
    subTitle="Sorry, the page you visited does not exist."
    extra={<Button onClick={login} type="primary">Back Home</Button>}
  />
  )
}

export default NotFoundPage
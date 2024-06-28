import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/blogs'

let token = null
const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  console.log(token)
  const config = {
    headers: { Authorization: token},
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (id, newObect) => {
  const response = await axios.put(`${baseUrl}/${id}`, newObect)
  return response.data
}

const remove = async (id, auth) => {
  setToken(auth)
  const config = {
    headers: { Authorization: token },
  }

  console.log('auth: ', auth)
  console.log('config', config)
  
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

export default { getAll, create, update, remove, setToken }
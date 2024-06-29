import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import { beforeEach, describe, expect, test } from 'vitest'
import userEvent from '@testing-library/user-event'

const blog = {
  title: 'Blog eg',
  url: 'http://localhost:3000/',
  author: 'ABC',
  likes: 2,
  user: {
    username: 'root',
  }
}

describe('<Blog />', () => {
  let container
  const mockHanlder = vi.fn()

  beforeEach(() => {
    container = render(
      <Blog blog={blog} user={'root'} like={mockHanlder}/>
    ).container
  })

  test('renders content', () => {
    const element = screen.getByText('Blog eg ABC')
    expect(element).toBeDefined()
  })

  test('render content with visibality', () => {
    //console.log(container)
    const element = container.querySelector('.fullblog')
    // console.log('element:', element)
    expect(element).toHaveStyle('display: none')
  })

  test('click to show likes and url', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const element = container.querySelector('.fullblog')
    expect(element).not.toHaveStyle('display: none')
    // screen.debug()
    const urls = screen.getByText('http://localhost:3000/')
    const likes = screen.getByText('likes 2')
    expect(likes).toBeDefined()
    expect(urls).toBeDefined()
  })

  test('click likes', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)
    const like = screen.getByText('like')

    await user.click(like)
    expect(mockHanlder.mock.calls).toHaveLength(1)
    await user.click(like)
    expect(mockHanlder.mock.calls).toHaveLength(2)
  })

})



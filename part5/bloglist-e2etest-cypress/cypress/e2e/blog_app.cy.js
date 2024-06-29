describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://example.cypress.io')
  })
})

describe('Blog app', function() {
  beforeEach(function() {
    // empty the db
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)

    // create a user for the backend
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user) 
    const otheruser = {
      name: 'Matti Luukkainen2',
      username: 'mluukkai2',
      password: 'salainen2'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, otheruser)
    cy.visit('')
  })
  it('Login form is shown', function(){
    cy.visit('')
    cy.contains('log in to application')
  })

  describe('Login', function() {
    it('succeeds with correct credentials direct posting', function() {
      cy.login({ username: 'mluukkai', password: 'salainen' })
      cy.contains('Matti Luukkainen logged in')
    })
    it('succeeds with correct credentials gui', function() {
      cy.contains('log in').click()
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()
      cy.contains('Matti Luukkainen logged in')
    })
    it('fails with wrong credentials gui', function() {
      cy.contains('log in').click()
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()
      
      cy.get('.error')
      .should('contain', 'wrong username or password')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
    cy.contains('Matti Luukkainen logged in').should('not.exist')
    })
  })
  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'mluukkai', password: 'salainen' })
    })

    it('A blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('#title').type('a blog created by cypess')
      cy.get('#author').type('ACNQ')
      cy.get('#url').type('http://sample.com')
      cy.get('#create').click()
      cy.contains('a blog created by cypess')
    })

    it('A blog can be liked', function() {
      cy.contains('create new blog').click()
      cy.createBlogGUI(
        { title: 'a blog created by cypess', 
          author: 'ACNQ', 
          referUrl: 'http://sample.com'
        }
      )
      cy.contains('view').click()
      cy.get('#like').click()
      cy.contains('likes 1')
    })

    it('A blog can be deleted', function(){
      cy.contains('create new blog').click()
      cy.createBlogGUI(
        { title: 'a blog created by cypess', 
          author: 'ACNQ', 
          referUrl: 'http://sample.com'
        }
      )
      cy.contains('view').click()
      cy.get('#remove').click()
      cy.contains('a blog created by cypess ACNQ').should('not.exist')
    })

    it('Ordered by Likes', function() {
      cy.contains('create new blog').click()
      cy.createBlogGUI(
        { title: 'a blog created by cypess', 
          author: 'ACNQ', 
          referUrl: 'http://sample.com'
        }
      )
      cy.contains('a blog created by cypess')
      cy.createBlogGUI(
        { title: 'a liked blog created by cypess', 
          author: 'ACNQ', 
          referUrl: 'http://sample.com'
        }
      )
      cy.contains('a liked blog created by cypess')
  
      cy.get('.blog').eq(0).should('contain', 'a blog created by cypess')
      cy.get('.blog').eq(1).should('contain', 'a liked blog created by cypess')
      cy.get('.view-btn').eq(1).click()
      cy.get('.like-btn').eq(1).click()
      cy.get('.blog').eq(1).should('contain', 'a blog created by cypess')
      cy.get('.blog').eq(0).should('contain', 'a liked blog created by cypess')

    })
  })

  describe('invisibility of remove btn of blogs created by other user', function() {
    it('test invisiblity of remove btn', function() {
      // login as other user
      cy.login({ username: 'mluukkai2', password: 'salainen2' })
      // create a blog
      cy.contains('create new blog').click()
      cy.createBlogGUI(
        { title: 'a blog created by cypess', 
          author: 'ACNQ', 
          referUrl: 'http://sample.com'
        }
      )
      cy.contains('a blog created by cypess')
      // logout
      cy.contains('logout').click()
      // relogin with the org user
      cy.login({ username: 'mluukkai', password: 'salainen' })
      cy.contains('view').click()
      cy.contains('remove').should('not.be.visible')
    }) 
  })
})
const Header = ({ course }) => <h1>{course}</h1>

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) => 
  <div>
    {parts.map(part =>
      <Part key={part.id} part={part} />
    )}
  </div>

const Total = ({ sum }) => 
  <p>
    <b>total of {sum} exercises </b>
  </p>

const Course = ({ course }) => 
  <div>
    <Header course = {course.name} />
    <Content parts={course.parts} />
    <Total sum={course.parts.reduce((sum, part) => sum + part.exercises, 0)}/>
  </div>

export default Course
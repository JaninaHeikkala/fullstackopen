import Header from "./Header";
import Content from "./Content";
import Total from "./Total";

const Course = ({ courses }) => {

  return (
    <>
      <h1>Web development curriculum</h1>
      {courses.map((course) => (
        <div key={course.id}>
          <Header course={course.name}></Header>
          <Content parts={course.parts}></Content>
          <Total sum={course.parts.map(part => part.exercises).reduce((total, current) => total + current, 0)}></Total>
        </div>
      ))}
    </>
  );
}

export default Course
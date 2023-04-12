import React, { useState, useEffect } from 'react';
import { Checkbox } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { Input } from '@chakra-ui/react'


const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [value, setValue] = useState('');

  const fetchTasks = () => {
    fetch('http://localhost:5000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          {
            getAllTasks {
              id
              task
              isDone
            }
          }
        `,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const tasks = data.data.getAllTasks; 
        setTasks(tasks); 
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    fetchTasks()
  }, []);

  const handleDelete = (id) => {
    fetch('http://localhost:5000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation {
            deleteTask(id:${id}) {
              id
              task
              isDone
            }
          }
        `,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        fetchTasks()
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCheck = (id, isDone) => {
    // console.log('clicked')
    console.log(id, isDone)
    fetch('http://localhost:5000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation {
            ${isDone ? "uncheck" : "check"}Task(id:${id}) {
              id
              task
              isDone
            }
          }
        `,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        fetchTasks()
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // console.log(value)
    await fetch('http://localhost:5000/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
              mutation {
                createTask(task: "${value}") {
                  id
                  task
                  isDone
                }
              }
            `,
          }),
        })
          .then((response) => response.json())
          .then(async (data) => {
            fetchTasks(); 
            setValue('');
            })
          .catch((error) => {
            console.log(error);
          });
    console.log('submitted:', value)
    
  }

  const handleChange = (e) => {
    setValue(e.target.value)
  }


  return (
    <div className='list-container'>
      {tasks.map((task) => (
        <div className='task-container' key={task.id}>
          <Checkbox
            onChange={() => handleCheck(task.id, task.isDone)}
            size='md'
            colorScheme='blue'
            className='checkbox'
            isChecked={task.isDone}
          >
            {task.task}
          </Checkbox>
          <DeleteIcon color='red' className='delete-icon' onClick={() => handleDelete(task.id)}/>
        </div>
      ))}

      {/* Adding new task */}
      <form onSubmit={handleSubmit}>
        <Input className='text-input' placeholder='Write a task' value={value} onChange={handleChange} />
    </form>
    </div>
  );
};

export default TaskList;
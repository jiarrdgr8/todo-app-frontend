import React, { useState, useCallback } from "react";
import { List } from "../components/List";
import { AddItem } from "../components/AddItem";
import { Flex, Box } from '@chakra-ui/react'

const initialTodos: Todo[] = [
  {
    text: "Walk the dog",
    complete: false
  },
  {
    text: "Write app",
    complete: true
  }
];

const App = () => {
  const [todos, setTodos] = useState(initialTodos);

  const toggleTodo: ToggleTodo = useCallback(
    (selectedTodo: Todo) => {
      const newTodos = todos.map(todo => {
        if (todo === selectedTodo) {
          return {
            ...todo,
            complete: !todo.complete
          };
        }
        return todo;
      });
      setTodos(newTodos);
    },
    [todos]
  );

  const addTodo: AddTodo = (text: string) => {
    const newTodo = { text, complete: false };
    setTodos([...todos, newTodo]);
  };

  return (
    <Box maxW="27rem" mx="auto" py={12} w="100%" px={3}>
      <Flex align="center" h="100%" justify="flex-start" direction="column">
        <AddItem addTodo={addTodo} />
        <List todos={todos} toggleTodo={toggleTodo} />
      </Flex>
    </Box>
  );
};

export default App;

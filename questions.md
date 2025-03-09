# React Technical Questions

## 1. What is the difference between Component and PureComponent?

Give an example where it might break my app.

Answer:
Think of PureComponent as a smarter version of Component. While a regular Component can be a bit
overeager and re-renders whenever its parent tells it to, PureComponent is more thoughtful - it
first checks if the new props or state are actually different from what it already has.
In React, we have a way to make our components smarter about when they need to update. Instead of updating every time something changes in the parent component, we can use React.memo to make it update only when its own data changes.

Here's a simple example:

```tsx
// This component will update every time its parent updates
const UserCard = ({ name, email }) => {
  return (
    <div className="card">
      <h3>{name}</h3>
      <p>{email}</p>
    </div>
  );
};

// This component will only update when name or email actually changes
const UserCard = React.memo(({ name, email }) => {
  return (
    <div className="card">
      <h3>{name}</h3>
      <p>{email}</p>
    </div>
  );
});
```

## 2. Context + ShouldComponentUpdate might be dangerous. Why is that?

Answer:
When using React's Context (which is like a global data store) with performance optimizations, we need to be careful. If we tell a component not to update based on its props, it might miss important updates from the Context.

Here's a simple example:

```tsx
const ThemeContext = createContext("light");

// This component might miss theme changes
const Button = React.memo(() => {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Click me</button>;
});

// Better way: Only optimize what's expensive
const Button = () => {
  const theme = useContext(ThemeContext);
  // Only the expensive part is memoized
  const buttonContent = useMemo(() => <span>Click me</span>, []);

  return <button className={theme}>{buttonContent}</button>;
};
```

## 3. Describe 3 ways to pass information from a component to its PARENT?

Answer:
There are three main ways a child component can communicate with its parent:

1. Using a simple callback function:

```tsx
// Parent
const TodoList = () => {
  const [todos, setTodos] = useState([]);

  const addTodo = (text) => {
    setTodos([...todos, text]);
  };

  return <AddTodoForm onAdd={addTodo} />;
};

// Child
const AddTodoForm = ({ onAdd }) => {
  const [text, setText] = useState("");

  return (
    <form onSubmit={() => onAdd(text)}>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button>Add Todo</button>
    </form>
  );
};
```

2. Using refs for direct actions:

```tsx
// Parent
const VideoPlayer = () => {
  const videoRef = useRef();

  return (
    <div>
      <Video ref={videoRef} />
      <button onClick={() => videoRef.current?.play()}>Play</button>
    </div>
  );
};

// Child
const Video = forwardRef((props, ref) => {
  return <video ref={ref} {...props} />;
});
```

3. Using shared state (like Redux):

```tsx
// Any component can update the count
const Counter = () => {
  const dispatch = useDispatch();
  return (
    <button
      onClick={() =>
        dispatch({
          type: "INCREMENT",
        })
      }
    >
      Add 1
    </button>
  );
};

// Any component can read the count
const Total = () => {
  const count = useSelector((state) => state.count);
  return <div>Total: {count}</div>;
};
```

## 4. Give 2 ways to prevent components from re-rendering?

Answer:

1. For simple components:

```tsx
// This will re-render only when name changes
const Greeting = React.memo(({ name }) => {
  return <h1>Hello, {name}!</h1>;
});
```

2. For expensive calculations:

```tsx
const TodoList = ({ todos }) => {
  // This calculation will only run when todos changes
  const completedCount = useMemo(() => {
    return todos.filter((todo) => todo.completed).length;
  }, [todos]);

  return <div>Completed: {completedCount}</div>;
};
```

## 5. What is a fragment and why do we need it? Give an example where it might break my app?

Answer:
A Fragment is like an invisible container. We use it when we need to return multiple elements but don't want to add an extra div to our HTML.

```tsx
// Without Fragment - adds extra div
const UserInfo = () => {
  return (
    <div>
      {" "}
      {/* Extra div! */}
      <h2>John Doe</h2>
      <p>Email: john@example.com</p>
    </div>
  );
};

// With Fragment - cleaner HTML
const UserInfo = () => {
  return (
    <>
      <h2>John Doe</h2>
      <p>Email: john@example.com</p>
    </>
  );
};
```

## 6. Give 3 examples of the HOC pattern?

Answer:
Here are three common examples of Higher-Order Components (HOCs):

1. Authentication HOC:

```tsx
const withAuth = (WrappedComponent) => {
  return function WithAuthComponent(props) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return <div>Checking authentication...</div>;
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }

    return <WrappedComponent {...props} />;
  };
};

// Usage
const ProtectedDashboard = withAuth(Dashboard);
```

2. Data Fetching HOC:

```tsx
const withData = (WrappedComponent, fetchData) => {
  return function WithDataComponent(props) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const loadData = async () => {
        try {
          const result = await fetchData();
          setData(result);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    return <WrappedComponent data={data} {...props} />;
  };
};

// Usage
const UserListWithData = withData(UserList, fetchUsers);
```

3. Loading HOC:

```tsx
interface WithLoadingProps {
  isLoading?: boolean;
}

const withLoading = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  return function WithLoadingComponent(props: P & WithLoadingProps) {
    const { isLoading, ...componentProps } = props;

    if (isLoading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner" />
          <p>Loading...</p>
        </div>
      );
    }

    return <WrappedComponent {...(componentProps as P)} />;
  };
};

// Usage
interface UserListProps {
  users: User[];
  onUserSelect: (user: User) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onUserSelect }) => {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id} onClick={() => onUserSelect(user)}>
          {user.name}
        </li>
      ))}
    </ul>
  );
};

const UserListWithLoading = withLoading<UserListProps>(UserList);

// In parent component
const ParentComponent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers().finally(() => setIsLoading(false));
  }, []);

  return (
    <UserListWithLoading
      isLoading={isLoading}
      users={users}
      onUserSelect={handleUserSelect}
    />
  );
};
```

## 7. What's the difference in handling exceptions in promises, callbacks and async...await?

Answer:
Here are all three simple ways to handle errors:

```tsx
// Using try/catch (easiest to understand)
const fetchUser = async (id) => {
  try {
    const response = await fetch(`/api/users/${id}`);
    const user = await response.json();
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
};

// Using then/catch
const fetchUser = (id) => {
  fetch(`/api/users/${id}`)
    .then((response) => response.json())
    .then((user) => console.log(user))
    .catch((error) => console.error(error));
};

// In a React component
const UserProfile = ({ id }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await fetchUser(id);
        setUser(data);
      } catch (error) {
        setError("Could not load user");
      }
    };
    getUser();
  }, [id]);

  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>Loading...</div>;
  return <div>{user.name}</div>;
};
```

## 8. How many arguments does setState take and why is it async?

Answer:
setState takes two arguments:

1. First argument can be either:

   - An object with the new state: `setState({ count: 5 })`
   - A function that returns the new state: `setState(prev => ({ count: prev.count + 1 }))`

2. Second argument (optional):
   - A callback function that runs after the state has been updated
   - Example: `setState({ count: 5 }, () => console.log('State updated!'))`

setState is asynchronous for several reasons:

1. Performance: React batches multiple setState calls together to avoid unnecessary re-renders
2. Consistency: Ensures that all state updates in an event handler complete before re-rendering
3. Concurrency: Allows React to prioritize more important updates

Example showing state updates and async behavior in functional components:

```tsx
const Counter: React.FC = () => {
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);

  // Example 1: Basic state update
  const increment = () => {
    setCount(count + 1);
  };

  // Example 2: Using previous state
  const incrementTwice = () => {
    setCount((prev) => prev + 1); // First update
    setCount((prev) => prev + 1); // Second update using latest state
  };

  // Example 3: Multiple state updates batched together
  const updateBoth = () => {
    setCount((prev) => prev + 1);
    setTotal((prev) => prev + 1);
    // React will batch these updates and re-render once
  };

  // Example 4: Running code after state updates
  useEffect(() => {
    if (count > 0) {
      console.log("Count updated to:", count);
    }
  }, [count]); // This runs after count is actually updated

  return (
    <div>
      <p>Count: {count}</p>
      <p>Total: {total}</p>
      <button onClick={increment}>Add One</button>
      <button onClick={incrementTwice}>Add Two</button>
      <button onClick={updateBoth}>Update Both</button>
    </div>
  );
};
```

## 9. List the steps needed to migrate a Class to Function Component?

Answer:
Here are the steps to migrate from a Class to a Function Component:

1. Change the component declaration:

   - From: `class MyComponent extends React.Component`
   - To: `const MyComponent = (props) => {}`

2. Convert state:

   - From: `state = { count: 0 }`
   - To: `const [count, setCount] = useState(0)`

3. Replace lifecycle methods:

   - `componentDidMount` → `useEffect(() => {}, [])`
   - `componentDidUpdate` → `useEffect(() => {}, [dependencies])`
   - `componentWillUnmount` → `useEffect(() => { return () => {} }, [])`

4. Convert class methods:

   - From: `handleClick = () => {}`
   - To: `const handleClick = useCallback(() => {}, [])`

5. Remove constructor:

   - Move any initialization to function body or useEffect

6. Convert instance variables:

   - From: `this.timer = null`
   - To: `const timerRef = useRef(null)`

7. Remove `this` references:

   - From: `this.state.count`, `this.props.name`
   - To: `count`, `props.name`

8. Update event handlers:

   - From: `this.handleClick`
   - To: `handleClick`

9. Convert context usage:

   - From: `static contextType` or `<Context.Consumer>`
   - To: `const value = useContext(Context)`

10. Update refs:
    - From: `createRef()`
    - To: `useRef()`

Example of a complete migration:

```tsx
// Class Component
class UserProfile extends React.Component {
  state = { name: "", loading: true };

  componentDidMount() {
    this.fetchUser();
  }

  fetchUser = async () => {
    const data = await api.getUser();
    this.setState({ name: data.name, loading: false });
  };

  render() {
    if (this.state.loading) return <div>Loading...</div>;
    return <div>Name: {this.state.name}</div>;
  }
}

// Function Component
const UserProfile = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const data = await api.getUser();
      setName(data.name);
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>;
  return <div>Name: {name}</div>;
};
```

## 10. List a few ways styles can be used with components?

Answer:
Here are a few ways:

```tsx
// 1. Regular CSS
import "./Button.css";
const Button = () => <button className="button">Click me</button>;

// 2. Inline styles
const Button = () => (
  <button
    style={{
      color: "blue",
      padding: "10px",
    }}
  >
    Click me
  </button>
);

// 3. CSS Modules
import styles from "./Button.module.css";
const Button = () => <button className={styles.button}>Click me</button>;
```

## 11. How to render an HTML string coming from the server?

Answer:
Here's the safe way to do it (But we should take care about anything that we render from server as its a security issue so we better do a basic sanitization)

```tsx
const BlogPost = ({ content }) => {
  // Always be careful with HTML from server!
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: content,
      }}
    />
  );
};
```

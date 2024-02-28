import { Code, Layout, Txt, makeScene2D } from "@motion-canvas/2d";
import {
  Color,
  beginSlide,
  chain,
  createRef,
  loop,
  unwrap,
  waitFor,
} from "@motion-canvas/core";
import { CodeBlock } from "@motion-canvas/2d/lib/components/CodeBlock";
import { Colors } from "../Colors";
import { Window, WindowStyle } from "../components/Window";
import { Scrollable } from "../components/Scrollable";
import { Title, Em, Body } from "../components/Body";

export default makeScene2D(function* (view) {
  view.fill(Colors.Tailwind.Slate["900"]);
  const titleRef = createRef<Txt>();
  view.add(
    <Txt
      {...Title}
      opacity={0}
      y={-view.size().y / 2 + unwrap(Title.fontSize) * 1.2}
      ref={titleRef}
    >
      Why should I organize my code?
    </Txt>
  );
  yield* titleRef().opacity(1, 1);

  const codeWindow = createRef<Window>();
  const scrollable = createRef<Scrollable>();
  view.add(
    <Window
      title="My Cool App"
      ref={codeWindow}
      windowStyle={WindowStyle.Windows98}
      x={650}
      y={50}
      width={400}
      height={800}
      scrollable={scrollable}
    >
      <CodeBlock
        fontSize={12}
        // No guarantees on this code working, I just asked ChatGPT for it :)
        code={`\
import express from 'express';
import { Pool } from 'pg';

// Create a new Express application
const app = express();

// Body parser middleware to parse request bodies
app.use(express.json());

// PostgreSQL connection pool
const pool = new Pool({
  user: 'hunter',
  host: 'localhost',
  database: 'app',
  password: 'hunter2',
  port: 5432,
});

// Example route: Home
app.get('/', (req, res) => {
  res.send('Welcome to the Express app with PostgreSQL!');
});

// Example route: Get all items (replace with your actual table name and fields)
app.get('/items', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM items');
    res.json(rows);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Example route: Add a new item (replace with your actual table name and fields)
app.post('/items', async (req, res) => {
  try {
    const { name, description } = req.body;
    const { rows } = await pool.query('INSERT INTO items (name, description) VALUES ($1, $2) RETURNING *', [name, description]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

app.get('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).send('Item not found');
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Example route: Update an item by ID
app.put('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const { rows } = await pool.query('UPDATE items SET name = $1, description = $2 WHERE id = $3 RETURNING *', [name, description, id]);
    if (rows.length === 0) {
      return res.status(404).send('Item not found');
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Example route: Delete an item by ID
app.delete('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('DELETE FROM items WHERE id = $1 RETURNING *', [id]);
    if (rows.length === 0) {
      return res.status(404).send('Item not found');
    }
    res.status(200).send(\`Item with ID \${id} deleted\`);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Example route: Fetch all items with a specific condition (e.g., filter by a column value)
app.get('/items/special/:filterValue', async (req, res) => {
  try {
    const { filterValue } = req.params;
    // Example query that filters items by a hypothetical 'type' column
    const { rows } = await pool.query('SELECT * FROM items WHERE type = $1', [filterValue]);
    res.json(rows);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

app.get('/items/search', async (req, res) => {
  try {
    const { name } = req.query; // Using query parameter for search
    const { rows } = await pool.query('SELECT * FROM items WHERE name ILIKE $1', [\`%\${name}%\`]); // ILIKE for case-insensitive search
    res.json(rows);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Example route: Batch update item availability (assuming an 'available' column exists)
app.put('/items/batch-update/availability', async (req, res) => {
  try {
    const { itemIds, availability } = req.body; // Expecting an array of item IDs and a boolean for availability
    const { rows } = await pool.query(\`
      UPDATE items
      SET available = $1
      WHERE id = ANY($2)
      RETURNING *;
    \`, [availability, itemIds]);
    res.json(rows);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Example route: Complex query (e.g., join operations, subqueries)
// This example assumes a relationship between 'items' and another table 'categories'
app.get('/items/with-category', async (req, res) => {
  try {
    const { rows } = await pool.query(\`
      SELECT items.*, categories.name AS category_name
      FROM items
      JOIN categories ON items.category_id = categories.id;
    \`);
    res.json(rows);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Example route: Handling pagination for items list
app.get('/items/page', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 if not provided
    const offset = (page - 1) * limit;
    const { rows } = await pool.query('SELECT * FROM items ORDER BY id LIMIT $1 OFFSET $2', [limit, offset]);
    res.json(rows);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`}
      />
    </Window>
  );
  const bullets = createRef<Layout>();
  view.add(
    <Layout
      x={-400}
      layout
      direction={"column"}
      alignItems={"start"}
      ref={bullets}
      gap={20}
      opacity={0}
    >
      <Body
        wrapAt={50}
        {...Title}
        fontSize={48}
        text="Makes it easier to:"
      ></Body>
      <Body
        wrapAt={50}
        opacity={0}
        text=" • Comprehend your codebase"
        cachePadding={10}
      ></Body>
      <Body
        wrapAt={50}
        opacity={0}
        cachePadding={10}
        text=" • Define boundaries for responsibilities"
      ></Body>
      <Body
        opacity={0}
        wrapAt={50}
        cachePadding={10}
        text=" • Identify code that is ideal for refactoring"
      ></Body>
      <Body
        opacity={0}
        wrapAt={50}
        cachePadding={10}
        text=" • You are the only one preventing the entire codebase from living in one file and being impossible to understand"
      ></Body>
      <Body
        opacity={0}
        wrapAt={50}
        cachePadding={10}
        txtProps={{ fontSize: 24 }}
        text=" • Please don't repeat my past mistakes"
      ></Body>
      <Body
        wrapAt={50}
        opacity={0}
        cachePadding={10}
        text=" • Create small units of logic"
      ></Body>
    </Layout>
  );

  yield scrollable().scrollToLeft(0);
  yield scrollable().scrollToTop(0);
  yield* codeWindow().open(view, 1);

  const task = yield loop(Infinity, () =>
    chain(
      scrollable().scrollToBottom(10),
      waitFor(2),
      scrollable().scrollToTop(10),
      waitFor(2)
    )
  );

  yield* beginSlide("text");
  yield* bullets().opacity(1, 1);

  for (const [i, bullet] of bullets().childrenAs<Layout>().entries()) {
    if (i == 0) {
      continue;
    }
    yield* beginSlide(`bullet-${i}`);
    yield* bullet.opacity(1, 1);
  }

  yield* beginSlide("exit");

  yield* codeWindow().close(view, 1);
  yield bullets().opacity(0, 1);
  yield* titleRef().opacity(0, 1);

  yield* waitFor(1);
});

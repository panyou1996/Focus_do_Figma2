import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2.39.3";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-724a4c6b/health", (c) => {
  return c.json({ status: "ok" });
});

// Authentication endpoints
app.post("/make-server-724a4c6b/auth/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password || !name) {
      return c.json({ error: "Email, password, and name are required" }, 400);
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.error("Signup error:", error);
      return c.json({ error: error.message }, 400);
    }

    // Store user profile in KV store
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email: data.user.email,
      name,
      created_at: new Date().toISOString(),
      onboarding_completed: false
    });

    return c.json({ 
      user: { 
        id: data.user.id, 
        email: data.user.email, 
        name,
        onboarding_completed: false
      } 
    });
  } catch (error) {
    console.error("Signup error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.post("/make-server-724a4c6b/auth/signin", async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Signin error:", error);
      return c.json({ error: error.message }, 400);
    }

    // Get user profile from KV store
    const userProfile = await kv.get(`user:${data.user.id}`);

    return c.json({ 
      user: userProfile || {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || "User",
        onboarding_completed: false
      },
      access_token: data.session.access_token
    });
  } catch (error) {
    console.error("Signin error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// User profile endpoints
app.get("/make-server-724a4c6b/user/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userProfile = await kv.get(`user:${user.id}`);
    
    return c.json({ user: userProfile });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.put("/make-server-724a4c6b/user/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const updates = await c.req.json();
    const existingProfile = await kv.get(`user:${user.id}`) || {};
    
    const updatedProfile = {
      ...existingProfile,
      ...updates,
      updated_at: new Date().toISOString()
    };

    await kv.set(`user:${user.id}`, updatedProfile);
    
    return c.json({ user: updatedProfile });
  } catch (error) {
    console.error("Profile update error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Task management endpoints
app.get("/make-server-724a4c6b/tasks", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const tasks = await kv.getByPrefix(`tasks:${user.id}:`);
    
    return c.json({ tasks: tasks.map(task => task.value) });
  } catch (error) {
    console.error("Tasks fetch error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.post("/make-server-724a4c6b/tasks", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const taskData = await c.req.json();
    const taskId = Date.now().toString();
    
    const task = {
      ...taskData,
      id: taskId,
      userId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await kv.set(`tasks:${user.id}:${taskId}`, task);
    
    return c.json({ task });
  } catch (error) {
    console.error("Task creation error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.put("/make-server-724a4c6b/tasks/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const taskId = c.req.param('id');
    const updates = await c.req.json();
    
    const existingTask = await kv.get(`tasks:${user.id}:${taskId}`);
    
    if (!existingTask) {
      return c.json({ error: "Task not found" }, 404);
    }

    const updatedTask = {
      ...existingTask,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await kv.set(`tasks:${user.id}:${taskId}`, updatedTask);
    
    return c.json({ task: updatedTask });
  } catch (error) {
    console.error("Task update error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.delete("/make-server-724a4c6b/tasks/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const taskId = c.req.param('id');
    
    await kv.del(`tasks:${user.id}:${taskId}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.error("Task deletion error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

Deno.serve(app.fetch);
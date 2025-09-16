const request = require('supertest');
process.env.PORT = 3001;
const app = require('../index');
const { db } = require('../config/database');

describe('API Security Tests', () => {
  let authToken;

  beforeAll((done) => { done(); });

  afterAll((done) => { done(); });

  beforeEach((done) => {
    
    request(app)
      .post('/auth/register')
      .send({ username: 'testuser', password: 'testpassword' })
      .end((err) => {
        if (err) return done(err);
        
        request(app)
          .post('/auth/login')
          .send({ username: 'testuser', password: 'testpassword' })
          .end((err, res) => {
            if (err) return done(err);
            authToken = res.body.access_token;
            done();
          });
      });
  });

  afterEach((done) => {
    db.run('DELETE FROM users', done);
  });

  test('POST /auth/login should return 401 for invalid credentials', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ username: 'wronguser', password: 'wrongpassword' });
    
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });

  test('GET /api/data should return 401 without authentication token', async () => {
    const response = await request(app).get('/api/data');
    
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });

  test('GET /api/data should return data with valid authentication token', async () => {
    const response = await request(app)
      .get('/api/data')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('posts');
  });

  test('POST /api/posts should create a new post with valid authentication', async () => {
    const newPost = {
      title: 'Test Post',
      content: 'This is a test post content'
    };
    
    const response = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newPost);
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Post created successfully');
    expect(response.body).toHaveProperty('post');
  });

  test('POST /api/posts should sanitize input to prevent XSS', async () => {
    const maliciousPost = {
      title: '<script>alert("XSS")</script>',
      content: '<img src="x" onerror="alert(\'XSS\')">'
    };
    
    const response = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${authToken}`)
      .send(maliciousPost);
    
    expect(response.status).toBe(201);
	
    expect(response.body.post.title).not.toContain('<script>');
    expect(response.body.post.content).not.toContain('onerror="');
  });
});
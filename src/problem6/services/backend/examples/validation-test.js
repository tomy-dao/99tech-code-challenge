// Validation Test Examples
// Test various validation scenarios for the Task API

const API_BASE = 'http://localhost:3000';

// Helper function to make API calls
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });
  
  const data = await response.json();
  console.log(`${options.method || 'GET'} ${endpoint}:`, response.status);
  console.log('Response:', JSON.stringify(data, null, 2));
  console.log('---');
  
  return { response, data };
}

// Test validation scenarios
async function testValidations() {
  console.log('🧪 Testing API Validations...\n');

  try {
    // 1. Test invalid title (too short)
    console.log('1. Testing invalid title (too short):');
    await apiCall('/api/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title: 'ab', // Too short
        description: 'Test description'
      })
    });

    // 2. Test invalid title (too long)
    console.log('2. Testing invalid title (too long):');
    await apiCall('/api/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title: 'a'.repeat(101), // Too long
        description: 'Test description'
      })
    });

    // 3. Test invalid title (special characters)
    console.log('3. Testing invalid title (special characters):');
    await apiCall('/api/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Task with @#$% invalid chars',
        description: 'Test description'
      })
    });

    // 4. Test invalid description (too long)
    console.log('4. Testing invalid description (too long):');
    await apiCall('/api/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Valid title',
        description: 'a'.repeat(501) // Too long
      })
    });

    // 5. Test invalid completed value
    console.log('5. Testing invalid completed value:');
    await apiCall('/api/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Valid title',
        description: 'Valid description',
        completed: 'not-a-boolean'
      })
    });

    // 6. Test invalid task ID
    console.log('6. Testing invalid task ID:');
    await apiCall('/api/tasks/invalid-id', {
      method: 'GET'
    });

    // 7. Test invalid query parameters
    console.log('7. Testing invalid query parameters:');
    await apiCall('/api/tasks?page=0&limit=200&completed=maybe');

    // 8. Test valid task creation
    console.log('8. Testing valid task creation:');
    const validTask = await apiCall('/api/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Valid Task Title',
        description: 'This is a valid description with normal characters.',
        completed: false
      })
    });

    if (validTask.data.success) {
      const taskId = validTask.data.data._id;
      
      // 9. Test invalid update
      console.log('9. Testing invalid update:');
      await apiCall(`/api/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: 'ab', // Too short
          completed: 'not-boolean'
        })
      });

      // 10. Test valid update
      console.log('10. Testing valid update:');
      await apiCall(`/api/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: 'Updated Valid Title',
          completed: true
        })
      });
    }

    // 11. Test valid query parameters
    console.log('11. Testing valid query parameters:');
    await apiCall('/api/tasks?page=1&limit=10&search=valid&completed=false');

    // 12. Test stats endpoint
    console.log('12. Testing stats endpoint:');
    await apiCall('/api/tasks/stats');

  } catch (error) {
    console.error('❌ Error during validation tests:', error.message);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testValidations();
}

module.exports = { testValidations };



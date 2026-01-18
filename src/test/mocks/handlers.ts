/**
 * Mock Service Worker (MSW) handlers for API mocking
 * Uncomment and configure if you need to mock API calls in tests
 */

// import { rest } from 'msw';

// export const handlers = [
//   // Example: Mock a calculator API
//   rest.get('/api/calculators', (req, res, ctx) => {
//     return res(
//       ctx.status(200),
//       ctx.json({
//         calculators: [
//           { id: '1', name: 'BMI Calculator' },
//           { id: '2', name: 'Percentage Calculator' },
//         ],
//       })
//     );
//   }),

//   // Mock a specific calculator endpoint
//   rest.post('/api/calculate/bmi', async (req, res, ctx) => {
//     const { height, weight } = await req.json();
//     const bmi = weight / ((height / 100) ** 2);

//     return res(
//       ctx.status(200),
//       ctx.json({ bmi: bmi.toFixed(1) })
//     );
//   }),
// ];

// Export empty array if not using MSW
export const handlers: any[] = [];

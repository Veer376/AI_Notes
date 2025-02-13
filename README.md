# Sketch AI Project

This project is a sketch-based interface for writing, drawing, and efficiently representing user queries. It integrates the Gemini LLM to process and run these queries, enhancing the user experience with AI-powered analysis. By combining sketching capabilities with language understanding, this application allows users to express complex mathematical concepts like integration or textual queries in a visual manner and receive results that leverage AI.

## Key Features
- Canvas support for freehand drawing and writing.  
- Real-time rendering of LaTeX expressions.  
- Integration with Gemini LLM for query processing.  
- Flexible color palette and reset functionality.  
- Built with React, TypeScript, and Vite.  

## Getting Started
1. Clone this repository.  
2. Run `npm install` to install dependencies.  
3. Run `npm run dev` to start the development server.  
4. Access the application in a web browser.  

Use the canvas to sketch queries, then click “Run” to submit them. The Gemini LLM integration processes the queries and returns results. The LaTeX rendering provides clear visual feedback.  

Contributions and suggestions are always welcome. Please submit issues or pull requests to help improve this project.


# Backend 
git: 
This backend processes user-submitted images and interprets mathematical or conceptual queries using the Gemini LLM.
API: https://ai-notes-backend.onrender.com/ 
Warning: Please wait while opening or sending request as this is deployed on the free instance and has a cold start minimum of >= 50 seconds.

Endpoints
1. GET /
• Path: /
• Description: Returns a simple JSON with a welcome message and links to documentation.

Example response:
{
  "message": "Welcome to my API!\n",
  "version": "1.0.0",
  "docs": "/docs"
}
2. POST /calculate
• Path: /calculate
• Description: Receives base64-encoded image data and a dictionary of user-defined variables. Calls the Gemini LLM to analyze and solve any recognized math expressions or assigned variables.
• Request body (schema: ImageData):{
  "image": "data:image/png;base64,<encoded_data>",
  "dict_of_vars": {
    "x": 2,
    "y": 3
  }
}
• Example successful response:

{
  "message": "Image processed",
  "result": [
    {
      "expr": "x",
      "result": "2",
      "assign": true
    }
  ],
  "status": "success"
}
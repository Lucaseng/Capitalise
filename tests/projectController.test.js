const request = require('supertest')
const app = require('../app')

const { Project, validate} = require("../models/project");
const mongoose = require("mongoose");
const { User } = require('../models/user');
const { Comment } = require('../models/comment');
const cors = require('dotenv').config()

const URLstring = '/api/projects/'


const noProject = 'No project found'
const invalidToken = 'Invalid token provided!'
const noToken = 'Access denied. No token provided.'
const notGraduate = 'Access Denied. You do not have the relevant permissions to access this resource!'
const notYourComment = "Not your comment!"
const invalidSemester = 'Invalid semester!'
const noUser = 'No user found'
const visitorData = {
  name: "project test visitor",
  email: "testProjectVisitor@gmail.com",
  password: "test",
  links: [
    {
      type: "github",
      value: "https://www.github.com/testProjectVistor",
    },
  ],
  skills: ["speling"],
}


var testUser = ''
var testUser2= ''
var testVisitor = ''

var visitorSignIn = {
  "username": "testProjectVisitor@gmail.com", 
  "password": "test"
}

var userId = ''
var userId2 = ''
var visitorId = ''
var projectId = ''
var commentId = ''

//Create a test user
const data = {
  name: "project test user",
  email: "testProjectUser@aucklanduni.ac.nz",
  password: "test",
  links: [
    {
      type: "github",
      value: "https://www.github.com/testProjectUser",
    },
  ],
  skills: ["speling"],
}

const data2 = {
  name: "project test user2",
  email: "testProjectUser2@aucklanduni.ac.nz",
  password: "test",
  links: [
    {
      type: "github",
      value: "https://www.github.com/testProjectUser2",
    },
  ],
  skills: ["spelling"],
}

var userSignIn = {
  "username": data.email, 
  "password": data.password
}

var userSignIn2 = {
  "username": data2.email,
  "password": data2.password
}


const getToken = async (signIn) => {
  const token = await request(app)
  .post('/api/auth')
  .send(
    signIn
  )
  return token.text
}



beforeAll(async () => {
  [visitorId, userId, userId2] = await Promise.all([
    request(app).post("/api/users").send(visitorData),
    request(app).post("/api/users").send(data),
    request(app).post("/api/users").send(data2)
  ]).then((responses) => responses.map((res) => res.body._id));


});


afterAll(async () => {
  await Promise.all([
    User.findByIdAndDelete(visitorId),
    User.findByIdAndDelete(userId),
    User.findByIdAndDelete(userId2)
  ])
});
/////////////////////////////////////////////////////////////////////////////////////////////



describe("Test that fetches projects", () => {
  /********************************** 
  *           TEST / ROUTE          *
  **********************************/ 
  it("Sends a 200 response if all projects are fetched using getAllProjects", async () => {


    const response = await request(app)
      .get(URLstring)

    expect(response.statusCode).toEqual(200)
    expect(response.body.projects.length > 0);
  });



  /********************************** 
  *     TEST /:projectId ROUTE      *
  **********************************/

  it('Sends status code 200 if a project\'s id matches parameter projectId using getProject' ,async() => {
    const response = await request(app)
    .get(URLstring + '6432f9226cce2fc1706572e3')

    expect(response.statusCode).toEqual(200)
    expect(response.body.project._id == "6432f9226cce2fc1706572e3") 
  })

  it('Sends status code 404 if parameter projectId is an invalid mongoDb id' ,async() => {
    const response = await request(app)
    .get(URLstring + 'invalidId')

    expect(response.statusCode).toEqual(404)
    expect(response.body.project == null && response.body.msg == noProject)

  })

  it('Sends status code 404 if no project exist that matches parameter projectId' ,async() => {
    const response = await request(app)
    //Changed 3 to 9 at end of string
    .get(URLstring + '6432f9226cce2fc1706572e9')
    
    expect(response.statusCode).toEqual(404)
    expect(response.body.project == null && response.body.msg == noProject)
  })


  /********************************** 
  *        TEST /likes ROUTE        *
  **********************************/

  //Not working?
  it('Sends status code 200 and projects sorted by likes in ascending order using getProjectsByLikes', async () => {
    const response = await request(app)
    .get(URLstring + 'likes')

    expect(response.statusCode).toEqual(200)
  })

//Last bracket
});


describe('POST Project from endpoint /api/projects/ using addNewProject', () => {

  it('Post a project successfully and expects statusCode 200 ', async () => {
    const xToken = await getToken(userSignIn)
    //Create test project
    const testProject = {
      "name": "testProjectForwardSlash", 
      "semester": "S1 2023",
      "category": "Mobile Development"
    }    
    
    const response = await request(app)
    .post(URLstring)
    .set('x-auth-token', xToken)
    .send(testProject)

    expect(response.statusCode).toEqual(200)
    expect(response.body.project.name).toEqual(testProject.name)
    projectId = response.body.project._id
    
  })


  it('Expects statusCode 401 When x-auth-token is not set',  async() => {
    const testProject = {
      "name": "testProject", 
      "semester": "S1 2023",
      "category": "Web Development"
    }    
    const response = await request(app)
    .post(URLstring)
    .send(testProject)
    .expect(401)

    expect(response.body.fail).toEqual(noToken)
    
  })

  it('Expects statusCode 400 When token is invalid ',  async() => {
    const testProject = {
      "name": "testProject", 
      "semester": "S1 2023",
      "category": "Web Development"
    }    
    const response = await request(app)
    .post(URLstring)
    .set('x-auth-token', 'xToken')
    .send(testProject)
    
    expect(response.statusCode).toEqual(400)
    expect(response.body.fail).toEqual(invalidToken)
  
  })


  it('Expects statusCode 403 when user is not graduate ',  async() => {
    const xToken = await (getToken(visitorSignIn))
    const testProject = {
      "name": "testProject", 
      "semester": "S1 2023",
      "category": "Web Development"
    }    
    
    const response = await request(app)
    .post(URLstring)
    .set('x-auth-token', xToken)
    .send(testProject)
    
    expect(response.statusCode).toEqual(403)
    expect(response.text).toEqual(notGraduate)
  })

 
  it('Expects statusCode 400 when body of a required attribute is not added',  async() => {
    const xToken = await getToken(userSignIn)
    const testProject = {
    }    
    const response = await request(app)
    .post(URLstring)
    .set('x-auth-token', xToken)
    .send(testProject)
    expect(response.statusCode).toEqual(400)
  })

  it('Expects statusCode 400 when category attribute data is incorrect',  async() => {
    const xToken = await getToken(userSignIn)
    const testProject = {
      "name": "testProject", 
      "semester": "S1 2023",
      "category": "Some Category"
    }    
    const response = await request(app)
    .post(URLstring)
    .set('x-auth-token', xToken)
    .send(testProject)

    expect(response.statusCode).toEqual(400)
  })


  it('Expects statusCode 400 for a semester that does not exist',  async() => {
    const xToken = await getToken(userSignIn)
    const testProject = {
      "name": "testProject", 
      "semester": "S1 1000",
      "category": "Web Development"
    }    
    const response = await request(app)
    .post(URLstring)
    .set('x-auth-token', xToken)
    .send(testProject)

    expect(response.statusCode).toEqual(400)
    expect(response.body.msg).toEqual(invalidSemester)

  })

  it('Expects statusCode 400 semester length is incorrect',  async() => {
    const xToken = await getToken(userSignIn)
    const testProject = {
      "name": "testProject", 
      "semester": "S1 100",
      "category": "Web Development"
    }    
    const response = await request(app)
    .post(URLstring)
    .set('x-auth-token', xToken)
    .send(testProject)
    expect(response.statusCode).toEqual(400)
    expect(response.body.msg).toEqual("\"semester\" length must be at least 7 characters long")
  })

  it('Expects statusCode 400 category is not valid ',  async() => {
    const xToken = await getToken(userSignIn)
    const testProject = {
      "name": "testProject", 
      "semester": "S1 2023",
      "category": "Wrong Category"
    }    
    const response = await request(app)
    .post(URLstring)
    .set('x-auth-token', xToken)
    .send(testProject)

    expect(response.statusCode).toEqual(400)
  })

  it('Expects statusCode 400 badge is not valid ',  async() => {
    const xToken = await getToken(userSignIn)
    const testProject = {
      "name": "testProject", 
      "semester": "S1 2023",
      "category": "Web Development",
      "badges" : {
        "value" : "Wrong Badge"
      }
    }    
    const response = await request(app)
    .post(URLstring)
    .set('x-auth-token', xToken)
    .send(testProject)

    expect(response.statusCode).toEqual(400)
  })
  
  //Last brackets
})




describe('Test the endpoint to see if a projects views is incremented using incrementViews', () => {
  
  it('Expects statusCode 200 and a project to be returned', async () => {
    const project = await Project.findById(projectId)
    const currentViewCount = project.views

    const response = await request(app)
    .patch(URLstring + `${projectId}/incrementViews`)
    
    expect(response.statusCode).toEqual(200)
    expect(response.body.project.views).toEqual(currentViewCount + 1)
  })

  it('Expects statusCode 404 and project = null and a err msg', async () => {

    const response = await request(app)
    .patch(URLstring + `23904a23499s/incrementViews`)
    
    expect(response.statusCode).toEqual(404)
    expect(response.body.msg).toEqual(noProject)
  })

})

describe('Test the POST comment ~ /comment using writeComment', () => {
  
  it('Expects statusCode 200 and a project with the comment added', async () => {
  const xToken = await getToken(visitorSignIn)
  const response = await request(app)
  .post(URLstring + 'comment')
  .set('x-auth-token', xToken)
  .send({
    "projectId": projectId,
    "commentBody": "Hello There"
  })
  expect(response.statusCode).toEqual(200)
  expect(response.body.comment.commentBody).toEqual("Hello There")
  commentId = response.body.comment._id
  const commentUserID = response.body.comment.user.username

  expect(commentUserID).toEqual(visitorSignIn.username)

  })

  it('Expects statusCode 400 when body of comment is invalid', async () => {
    const xToken = await getToken(visitorSignIn)
    const response = await request(app)
    .post(URLstring + 'comment')
    .set('x-auth-token', xToken)
    .send({
      "projectId": projectId,
      "commentBod": "Hello There"
    })
    expect(response.statusCode).toEqual(400)
    expect(response.body.project).toEqual(null)
  })

  it('Expects statusCode 401 when no token is sent', async () => {
    const response = await request(app)
    .post(URLstring + 'comment')
    .send({
      "projectId": projectId,
      "commentBody": "Hello There"

    })

    expect(response.statusCode).toEqual(401)
    expect(response.body.fail).toEqual(noToken)
  })



    it('Expects statusCode 400 when invalid token is sent', async () => {
      const response = await request(app)
      .post(URLstring + 'comment')
      .set('x-auth-token', 'BadToken')
      .send({
        "projectId": projectId,
        "commentBody": "Hello There"
      })


      expect(response.statusCode).toEqual(400)
      expect(response.body.fail).toEqual(invalidToken)
    })


    
    it('Expects statusCode 404 when projectId does not find project', async () => {
      const xToken = await getToken(visitorSignIn)
      const response = await request(app)
      .post(URLstring + 'comment')
      .set('x-auth-token', xToken)
      .send({
        "projectId": '6456fef4adc5d63f86fbec1e',
        "commentBody": "Hello There"
      })

      expect(response.statusCode).toEqual(404)
      expect(response.body.msg).toEqual(noProject)
    })
  

})


describe('Test that retrieves comments', () => {
  it('Expects statusCode 200 and all comments from the /comments/all endpoint using getAllComments', async () => {
    const response = await request(app)
    .get(URLstring + 'comments/all')
    expect(response.statusCode).toEqual(200)
  })

  it('Expects statusCode 200 and all comments for a specific project from /comments/:projectId', async () => {
    const response = await request(app)
    .get(URLstring + `comments/${projectId}`)

    expect(response.statusCode).toEqual(200)
  })
  
  it('Expects statusCode 404 and err msg from /comments/:projectId', async () => {
    const response = await request(app)
    .get(URLstring + `comments/invalidId`)

    expect(response.statusCode).toEqual(404)
    expect(response.body.msg).toEqual(noProject)
  })
})


describe('Test the deleteComment endpoint ~ /comment/:commentId using deleteComment', () => {
  
  it('Expects statusCode 404 with err msg when given non-existant commentId', async () => {
    const xToken = await getToken(visitorSignIn)
    const response = await request(app)
    .delete(URLstring +`comment/6432f9226cce2fc1706572e3`)
    .set('x-auth-token', xToken)
    expect(response.statusCode).toEqual(404)
    expect(response.body.msg).toEqual('No comment exist')
  })
  
  it('Expects statusCode 404 with err msg when given an invalid commentId', async () => {
    const xToken = await getToken(visitorSignIn)
    const response = await request(app)
    .delete(URLstring +`comment/invalidId`)
    .set('x-auth-token', xToken)
    expect(response.statusCode).toEqual(404)
    expect(response.body.msg).toEqual('No comment exist')
  })
  

  it('Expects statusCode 401 with no token given ', async () => {
    const response = await request(app)
    .delete(URLstring +`comment/${commentId}`)
    expect(response.statusCode).toEqual(401)
    expect(response.body.fail).toEqual(noToken)
  })

  it('Expects statusCode 400 with invalid token ', async () => {
    const response = await request(app)
    .delete(URLstring +`comment/${commentId}`)
    .set('x-auth-token', 'visitorSignIn')
    expect(response.statusCode).toEqual(400)
    expect(response.body.fail).toEqual(invalidToken)
  })


  it('Expects statusCode 403 when comment being deleted does not belong to user ', async () => {
    const xToken = await getToken(userSignIn)

    const response = await request(app)
    .delete(URLstring +`comment/${commentId}`)
    .set('x-auth-token', xToken)


    expect(response.statusCode).toEqual(403)
    expect(response.body.msg).toEqual(notYourComment)
  })


  it('Expects statusCode 200 with the comment being null ', async () => {
    const xToken = await getToken(visitorSignIn)

    const response = await request(app)
    .delete(URLstring +`comment/${commentId}`)
    .set('x-auth-token', xToken)


    expect(response.statusCode).toEqual(200)

    const comment = await Comment.findById(commentId)
    expect(comment).toEqual(null)
  })
})


describe('Test the like project endpoint using likeComment ', () => {

  it('Expects statusCode 401 with no token given ', async () => {
    const response = await request(app)
    .patch(URLstring +`${projectId}/like`)
    expect(response.statusCode).toEqual(401)
    expect(response.body.fail).toEqual(noToken)
  })

  it('Expects statusCode 400 with invalid token ', async () => {
    const response = await request(app)
    .patch(URLstring + `${projectId}/like`)
    .set('x-auth-token', 'visitorSignIn')
    expect(response.statusCode).toEqual(400)
    expect(response.body.fail).toEqual(invalidToken)
  })

  it('Expects statusCode 404 and from invalid projectId', async () => {
    const xToken = await getToken(visitorSignIn)
    const response = await request(app)
    .patch(URLstring + `projectId/like`)
    .set('x-auth-token', xToken)
    expect(response.statusCode).toEqual(404)
    expect(response.body.msg).toEqual(noProject)
  })

  it('Expects statusCode 404 and from nonexistant project', async () => {
    const xToken = await getToken(visitorSignIn)
    const response = await request(app)
    .patch(URLstring + `643f2c55ad1a82d723b5b875/like`)
    .set('x-auth-token', xToken)
    expect(response.statusCode).toEqual(404)
    expect(response.body.msg).toEqual(noProject)
  })

  it('Expects statusCode 403 and from err message from user thats part of project', async () => {
    const xToken = await getToken(userSignIn)
    const response = await request(app)
    .patch(URLstring + `${projectId}/like`)
    .set('x-auth-token', xToken)
    expect(response.statusCode).toEqual(403)
    expect(response.body.msg).toEqual("You are not allowed to like your own project")
  })


  it('Expects statusCode 200 and likes equal previouslikes + 1', async () => {
    const xToken = await getToken(visitorSignIn)
    const likes = (await Project.findById(projectId)).likes
    const response = await request(app)

    .patch(URLstring + `${projectId}/like`)
    .set('x-auth-token', xToken)
    expect(response.statusCode).toEqual(200)
    expect(response.body.project.likes).toEqual(likes + 1)

  })

  it('Expects statusCode 200 and likes equal previouslikes - 1', async () => {
    const xToken = await getToken(visitorSignIn)
    const likes = (await Project.findById(projectId)).likes
    const response = await request(app)
    .patch(URLstring + `${projectId}/like`)
    .set('x-auth-token', xToken)
    expect(response.statusCode).toEqual(200)
    expect(response.body.project.likes).toEqual(likes - 1)
  })

})


describe('Test the Patch /:projectId route where it uses updateProjectById endpoint', () => {
  it('Expects statusCode 200 and updated project', async() => {
    const xToken = await getToken(userSignIn)
    const patchBody = {
      "name" : "testProject"
    }
    const response = await request(app)
    .patch(URLstring + projectId)
    .set('x-auth-token', xToken)
    .send(patchBody)
    
    expect(response.statusCode).toEqual(200)
    expect(response.body.project.name).toEqual(patchBody.name)
  })

  it('Expects statusCode 404 when projectId is an invalid id', async() => {
    const xToken = await getToken(userSignIn)
    const patchBody = {
      "name" : "testProject"
    }
    const response = await request(app)
    .patch(URLstring + 'invalidId')
    .set('x-auth-token', xToken)
    .send(patchBody)
    
    expect(response.statusCode).toEqual(404)
    expect(response.body.msg).toEqual(noProject)
  })

  it('Expects statusCode 404 when project is not found', async() => {
    const xToken = await getToken(userSignIn)
    const patchBody = {
      "name" : "testProject"
    }
    const response = await request(app)
    .patch(URLstring + '6456fef4adc5d63f86fbec1e')
    .set('x-auth-token', xToken)
    .send(patchBody)
    
    expect(response.statusCode).toEqual(404)
    expect(response.body.msg).toEqual(noProject)
  })

  it('Expects statusCode 400 when token is invalid', async () => {
    const xToken = await getToken(userSignIn)
    const patchBody = {
      "name" : "testProject"
    }
    const response = await request(app)
    .patch(URLstring + projectId)
    .set('x-auth-token', 'xToken')
    .send(patchBody)

    expect(response.statusCode).toEqual(400)
    expect(response.body.fail).toEqual(invalidToken)
    
  })

  it('Expects statusCode 401 when token is not given', async () => {
    const xToken = await getToken(userSignIn)
    const patchBody = {
      "name" : "testProject"
    }
    const response = await request(app)
    .patch(URLstring + projectId)
    .send(patchBody)

    expect(response.statusCode).toEqual(401)
    expect(response.body.fail).toEqual(noToken)
    
  })

  it('Expects statusCode 403 when user is not a graduate', async () => {
    const xToken = await getToken(visitorSignIn)
    const patchBody = {
      "name" : "testProject"
    }
    const response = await request(app)
    .patch(URLstring + projectId)
    .set('x-auth-token', xToken)
    .send(patchBody)



    expect(response.statusCode).toEqual(403)
    expect(response.text).toEqual(notGraduate)
    
  })
  it('Expects statusCode 403 when a user is not part of the project ', async () => {
    const xToken = await getToken(userSignIn2)
    const patchBody = {
      "name" : 'testProject',
      "badge" : 'Top Excellence'
    }
    const response = await request(app)
    .patch(URLstring + projectId)
    .set('x-auth-token', xToken)
    .send(patchBody)

    expect(response.statusCode).toEqual(403)
    expect(response.body.msg).toEqual("You are not part of this project")
  })

  it('Expects statusCode 400 from an semester that doesnt exist', async () => {
    const xToken = await getToken(userSignIn)
    const patchBody = {
      "name" : 'testProject',
      "semester" : 'S3 1234'
    }
    const response = await request(app)
    .patch(URLstring + projectId)
    .set('x-auth-token', xToken)
    .send(patchBody)

    expect(response.statusCode).toEqual(400)
    expect(response.body.msg).toEqual(invalidSemester)
  })

  it('Expects statusCode 400 from an invalid semester', async () => {
    const xToken = await getToken(userSignIn)
    const patchBody = {
      "name" : 'testProject',
      "semester" : 'S3 202'
    }
    const response = await request(app)
    .patch(URLstring + projectId)
    .set('x-auth-token', xToken)
    .send(patchBody)

    expect(response.statusCode).toEqual(400)
    expect(response.body.msg).toEqual(invalidSemester)
  })

  it('Expects statusCode 400 from an invalid category', async () => {
    const xToken = await getToken(userSignIn)
    const patchBody = {
      "name" : 'testProject',
      "category" : 'S3 202'
    }
    const response = await request(app)
    .patch(URLstring + projectId)
    .set('x-auth-token', xToken)
    .send(patchBody)

    expect(response.statusCode).toEqual(400)
    expect(response.body.msg).toEqual('Invalid category!')
  })


  
  it('Expects statusCode 403 when a user is not an admin and tries to update badge', async () => {
    const xToken = await getToken(userSignIn)
    const patchBody = {
      "name" : 'testProject',
      "badges" : 'Top Excellence'
    }
    const response = await request(app)
    .patch(URLstring + projectId)
    .set('x-auth-token', xToken)
    .send(patchBody)

    expect(response.statusCode).toEqual(403)
    expect(response.body.msg).toEqual("Only admins can update project badges!")

  })
  

  it('Expects statusCode 400 when a user is admin and tries to award an invalid badge', async () => {
    const xToken = await getToken({
      "username":process.env.USERADMIN,
      "password":process.env.USERADMINPASSWORD
    })

    const patchBody = {
      "name" : 'testProject',
      "badges" : 'Top Excell'
    }
    const response = await request(app)
    .patch(URLstring + projectId)
    .set('x-auth-token', xToken)
    .send(patchBody)

    expect(response.statusCode).toEqual(400)
    expect(response.body.msg).toEqual("Invalid award!")
  })
  
})






describe('Adds user to project using route /:id/:userid using addUserToProject', () =>{
  
  it('Expects statusCode 404 for invalid userId ', async () => {
    const xToken = await getToken(userSignIn)
    const response = await request(app)
    .put(URLstring + `${projectId}/invalidUserId`)
    .set('x-auth-token', xToken)

    expect(response.statusCode).toEqual(404)
    expect(response.body.msg).toEqual(noUser)
  })

  it('Expects statusCode 404 for no existing user from userId ', async () => {
    const xToken = await getToken(userSignIn)
    const response = await request(app)
    .put(URLstring + `${projectId}/64572fd1f66d6a2ad42c394b`)
    .set('x-auth-token', xToken)

    expect(response.statusCode).toEqual(404)
    expect(response.body.msg).toEqual(noUser)
  })

  it('Expects statusCode 404 for invalid id ', async () => {
    const xToken = await getToken(userSignIn)
    const response = await request(app)
    .put(URLstring + `wrongProjectId/${userId2}`)
    .set('x-auth-token', xToken)

    expect(response.statusCode).toEqual(404)
    expect(response.body.msg).toEqual(noProject)
  })

  it('Expects statusCode 404 for no existing project from id ', async () => {
    const xToken = await getToken(userSignIn)
    const response = await request(app)
    .put(URLstring + `64572fd1f66d6a2ad42c394r/${userId2}`)
    .set('x-auth-token', xToken)

    expect(response.statusCode).toEqual(404)
    expect(response.body.msg).toEqual(noProject)
  })

  it('Expects statusCode 403 if the user adding the user is not part of the project or not admin ', async () => {
    const xToken = await getToken(userSignIn2)
    const response = await request(app)
    .put(URLstring + `${projectId}/${userId2}`)
    .set('x-auth-token', xToken)

    expect(response.statusCode).toEqual(403)
    expect(response.body.msg).toEqual("You do not belong to the project you are appending another user to!")
  })

  it('Expects statusCode 400 if the user is trying to add themselves to the project ', async () => {
    const xToken = await getToken(userSignIn)
    const response = await request(app)
    .put(URLstring + `${projectId}/${userId}`)
    .set('x-auth-token', xToken)

    expect(response.statusCode).toEqual(400)
    expect(response.body.msg).toEqual("You already belong to the project!")
  })

  it('Expects statusCode 200 with project being returned with the id added', async () => {
    const xToken = await getToken(userSignIn)
    const response = await request(app)
    .put(URLstring + `${projectId}/${userId2}`)
    .set('x-auth-token', xToken)

    expect(response.statusCode).toEqual(200)
    expect(response.body.project.members.includes(userId2))
  })
  
  it('Expects statusCode 400 if the user being added is already added ', async () => {
    const xToken = await getToken(userSignIn)
    const response = await request(app)
    .put(URLstring + `${projectId}/${userId2}`)
    .set('x-auth-token', xToken)

    expect(response.statusCode).toEqual(400)
    expect(response.body.msg).toEqual('This user already belongs to the project!')
  })


})

describe('Test the search endpoint /search with searchProjects', () =>{
  it('', async () => {

  })
})

/* 

describe('', () =>{

})


it('', async () => {

})
*/
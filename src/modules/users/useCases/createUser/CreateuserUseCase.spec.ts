import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { IUsersRepository } from "../../repositories/IUsersRepository"
import { CreateUserUseCase } from "./CreateUserUseCase"

let userRepository:IUsersRepository
let userUseCase:CreateUserUseCase

describe('Create use useCase',()=>{

  beforeEach(()=>{
    userRepository = new InMemoryUsersRepository()
    userUseCase = new CreateUserUseCase(userRepository)
  })

  it('should be able to create a user', async () => {
   const user = await userUseCase.execute({
      email:'pedro@gmail.com',
      name:'pedro',
      password:'12345'
    })

    expect(user).toHaveProperty('id')
  })

  it('should not be able to create a user with an exist email', async () => {
    const user = await userUseCase.execute({
       email:'pedro@gmail.com',
       name:'pedro',
       password:'12345'
     })

     await expect(async ()=>{
      await userUseCase.execute({
        email:'pedro@gmail.com',
        name:'pedro',
        password:'12345'
      })
     }).rejects.toEqual(new AppError('User already exists'))

   })


})
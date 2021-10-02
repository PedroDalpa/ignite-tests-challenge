import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { IUsersRepository } from "../../repositories/IUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"


let userRepository:IUsersRepository
let userUseCase:CreateUserUseCase
let showUserProfileUseCase:ShowUserProfileUseCase

describe('Show user profile useCase',()=>{

  beforeEach(()=>{
    userRepository = new InMemoryUsersRepository()
    showUserProfileUseCase= new ShowUserProfileUseCase(userRepository)
    userUseCase = new CreateUserUseCase(userRepository)
  })

  it('should be able to show user profile', async () => {
   const user = await userUseCase.execute({
      email:'pedro@gmail.com',
      name:'pedro',
      password:'12345'
    })

    const profile = await showUserProfileUseCase.execute(user.id as string)

    expect(profile).toHaveProperty('id')
    expect(profile).toHaveProperty('email')
    
  })

  it('should not be able to show user profile', async () => {

    await expect(async ()=>{
      await showUserProfileUseCase.execute('user.id')
    }).rejects.toEqual(new AppError('User not found', 404))
  })
})
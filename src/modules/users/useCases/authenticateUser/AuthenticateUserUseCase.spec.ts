import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { IUsersRepository } from "../../repositories/IUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../createUser/ICreateUserDTO"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"

let userRepository:IUsersRepository
let authenticateUserUseCase:AuthenticateUserUseCase
let createUserUseCase:CreateUserUseCase

describe('Authenticate user use useCase',()=>{

  beforeEach(()=>{
    userRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(userRepository)
    authenticateUserUseCase = new AuthenticateUserUseCase(userRepository)
  })

  it('should be able to authenticate a user', async () => {
    await createUserUseCase.execute({
      email: 'pedro@gmail.com',
      name: 'pedro',
      password: 'pedro12345'
    })

    const auth = await authenticateUserUseCase.execute({
      email: 'pedro@gmail.com',
      password: 'pedro12345'
    })

    expect(auth).toHaveProperty('token')
    expect(auth).toHaveProperty('user')
    expect(auth.user).toHaveProperty('name')
    expect(auth.user).toHaveProperty('id')
    expect(auth.user).toHaveProperty('email')
  })

  it('should not be able to authenticate a user with invalid email', async () => {
    await userRepository.create({
      email:'pedro@gmail.com',
      name:'pedro',
      password:'12345'
    })

    expect(async () => {
      await authenticateUserUseCase.execute({
        email:'pedro@hotmail.com',
        password:'12345'
      })
    }).rejects.toEqual(new AppError('Incorrect email or password', 401))
  })

  it('should not be able to authenticate a user with invalid password', async () => {
    await userRepository.create({
      email:'pedro@gmail.com',
      name:'pedro',
      password:'12345'
    })

    expect(async () => {
      await authenticateUserUseCase.execute({
        email:'pedro@gmail.com',
        password:'1234567'
      })
    }).rejects.toEqual(new AppError('Incorrect email or password', 401))
  })




})
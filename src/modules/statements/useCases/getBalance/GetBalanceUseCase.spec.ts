import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { IUsersRepository } from "../../../users/repositories/IUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { IStatementsRepository } from "../../repositories/IStatementsRepository"
import { GetBalanceUseCase } from "./GetBalanceUseCase"


let userRepository:IUsersRepository
let userUseCase:CreateUserUseCase
let getBalanceUseCase:GetBalanceUseCase
let statementsRepository:IStatementsRepository

describe('Get balance useCase',()=>{

  beforeEach(()=>{
    userRepository = new InMemoryUsersRepository()
    statementsRepository = new InMemoryStatementsRepository()
    userUseCase = new CreateUserUseCase(userRepository)
    getBalanceUseCase = new GetBalanceUseCase(statementsRepository, userRepository)
  })

  it('should be able to get balance', async () => {
   const user = await userUseCase.execute({
      email:'pedro@gmail.com',
      name:'pedro',
      password:'12345'
    })

    const balance = await getBalanceUseCase.execute({ 
      user_id: user.id as string
    })

    expect(balance).toHaveProperty('balance')
    expect(balance).toHaveProperty('statement')
  })

  it('should not be able to get balance invalid user', async () => {
    await expect(async ()=>{
      await getBalanceUseCase.execute({ 
        user_id: 'user.id'
      })
    }).rejects.toEqual(new AppError('User not found',404))
  })

})
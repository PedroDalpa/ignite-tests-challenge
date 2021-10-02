import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { IUsersRepository } from "../../../users/repositories/IUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { IStatementsRepository } from "../../repositories/IStatementsRepository"
import { CreateStatementUseCase } from "./CreateStatementUseCase"

let userRepository:IUsersRepository
let userUseCase:CreateUserUseCase
let createStatementUseCase:CreateStatementUseCase
let statementsRepository:IStatementsRepository

describe('Create statement useCase',()=>{

  enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

  beforeEach(()=>{
    userRepository = new InMemoryUsersRepository()
    statementsRepository = new InMemoryStatementsRepository()
    userUseCase = new CreateUserUseCase(userRepository)
    createStatementUseCase = new CreateStatementUseCase(userRepository, statementsRepository)
  })

  it('should be able to create statement deposit', async () => {
   const user = await userUseCase.execute({
      email:'pedro@gmail.com',
      name:'pedro',
      password:'12345'
    })

    const balance = await createStatementUseCase.execute({ 
      amount: 400,
      description: 'pagamento',
      type: OperationType.DEPOSIT,
      user_id: user.id as string
    })

    expect(balance).toHaveProperty('id')   
  })

  it('should not be able to create statement un-exist user', () => {
    expect(async () => {
      await createStatementUseCase.execute({ 
        amount: 400,
        description: 'pagamento',
        type: OperationType.DEPOSIT,
        user_id: 'user.id'
      })
    }).rejects.toEqual(new AppError('User not found', 404)) 
  })

  it('should be able to create statement withdraw', async () => {
    const user = await userUseCase.execute({
       email:'pedro@gmail.com',
       name:'pedro',
       password:'12345'
     })

     await createStatementUseCase.execute({ 
      amount: 400,
      description: 'pagamento',
      type: OperationType.DEPOSIT,
      user_id: user.id as string
    })
 
     const balance = await createStatementUseCase.execute({ 
       amount: 400,
       description: 'saque',
       type: OperationType.WITHDRAW,
       user_id: user.id as string
     })
 
     expect(balance).toHaveProperty('id')   
   })

   it('should not be able to create statement withdraw with insufficient funds', async () => {
    const user = await userUseCase.execute({
       email:'pedro@gmail.com',
       name:'pedro',
       password:'12345'
     })

     await createStatementUseCase.execute({ 
      amount: 300,
      description: 'pagamento',
      type: OperationType.DEPOSIT,
      user_id: user.id as string
    })
 
     expect(async () => {
      await createStatementUseCase.execute({ 
        amount: 400,
        description: 'saque',
        type: OperationType.WITHDRAW,
        user_id: user.id as string
      })
     }).rejects.toEqual(new AppError('Insufficient funds', 400))
 
     
   })
})
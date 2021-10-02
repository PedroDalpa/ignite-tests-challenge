import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { IUsersRepository } from "../../../users/repositories/IUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { IStatementsRepository } from "../../repositories/IStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"

let userRepository:IUsersRepository
let userUseCase:CreateUserUseCase
let createStatementUseCase:CreateStatementUseCase
let statementsRepository:IStatementsRepository
let getStatementOperationUseCase:GetStatementOperationUseCase

describe('Get statement operation useCase',()=>{

  enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

  beforeEach(()=>{
    userRepository = new InMemoryUsersRepository()
    statementsRepository = new InMemoryStatementsRepository()
    userUseCase = new CreateUserUseCase(userRepository)
    createStatementUseCase = new CreateStatementUseCase(userRepository, statementsRepository)
    getStatementOperationUseCase = new GetStatementOperationUseCase(userRepository, statementsRepository)
  })

  it('should be able to get statement operation', async () => {
   const user = await userUseCase.execute({
      email:'pedro@gmail.com',
      name:'pedro',
      password:'12345'
    })

    const statement = await createStatementUseCase.execute({ 
      amount: 400,
      description: 'pagamento',
      type: OperationType.DEPOSIT,
      user_id: user.id as string
    })

    const getStatement = await getStatementOperationUseCase.execute({
      statement_id:statement.id as string, 
      user_id:user.id as string
    })

    expect(getStatement).toHaveProperty('id')
    
  })

  it('should not be able to get statement operation with invalid user', async () => {
    const user = await userUseCase.execute({
       email:'pedro@gmail.com',
       name:'pedro',
       password:'12345'
     })
 
     const statement = await createStatementUseCase.execute({ 
       amount: 400,
       description: 'pagamento',
       type: OperationType.DEPOSIT,
       user_id: user.id as string
     })
 
    expect(async ()=>{
      await getStatementOperationUseCase.execute({
        statement_id:statement.id as string, 
        user_id: 'user.id'
      })
    }).rejects.toEqual(new AppError('User not found', 404))   
     
  })

  it('should not be able to get statement operation with invalid statement', async () => {
    const user = await userUseCase.execute({
       email:'pedro@gmail.com',
       name:'pedro',
       password:'12345'
     })
 
     const statement = await createStatementUseCase.execute({ 
       amount: 400,
       description: 'pagamento',
       type: OperationType.DEPOSIT,
       user_id: user.id as string
     })
 
    expect(async ()=>{
      await getStatementOperationUseCase.execute({
        statement_id: 'statement.id', 
        user_id: user.id as string
      })
    }).rejects.toEqual(new AppError('Statement not found', 404))   
     
  })

})
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersController } from './users.controller';
import { User } from './users.entity';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) =>
        Promise.resolve({ id, email: 'a', password: 'a', name: 'x' } as User),
      find: (email: string) => {
        return Promise.resolve([
          { id: 1, email, password: 'a', name: 'x' } as User,
        ]);
      },
      // update: () => {},
      // remove: () => {},
    };
    fakeAuthService = {
      // signUp: () => {},
      signIn: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password, name: 'x' } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUsersService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers retuns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('test@gmail.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('test@gmail.com');
  });

  it('findUser returns a single user with the given id', async () => {
    expect(await controller.findUser('1')).toEqual({
      id: 1,
      email: 'a',
      password: 'a',
      name: 'x',
    });
  });

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => null;
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it('signIn updates session object and returns user', async () => {
    const session = {
      userId: -10,
    };
    const user = await controller.signIn(
      {
        email: 'test@test.com',
        password: 'test1234',
      },
      session,
    );

    expect(user.id).toEqual(1);
    expect(session).toEqual({ userId: 1 });
  });
});

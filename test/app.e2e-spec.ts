import {Test} from "@nestjs/testing";
import { AppModule } from "@/app.module";
import { PrismaService } from "@/prisma/prisma.service";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as pactum from 'pactum';
import { AuthDTO } from "@/auth/dto";
import { EditUser } from "@/user/dto";
import { CreateBookmark, EditBookmark } from "@/bookmark/dto";

describe('App e2e', ()=>{
  let app : INestApplication;
  let prisma :  PrismaService;
  beforeAll(async()=>{

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
    }));

    await app.init();
    await app.listen(3300);

    prisma = app.get(PrismaService);
    await prisma.cleanDB();

    pactum.request.setBaseUrl('http://localhost:3300');

  }); 

  afterAll( ()=>{
    app.close();
  })

  const dto: AuthDTO = {
    email: 'ak@gmail.com',
    password: "12345",
  }
  describe('Auth', ()=>{
    describe('Signup', ()=>{
      it('Should throw exception if email is empty', ()=>{
        return pactum.spec()
              .post('/auth/signup')
              .withBody({
                password: dto.password,
              }).expectStatus(400);
      })

      it('Should throw exception if password is empty', ()=>{
        return pactum.spec()
              .post('/auth/signup')
              .withBody({
                email: dto.email,
              }).expectStatus(400);
      })

      it('Should throw exception if body is empty', ()=>{
        return pactum.spec()
              .post('/auth/signup')
              .expectStatus(400);
      })

      it('should sign up', ()=>{
        return pactum.spec()
              .post('/auth/signup')
              .withBody(dto)
              .expectStatus(201);
      })
    });

    describe('Login', ()=>{

      it('Should throw exception if email is empty', ()=>{
        return pactum.spec()
              .post('/auth/login')
              .withBody({
                password: dto.password,
              }).expectStatus(400);
      })

      it('Should throw exception if password is empty', ()=>{
        return pactum.spec()
              .post('/auth/login')
              .withBody({
                email: dto.email,
              }).expectStatus(400);
      })

      it('Should throw exception if body is empty', ()=>{
        return pactum.spec()
              .post('/auth/login')
              .expectStatus(400);
      })

      it('login', ()=>{
        return pactum.spec()
              .post('/auth/login')
              .withBody(dto)
              .expectStatus(200)
              .stores('userAt', 'access_token');
      })
    });

  });

  describe('User', ()=>{
    describe('Get User', ()=>{
      it("should get current user", ()=>{
        return pactum.spec()
        .get('/user/me')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(200);
      });
    });
    describe('Edit User', ()=>{
      it('Should edit user', ()=>{
        const dto:EditUser = {
          firstName: "A",
          // lastname: "K",
          email: 'ak@gmail.com'
        }
        return pactum.spec()
              .patch('/user')
              .withHeaders({
                Authorization: 'Bearer $S{userAt}',
              })
              .withBody(dto)
              .expectStatus(200)
              .expectBodyContains(dto.email)
              // .inspect();
      })
    })
  });

  describe('Bookmark', ()=>{

    describe("Get empty bookmarks", ()=>{
      it("should return empty array for bookmarks", ()=>{
        return pactum.spec()
              .get('/bookmark')
              .withHeaders({
                Authorization: "Bearer $S{userAt}",
              })
              .expectStatus(200)
              .expectBody([])
              // .inspect();
      })
    })

    describe('Create Bookmark', ()=>{
      const dto:CreateBookmark  = {
        title: "Book1",
        link: "https://www.me.com"
      }
      it("should create bookmark", ()=>{
        return pactum.spec()
              .post('/bookmark')
              .withHeaders({
                Authorization: "Bearer $S{userAt}",
              })
              .withBody(dto)
              .expectStatus(201)
              // .inspect();
      })
    });
    describe('Get Bookmarks', ()=>{
      it("should return bookmarks", ()=>{
        return pactum.spec()
              .get('/bookmark')
              .withHeaders({
                Authorization: "Bearer $S{userAt}",
              })
              .expectStatus(200)
              .stores('bookmarkId', 'id')
              // .inspect();
      })

    });
    describe('Get Bookmark by Id', ()=>{
      it("should return bookmark by id", ()=>{
        return pactum.spec()
              .get('/bookmark/{id}')
              .withPathParams({
                id: '$S{bookmarkId}',
              })
              .withHeaders({
                Authorization: "Bearer $S{userAt}",
              })
              .expectStatus(200)
              // .inspect();
      })
    });
    describe('Edit Bookmark', ()=>{
      it("should edit bookmark by id", ()=>{
        const dto: EditBookmark = {
          title: "Book New",
        }
        return pactum.spec()
              .patch('/bookmark/{id}')
              .withPathParams({
                id: '$S{bookmarkId}',
              })
              .withHeaders({
                Authorization: "Bearer $S{userAt}",
              })
              .withBody(dto)
              .expectStatus(200)
              // .inspect();
      })
    });
    describe('Delete Profile', ()=>{
      it("should delete bookmark by id", ()=>{
        return pactum.spec()
              .delete('/bookmark/{id}')
              .withPathParams({
                id: '$S{bookmarkId}',
              })
              .withHeaders({
                Authorization: "Bearer $S{userAt}",
              })
              .expectStatus(204)
              .inspect();
      })
    })
  });
})
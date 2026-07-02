 
## 🗄️ Prisma ORM CRUD Blueprint

Quick reference boilerplate containing foundational data-manipulation queries using the Prisma Client engine.

### Database Schema Example (`schema.prisma`)

```prisma
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String
}

```

### Application CRUD Execution

#### import:
```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
```
---

```typescript
// 1. CREATE
const newUser = await prisma.user.create({
  data: {
    email: 'kasun@logicbit.com',
    name: 'Kasun Perera',
  },
});
```
---

```typescript
// 2. READ (Find All / Unique Filter)
const allUsers = await prisma.user.findMany();

const singleUser = await prisma.user.findUnique({
  where: { id: 1 },
});
```
---

```typescript
// 3. UPDATE
const updatedUser = await prisma.user.update({
  where: { id: 1 },
  data: {
    name: 'Kasun Silva',
  },
});
```
---

```typescript
// 4. DELETE
const deletedUser = await prisma.user.delete({
  where: { id: 1 },
});

```


 
Click here to view the [Next.js, Prisma, and SQLite Cheat Sheet](https://github.com/moshika38/Nextjs-React-Cheatsheet/tree/main/Next%20%7C%20Prisma%20%7C%20Sqlite)




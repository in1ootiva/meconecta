# Plataforma de Cursos de Programação

Uma plataforma de streaming de cursos de programação com controle de usuários e gerenciamento de conteúdo.

## Funcionalidades

- Autenticação de usuários (alunos e administradores)
- Visualização de cursos para alunos
- Comentários em aulas
- Envio de atividades
- Gerenciamento completo de cursos, módulos e aulas para administradores

## Tecnologias Utilizadas

- Next.js 14
- TypeScript
- Tailwind CSS
- Shadcn UI
- Supabase (Backend e Banco de Dados)

## Configuração do Ambiente

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```

3. Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:
   ```
   NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
   ```

4. Configure o banco de dados no Supabase com as seguintes tabelas:

   ```sql
   -- Tabela de usuários (gerenciada pelo Supabase Auth)
   create table public.profiles (
     id uuid references auth.users on delete cascade,
     name text,
     role text check (role in ('student', 'admin')),
     created_at timestamp with time zone default timezone('utc'::text, now()) not null,
     primary key (id)
   );

   -- Tabela de cursos
   create table public.courses (
     id uuid default uuid_generate_v4() primary key,
     title text not null,
     description text,
     thumbnail_url text,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null,
     updated_at timestamp with time zone default timezone('utc'::text, now()) not null
   );

   -- Tabela de módulos
   create table public.modules (
     id uuid default uuid_generate_v4() primary key,
     course_id uuid references public.courses on delete cascade,
     title text not null,
     description text,
     order integer not null,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null,
     updated_at timestamp with time zone default timezone('utc'::text, now()) not null
   );

   -- Tabela de aulas
   create table public.lessons (
     id uuid default uuid_generate_v4() primary key,
     module_id uuid references public.modules on delete cascade,
     title text not null,
     description text,
     video_url text,
     order integer not null,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null,
     updated_at timestamp with time zone default timezone('utc'::text, now()) not null
   );

   -- Tabela de comentários
   create table public.comments (
     id uuid default uuid_generate_v4() primary key,
     lesson_id uuid references public.lessons on delete cascade,
     user_id uuid references public.profiles on delete cascade,
     content text not null,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null,
     updated_at timestamp with time zone default timezone('utc'::text, now()) not null
   );

   -- Tabela de atividades
   create table public.assignments (
     id uuid default uuid_generate_v4() primary key,
     lesson_id uuid references public.lessons on delete cascade,
     user_id uuid references public.profiles on delete cascade,
     content text not null,
     status text check (status in ('pending', 'approved', 'rejected')),
     created_at timestamp with time zone default timezone('utc'::text, now()) not null,
     updated_at timestamp with time zone default timezone('utc'::text, now()) not null
   );
   ```

5. Execute o projeto em modo de desenvolvimento:
   ```bash
   npm run dev
   ```

## Estrutura do Projeto

- `/src/app` - Páginas da aplicação
- `/src/components` - Componentes reutilizáveis
- `/src/lib` - Configurações e utilitários
- `/src/types` - Definições de tipos TypeScript

## Licença

MIT

CREATE TABLE public.projects (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name character varying NOT NULL,
  description character varying,
  userId numeric,
  status character varying,
  createdAt date,
  CONSTRAINT projects_pkey PRIMARY KEY (id)
);

CREATE TABLE public.users (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  email character varying NOT NULL,
  password character varying NOT NULL,
  first_name character varying NOT NULL,
  last_name character varying NOT NULL,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);
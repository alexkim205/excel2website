create table "public"."linked_accounts" (
    "from_email" text not null,
    "to_email" text not null,
    "created_at" timestamp without time zone default now()
);


alter table "public"."linked_accounts" enable row level security;

CREATE UNIQUE INDEX linked_accounts_pkey ON public.linked_accounts USING btree (from_email, to_email);

alter table "public"."linked_accounts" add constraint "linked_accounts_pkey" PRIMARY KEY using index "linked_accounts_pkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_user_id_by_email(email text)
 RETURNS TABLE(id uuid)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY SELECT au.id FROM auth.users au WHERE au.email = $1;
END;
$function$
;

create policy "Any authenticated user can link"
on "public"."linked_accounts"
as permissive
for insert
to authenticated
with check (true);


create policy "Can only operate on row user owns - GET"
on "public"."linked_accounts"
as permissive
for select
to authenticated
using ((((auth.jwt() ->> 'email'::text) = from_email) OR ((auth.jwt() ->> 'email'::text) = to_email)));


create policy "Only user who owns can operate - UPDATE"
on "public"."linked_accounts"
as permissive
for update
to authenticated
using ((((auth.jwt() ->> 'email'::text) = from_email) OR ((auth.jwt() ->> 'email'::text) = to_email)))
with check ((((auth.jwt() ->> 'email'::text) = from_email) OR ((auth.jwt() ->> 'email'::text) = to_email)));



